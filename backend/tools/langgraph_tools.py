import json
from langchain_core.tools import tool
from backend.tools.registry import execute_registered_tool

_CHAOS_MODE = False

def set_chaos_mode(active: bool):
    global _CHAOS_MODE
    _CHAOS_MODE = active

@tool
def web_search(query: str, max_results: int = 5) -> str:
    """Real-time web research for current information, news, market trends, government policy, statistics, and industry developments."""
    res = execute_registered_tool("web_search", {"query": query, "max_results": max_results})
    return json.dumps(res, indent=2)

@tool
def academic_search(query: str, max_results: int = 5) -> str:
    """Searches peer-reviewed academic papers, scientific literature, preprints, and research studies across science, engineering, physics, biology, and AI."""
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
    res = execute_registered_tool("fetch_source", {"url": url})
    return json.dumps(res, indent=2)

def get_all_langgraph_tools():
    return [web_search, academic_search, calculator, fetch_source]
