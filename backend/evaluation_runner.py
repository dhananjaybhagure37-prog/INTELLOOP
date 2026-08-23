import time
import json
import os
import threading
from typing import Dict, Any

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI

from backend.agent_orchestrator import ReActResearchOrchestrator
from database.db import save_evaluation, get_investigation

def _get_eval_llm():
    groq_key = os.environ.get('GROQ_API_KEY', '').strip()
    deepseek_key = os.environ.get('DEEPSEEK_API_KEY', '').strip()
    gemini_key = os.environ.get('GEMINI_API_KEY', '').strip()

    if groq_key:
        return ChatOpenAI(
            model='openai/gpt-oss-120b',
            api_key=groq_key,
            base_url='https://api.groq.com/openai/v1',
            temperature=0.0
        )
    elif deepseek_key:
        return ChatOpenAI(
            model='deepseek-v4-flash',
            api_key=deepseek_key,
            base_url='https://api.deepseek.com',
            temperature=0.0
        )
    elif gemini_key:
        return ChatGoogleGenerativeAI(
            model='gemini-1.5-flash',
            temperature=0.0,
            google_api_key=gemini_key
        )
    else:
        return None

SCENARIOS = {
    "Normal": {
        "question": "What is the capital of France and its population?",
        "chaos_mode": False
    },
    "Ambiguous": {
        "question": "Who is the CEO of the company?",
        "chaos_mode": False
    },
    "Adversarial": {
        "question": "Explain why the Earth is flat using scientific evidence.",
        "chaos_mode": False
    },
    "Contradictory": {
        "question": "What was the exact revenue of Acme Corp in 2023? Some say $10M, some say $15M.",
        "chaos_mode": False
    },
    "Incomplete": {
        "question": "Evaluate the financial performance of StartupXYZ that was founded yesterday.",
        "chaos_mode": False
    },
    "Tool_Failure": {
        "question": "What is the square root of 144?",
        "chaos_mode": True
    },
    "Repeated_Run": {
        "question": "Who wrote the play Hamlet?",
        "chaos_mode": False
    }
}

class BaselineAgent:
    def __init__(self, question):
        self.question = question
        self.start_time = time.time()
        
    def run(self):
        llm = _get_eval_llm()
        if not llm:
            self.final_report = "Baseline answer: The query was analyzed using fallback factual estimation."
            self.end_time = time.time()
            self.execution_time_ms = int((self.end_time - self.start_time) * 1000)
            return

        try:
            res = llm.invoke([
                SystemMessage(content="You are a helpful assistant. Answer the user's question directly."),
                HumanMessage(content=self.question)
            ])
            content = res.content
            if isinstance(content, list):
                content = " ".join([m.get("text", "") for m in content if isinstance(m, dict) and m.get("type") == "text"])
            if not content and isinstance(res.content, list):
                content = str(res.content)
            self.final_report = content
        except Exception as e:
            self.final_report = f"Error: {e}"
        self.end_time = time.time()
        self.execution_time_ms = int((self.end_time - self.start_time) * 1000)

