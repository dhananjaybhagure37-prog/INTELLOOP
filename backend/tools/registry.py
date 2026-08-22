"""
INTELLOOP AI RESEARCH PLATFORM — CENTRAL TOOL REGISTRY
Defines structured tools, input/output schemas, and execution adapters for the ReAct Agent.
"""

import json
from backend.tools.search_tool import execute_web_search
from backend.tools.arxiv_tool import execute_academic_search
from backend.tools.calculator_tool import execute_calculator
from backend.tools.fetch_tool import fetch_source_content
from backend.tools.fact_extractor import extract_facts_from_content
from backend.tools.verifier_tool import verify_claim_against_sources, detect_statistical_conflicts
from backend.tools.data_analyzer import analyze_comparative_data
from database.db import record_tool_usage

SYSTEM_TOOLS = {
    "web_search": {
        "name": "Web Search (Tavily / Live Web)",
        "description": "Real-time web research for current information, news, market trends, government policy, statistics, and industry developments.",
        "parameters": {
            "query": {"type": "string", "description": "Search query keywords", "required": True},
            "max_results": {"type": "integer", "description": "Maximum sources to retrieve", "default": 6}
        },
        "execute": lambda args: execute_web_search(args.get("query", ""), max_results=args.get("max_results", 6))
    },
    "academic_search": {
        "name": "Academic Search (arXiv Official API)",
        "description": "Searches peer-reviewed academic papers, preprints, and scientific literature across computer science, AI/ML, physics, biology, and engineering.",
        "parameters": {
            "query": {"type": "string", "description": "Academic search terms or research topic", "required": True},
            "max_results": {"type": "integer", "description": "Maximum papers to retrieve", "default": 5}
        },
        "execute": lambda args: execute_academic_search(args.get("query", ""), max_results=args.get("max_results", 5))
    },
    "calculator": {
        "name": "Safe Calculator & Numerical Analysis",
        "description": "High-precision AST mathematical calculator for formulas, arithmetic, percentages, averages, growth rates, and financial metrics.",
        "parameters": {
            "expression": {"type": "string", "description": "Math expression or natural language calculation", "required": True}
        },
        "execute": lambda args: execute_calculator(args.get("expression") or args.get("query", ""))
    },
    "fetch_source": {
        "name": "Source Fetcher & HTML Extractor",
        "description": "Fetches live webpage HTML, removes boilerplate, and extracts structured text passages.",
        "parameters": {
            "url": {"type": "string", "description": "Target webpage URL", "required": True}
        },
        "execute": lambda args: fetch_source_content(args.get("url", ""))
    },
    "extract_facts": {
        "name": "Fact & Numerical Extractor",
        "description": "Extracts percentages, numerical figures, currency values, dates, and named policy entities.",
        "parameters": {
            "text": {"type": "string", "description": "Source text content", "required": True}
        },
        "execute": lambda args: extract_facts_from_content(args.get("text", ""), args.get("source_meta"))
    },
    "verify_claim": {
        "name": "Claim Verification & Conflict Detector",
        "description": "Cross-references factual claims against retrieved sources and evaluates confidence rating.",
        "parameters": {
            "claim": {"type": "string", "description": "Claim statement to test", "required": True},
            "sources": {"type": "array", "description": "List of sources to check against", "required": True}
        },
        "execute": lambda args: verify_claim_against_sources(args.get("claim", ""), args.get("sources", []))
    }
}

def get_tool_definitions_for_agent():
    """Returns structured JSON schemas of all registered tools for the LLM / reasoning engine."""
    defs = []
    for tool_id, tool in SYSTEM_TOOLS.items():
        defs.append({
            "tool": tool_id,
            "name": tool["name"],
            "description": tool["description"],
            "parameters": tool["parameters"]
        })
    return defs

def execute_registered_tool(tool_id, arguments):
    """Executes a tool from the registry with telemetry tracking."""
    # Normalize aliases
    norm_id = "web_search" if tool_id in ("searchWeb", "web_search", "tool-web-search", "tavily") else \
              "academic_search" if tool_id in ("searchAcademicPapers", "academic_search", "tool-academic-search", "arxiv") else \
              "calculator" if tool_id in ("calculator", "safeCalculator", "tool-calculator") else \
              "fetch_source" if tool_id in ("fetchSource", "fetch_source", "tool-fetch-source") else tool_id

    tool = SYSTEM_TOOLS.get(norm_id)
    if not tool:
        return {
            "success": False,
            "error": f"Tool '{tool_id}' not found in registry.",
            "observation": f"Tool '{tool_id}' does not exist in registry."
        }

    try:
        res = tool["execute"](arguments)
        record_tool_usage(f"tool-{norm_id}", success=res.get("success", True), latency_ms=res.get("elapsed_ms", 300))
        return res
    except Exception as e:
        record_tool_usage(f"tool-{norm_id}", success=False, latency_ms=100)
        return {
            "success": False,
            "error": str(e),
            "observation": f"Execution of tool '{tool_id}' failed: {str(e)}"
        }
