import json
import random
from langchain_core.tools import tool
from backend.tools.registry import execute_registered_tool

# Global chaos mode state (set by orchestrator per run)
_CHAOS_MODE = False

def set_chaos_mode(active: bool):
    global _CHAOS_MODE
    _CHAOS_MODE = active

def inject_chaos(tool_name: str, fail_probability: float = 0.2):
    """If chaos mode is active, simulate a random tool failure."""
    if _CHAOS_MODE and random.random() < fail_probability:
        raise Exception(f"[CHAOS MODE] Tool '{tool_name}' failed to respond (ConnectionTimeout). The agent must attempt a fallback strategy or replan.")

@tool
def web_search(query: str, max_results: int = 4) -> str:
    """Real-time web research for current information, news, market trends, government policy, statistics, and industry developments."""
    inject_chaos("web_search", 0.3)
    res = execute_registered_tool("web_search", {"query": query, "max_results": max_results})
    return json.dumps(res, indent=2)

@tool
def academic_search(query: str, max_results: int = 4) -> str:
    """Searches peer-reviewed academic papers, preprints, and scientific literature across computer science, AI/ML, physics, biology, and engineering on arXiv."""
    inject_chaos("academic_search", 0.3)
    res = execute_registered_tool("academic_search", {"query": query, "max_results": max_results})
    return json.dumps(res, indent=2)

@tool
def calculator(expression: str) -> str:
    """High-precision AST mathematical calculator for formulas, arithmetic, percentages, averages, growth rates, and financial metrics."""
    res = execute_registered_tool("calculator", {"expression": expression})
    return json.dumps(res, indent=2)

@tool
def fetch_source(url: str) -> str:
    """Fetches live webpage HTML, removes boilerplate, and extracts structured text passages."""
    inject_chaos("fetch_source", 0.2)
    res = execute_registered_tool("fetch_source", {"url": url})
    return json.dumps(res, indent=2)

def get_all_langgraph_tools():
    return [web_search, academic_search, calculator, fetch_source]