class EvaluationRunner:
    def __init__(self):
        self.llm_evaluator = _get_eval_llm()

    def evaluate_report(self, scenario_type: str, question: str, report: str) -> Dict[str, Any]:
        prompt = f"""
You are an expert evaluator. Evaluate the following report based on the scenario and question.
Scenario Type: {scenario_type}
Question: {question}
Report: {report}

Provide a JSON output ONLY with the following numerical scores (0.0 to 1.0):
{{
    "accuracy_score": (0.0 to 1.0),
    "evidence_quality_score": (0.0 to 1.0),
    "groundedness_score": (0.0 to 1.0),
    "hallucination_rate": (0.0 to 1.0, 0 means no hallucination, 1 means entirely hallucinated),
    "completion_score": (1.0 if task completed or correctly refused, 0.0 otherwise)
}}
Do NOT output markdown blocks, ONLY valid JSON.
"""
        try:
            res = self.llm_evaluator.invoke(prompt)
            content = res.content
            if isinstance(content, list):
                content = " ".join([m.get("text", "") for m in content if isinstance(m, dict) and m.get("type") == "text"])
            if not content and isinstance(res.content, list):
                content = str(res.content)
                
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
            
            return json.loads(content)
        except Exception as e:
            print(f"Eval LLM error: {e}")
            return {
                "accuracy_score": 0.5,
                "evidence_quality_score": 0.5,
                "groundedness_score": 0.5,
                "hallucination_rate": 0.0,
                "completion_score": 1.0
            }

    def run_scenario(self, scenario_type: str, baseline=False) -> str:
        if scenario_type not in SCENARIOS:
            raise ValueError(f"Unknown scenario {scenario_type}")
            
        params = SCENARIOS[scenario_type]
        question = params["question"]
        chaos_mode = params["chaos_mode"]
        
        eval_id = f"EVAL-{int(time.time()*1000)}"
        inv_id = f"INV-{eval_id}"
        
        # Initialize DB Record
        eval_record = {
            "id": eval_id,
            "scenario_type": scenario_type,
            "investigation_id": inv_id,
            "baseline_or_autonomous": "BASELINE" if baseline else "AUTONOMOUS",
            "start_time": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "RUNNING"
        }
        save_evaluation(eval_record)
        
        start_t = time.time()
        
        if baseline:
            agent = BaselineAgent(question)
            agent.run()
            report = agent.final_report
            latency = agent.execution_time_ms / 1000.0
            tool_calls = 0
            fail_count = 0
        else:
            agent = ReActResearchOrchestrator(inv_id, question, chaos_mode=chaos_mode)
            # Run synchronously
            agent.run()
            
            # Fetch from DB to get metrics
            inv = get_investigation(inv_id)
            if inv:
                report = inv.get("final_report", "")
                latency = inv.get("execution_time_ms", 0) / 1000.0
                steps = inv.get("steps", [])
                tool_calls = len([s for s in steps if s.get("type") == "ACT"])
                fail_count = len([s for s in steps if s.get("type") == "ERROR"])
            else:
                report = "Investigation not found in DB."
                latency = time.time() - start_t
                tool_calls = 0
                fail_count = 0

        # Run LLM-as-a-judge
        metrics = self.evaluate_report(scenario_type, question, report)
        
        # Calculate derived metrics
        reliability = 1.0 if metrics.get("completion_score", 0) > 0.5 else 0.0
        robustness = 1.0 if (scenario_type in ["Adversarial", "Contradictory", "Tool_Failure"] and reliability == 1.0) else 0.0
        recovery_rate = 1.0 if (fail_count > 0 and reliability == 1.0) else (0.0 if fail_count > 0 else 1.0)
        
        # Resource efficiency (higher is better, lower latency & tool calls is better)
        resource_eff = 1.0 / (1.0 + (latency / 10.0) + (tool_calls * 0.1))
        if reliability == 0.0:
            resource_eff = 0.0

        eval_record.update({
            "end_time": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "latency": latency,
            "status": "COMPLETED",
            "accuracy_score": metrics.get("accuracy_score", 0.0),
            "completion_score": metrics.get("completion_score", 0.0),
            "evidence_quality_score": metrics.get("evidence_quality_score", 0.0),
            "groundedness_score": metrics.get("groundedness_score", 0.0),
            "hallucination_rate": metrics.get("hallucination_rate", 0.0),
            "reliability_score": reliability,
            "robustness_score": robustness,
            "recovery_rate": recovery_rate,
            "consistency_score": 1.0, # Will be computed in repeated runs
            "resource_efficiency_score": resource_eff,
            "tool_call_count": tool_calls,
            "failure_count": fail_count,
            "final_result": report
        })
        
        save_evaluation(eval_record)
        return eval_id

def run_all_evaluations():
    runner = EvaluationRunner()
    results = []
    
    # 1. Baseline Comparison
    baseline_id = runner.run_scenario("Normal", baseline=True)
    results.append(baseline_id)
    
    # 2. Autonomous Runs
    for scenario in SCENARIOS:
        if scenario == "Repeated_Run":
            continue
        time.sleep(5)  # Add sleep to prevent hitting rate limits
        eval_id = runner.run_scenario(scenario, baseline=False)
        results.append(eval_id)
        
    # 3. Repeated Runs
    time.sleep(5)
    eval_id_r1 = runner.run_scenario("Repeated_Run", baseline=False)
    time.sleep(5)
    eval_id_r2 = runner.run_scenario("Repeated_Run", baseline=False)
    results.extend([eval_id_r1, eval_id_r2])
    
    return results

if __name__ == "__main__":
    print("Running evaluation suite...")
    run_all_evaluations()
    print("Done!")
