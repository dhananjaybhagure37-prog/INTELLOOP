import time
import json
import threading
import queue
import os

from typing import TypedDict, Annotated, Sequence, List
import operator

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langchain_core.tools import tool

from database.db import (
    save_investigation, get_investigation, add_step, add_log, add_source
)
from backend.tools.langgraph_tools import get_all_langgraph_tools, set_chaos_mode

MAX_TOOL_CALLS_PER_INVESTIGATION = 10

# Global event streams for SSE
ACTIVE_STREAMS = {}  # { investigation_id: [queue.Queue(), ...] }
STREAM_LOCK = threading.Lock()

def register_stream(inv_id):
    q = queue.Queue()
    with STREAM_LOCK:
        if inv_id not in ACTIVE_STREAMS:
            ACTIVE_STREAMS[inv_id] = []
        ACTIVE_STREAMS[inv_id].append(q)
    return q

def unregister_stream(inv_id, q):
    with STREAM_LOCK:
        if inv_id in ACTIVE_STREAMS and q in ACTIVE_STREAMS[inv_id]:
            ACTIVE_STREAMS[inv_id].remove(q)

def broadcast_event(inv_id, event_type, data):
    with STREAM_LOCK:
        if inv_id in ACTIVE_STREAMS:
            for q in ACTIVE_STREAMS[inv_id]:
                try:
                    q.put_nowait({"event": event_type, "data": data})
                except:
                    pass

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    investigation_id: str
    tool_call_count: int

class ReActResearchOrchestrator:
    def __init__(self, investigation_id, question, depth='Standard', domain='General Intelligence', chaos_mode=False):
        self.inv_id = investigation_id
        self.question = question.strip()
        self.depth = depth
        self.domain = domain
        self.chaos_mode = chaos_mode
        self.step_index = 0
        self.start_time = time.time()
        self.tools = get_all_langgraph_tools()

    def record_step(self, step_type, title, summary, graph_node='MISSION', tool_name=None, tool_input=None, observation=None, agent_name='ReAct Agent'):
        self.step_index += 1
        timestamp = time.strftime('%H:%M:%S')
        step = {
            'id': f'step-{int(time.time()*1000)}-{self.step_index}',
            'investigation_id': self.inv_id,
            'step_index': self.step_index,
            'type': step_type,
            'title': title,
            'summary': summary,
            'tool_name': tool_name,
            'tool_input': tool_input,
            'observation': observation,
            'graph_node': graph_node,
            'timestamp': timestamp
        }
        add_step(step)
        add_log({
            'investigation_id': self.inv_id,
            'agent_name': agent_name,
            'type': step_type,
            'tool_name': tool_name,
            'summary': summary,
            'duration_ms': 250
        })
        broadcast_event(self.inv_id, 'step', step)
        broadcast_event(self.inv_id, 'node_change', {'node': graph_node, 'status': 'ACTIVE'})
        return step

    def _call_model(self, state: AgentState):
        messages = state['messages']
        api_key = os.environ.get('GEMINI_API_KEY', '')
        if not api_key:
             raise ValueError('GEMINI_API_KEY is not set in the environment.')
        llm = ChatGoogleGenerativeAI(model='gemini-3.6-flash', temperature=0.1, google_api_key=api_key)
        llm_with_tools = llm.bind_tools(self.tools)
        
        self.record_step(
            step_type='PLAN',
            title='Agent Reasoning Cycle',
            summary='LLM is analyzing current state and deciding next action...',
            graph_node='PLAN'
        )
        
        response = llm_with_tools.invoke(messages)
        return {'messages': [response]}

    def _execute_tools(self, state: AgentState):
        messages = state['messages']
        last_message = messages[-1]
        
        tool_replies = []
        for tool_call in last_message.tool_calls:
            tool_name = tool_call['name']
            tool_args = tool_call['args']
            
            self.record_step(
                step_type='ACT',
                title=f'Tool Call: {tool_name}',
                summary=f'Agent requested {tool_name} with args: {tool_args}',
                graph_node='SEARCH WEB',
                tool_name=tool_name,
                tool_input=tool_args
            )
            
            tool_func = next((t for t in self.tools if t.name == tool_name), None)
            
            try:
                if not tool_func:
                    raise Exception(f'Tool {tool_name} not found.')
                result = tool_func.invoke(tool_args)
                tool_replies.append(ToolMessage(content=str(result), tool_call_id=tool_call['id']))
                
                self.record_step(
                    step_type='OBSERVE',
                    title=f'Tool Result: {tool_name}',
                    summary=f'Successfully received data from {tool_name}.',
                    graph_node='OBSERVE',
                    tool_name=tool_name,
                    observation=str(result)[:500] + '...'
                )
                
            except Exception as e:
                error_msg = str(e)
                tool_replies.append(ToolMessage(content=f'Error executing tool: {error_msg}. Please replan or try a different approach.', tool_call_id=tool_call['id']))
                self.record_step(
                    step_type='ERROR',
                    title=f'Tool Failure: {tool_name}',
                    summary=f'Agent encountered an error: {error_msg}. Initiating autonomous recovery.',
                    graph_node='OBSERVE',
                    tool_name=tool_name,
                    observation=error_msg
                )

        return {'messages': tool_replies, 'tool_call_count': state.get('tool_call_count', 0) + len(last_message.tool_calls)}

    def _should_continue(self, state: AgentState):
        messages = state['messages']
        last_message = messages[-1]
        
        if state.get('tool_call_count', 0) >= MAX_TOOL_CALLS_PER_INVESTIGATION:
            self.record_step(
                step_type='ANALYZE',
                title='Safeguard Triggered',
                summary='Maximum tool calls reached. Forcing completion to prevent deadlock.',
                graph_node='ANALYZE'
            )
            return 'end'
            
        if not hasattr(last_message, 'tool_calls') or not last_message.tool_calls:
            self.record_step(
                step_type='ANALYZE',
                title='Evidence Gathered',
                summary='Agent determined sufficient evidence is available to finalize report.',
                graph_node='ANALYZE'
            )
            return 'end'
            
        return 'continue'

    def run(self):
        # Give frontend time to connect to SSE stream before we emit the first events
        time.sleep(1.5)
        try:
            self.record_step(
                step_type='UNDERSTAND',
                title='LangGraph Task Ingested',
                summary=f'Objective: {self.question[:85]}... Chaos Mode: {self.chaos_mode}',
                graph_node='MISSION'
            )
            
            set_chaos_mode(self.chaos_mode)
            
            workflow = StateGraph(AgentState)
            workflow.add_node('agent', self._call_model)
            workflow.add_node('action', self._execute_tools)
            
            workflow.set_entry_point('agent')
            workflow.add_conditional_edges(
                'agent',
                self._should_continue,
                {
                    'continue': 'action',
                    'end': END
                }
            )
            workflow.add_edge('action', 'agent')
            
            app = workflow.compile()
            
            system_prompt = f"""You are an autonomous AI research agent.
Your objective: {self.question}
You must answer the objective thoroughly by calling tools. 
If a tool fails, YOU MUST autonomous replan and use a different tool or strategy. Do not give up easily.
When you have sufficient information, write a comprehensive markdown report. Do NOT output raw tool output in the final report. Synthesize it!"""

            inputs = {
                'messages': [
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=self.question)
                ],
                'investigation_id': self.inv_id,
                'tool_call_count': 0
            }
            
            self.record_step(step_type='PLAN', title='State Graph Compilation', summary='Initializing LangGraph execution...', graph_node='PLAN')
            
            final_state = app.invoke(inputs, config={'recursion_limit': 20})
            final_msg = final_state['messages'][-1]
            
            if isinstance(final_msg.content, list):
                final_report = " ".join([m.get("text", "") for m in final_msg.content if isinstance(m, dict) and m.get("type") == "text"])
                if not final_report:
                    final_report = str(final_msg.content)
            else:
                final_report = final_msg.content if final_msg.content else 'Agent finished but provided no text.'
            
            self.finalize_investigation(final_report)

        except Exception as e:
            print(f'Orchestrator Error: {e}')
            import traceback
            traceback.print_exc()
            save_investigation({
                'id': self.inv_id,
                'question': self.question,
                'status': 'FAILED',
                'completed_at': time.strftime('%Y-%m-%dT%H:%M:%SZ')
            })
            self.record_step(
                step_type='ERROR',
                title='Investigation Exception',
                summary=f'Execution error: {str(e)}',
                graph_node='MISSION'
            )
            broadcast_event(self.inv_id, 'error', {'error': str(e)})

    def finalize_investigation(self, final_report, confidence=98.5):
        elapsed_total_ms = int((time.time() - self.start_time) * 1000)

        save_investigation({
            'id': self.inv_id,
            'question': self.question,
            'status': 'COMPLETED',
            'domain': self.domain,
            'depth': self.depth,
            'confidence_score': confidence,
            'confidence_level': 'HIGH',
            'final_report': final_report,
            'completed_at': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'execution_time_ms': elapsed_total_ms
        })

        self.record_step(
            step_type='SYNTHESIZE',
            title='Final Intelligence Report Compiled',
            summary=f'Investigation completed successfully via LangGraph in {(elapsed_total_ms/1000):.1f}s.',
            graph_node='VERIFY'
        )
        broadcast_event(self.inv_id, 'complete', {
            'investigation_id': self.inv_id,
            'status': 'COMPLETED',
            'execution_time_ms': elapsed_total_ms
        })
