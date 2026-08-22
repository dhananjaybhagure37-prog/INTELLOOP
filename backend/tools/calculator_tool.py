"""
INTELLOOP AI RESEARCH PLATFORM — SAFE CALCULATOR & NUMERICAL ANALYZER TOOL
Performs safe mathematical calculations, percentages, formulas, and statistical summaries.
Uses Python AST parsing to guarantee zero arbitrary code execution.
"""

import ast
import operator
import math
import re
import time

# Supported operators for safe AST evaluation
SAFE_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: operator.pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}

SAFE_FUNCTIONS = {
    'abs': abs,
    'round': round,
    'sqrt': math.sqrt,
    'pow': math.pow,
    'min': min,
    'max': max,
    'sum': sum,
    'floor': math.floor,
    'ceil': math.ceil,
    'log': math.log,
    'log10': math.log10
}

def safe_eval_node(node):
    """Recursively evaluates AST nodes safely without eval()."""
    if isinstance(node, ast.Constant):
        if isinstance(node.value, (int, float)):
            return node.value
        raise ValueError(f"Unsupported constant type: {type(node.value)}")
    elif isinstance(node, ast.Num):  # Python < 3.8 compat
        return node.n
    elif isinstance(node, ast.BinOp):
        left = safe_eval_node(node.left)
        right = safe_eval_node(node.right)
        op_type = type(node.op)
        if op_type not in SAFE_OPERATORS:
            raise ValueError(f"Unsupported binary operator: {op_type.__name__}")
        if op_type in (ast.Div, ast.FloorDiv, ast.Mod) and right == 0:
            raise ZeroDivisionError("Division by zero in formula calculation.")
        return SAFE_OPERATORS[op_type](left, right)
    elif isinstance(node, ast.UnaryOp):
        operand = safe_eval_node(node.operand)
        op_type = type(node.op)
        if op_type not in SAFE_OPERATORS:
            raise ValueError(f"Unsupported unary operator: {op_type.__name__}")
        return SAFE_OPERATORS[op_type](operand)
    elif isinstance(node, ast.Call):
        if not isinstance(node.func, ast.Name) or node.func.id not in SAFE_FUNCTIONS:
            raise ValueError(f"Unsupported function call: {getattr(node.func, 'id', 'unknown')}")
        args = [safe_eval_node(arg) for arg in node.args]
        return SAFE_FUNCTIONS[node.func.id](*args)
    elif isinstance(node, ast.List):
        return [safe_eval_node(elt) for elt in node.elts]
    else:
        raise ValueError(f"Disallowed expression element: {type(node).__name__}")

def evaluate_safe_math(expression):
    """Parses and safely evaluates a math string."""
    cleaned = expression.strip().replace('^', '**').replace('×', '*').replace('÷', '/')
    tree = ast.parse(cleaned, mode='eval')
    return safe_eval_node(tree.body)

def parse_natural_language_math(text):
    """
    Detects natural language calculations:
    - '15% of 800' -> 800 * 0.15 = 120
    - '25% of 2400' -> 2400 * 0.25 = 600
    - 'percentage increase from 200 to 250' -> ((250 - 200) / 200) * 100 = 25%
    - '10% increase on 1500' -> 1500 * 1.10 = 1650
    - 'average of [10, 20, 30]' or 'average of 10, 20, 30' -> 20
    """
    text_clean = text.lower().strip()

    # Pattern 1: X% of Y
    m_pct_of = re.search(r'(\d+(?:\.\d+)?)\s*%\s*(?:of|from)\s*(\$?\d+[\d,]*(?:\.\d+)?)', text_clean)
    if m_pct_of:
        pct = float(m_pct_of.group(1))
        val = float(m_pct_of.group(2).replace('$', '').replace(',', ''))
        res = (pct / 100.0) * val
        expr = f"{val} * ({pct} / 100)"
        return {
            "expression": expr,
            "result": res,
            "operation": f"{pct}% of {val}",
            "formatted": f"{res:,.2f}".rstrip('0').rstrip('.') if res % 1 != 0 else f"{int(res):,}"
        }

    # Pattern 2: Percentage increase/decrease from X to Y
    m_growth = re.search(r'percentage\s+(?:increase|growth|change|decrease)\s+(?:from\s+)?(\$?\d+[\d,]*(?:\.\d+)?)\s+to\s+(\$?\d+[\d,]*(?:\.\d+)?)', text_clean)
    if m_growth:
        val1 = float(m_growth.group(1).replace('$', '').replace(',', ''))
        val2 = float(m_growth.group(2).replace('$', '').replace(',', ''))
        if val1 == 0:
            raise ZeroDivisionError("Cannot calculate percentage increase from 0 baseline.")
        pct_change = ((val2 - val1) / val1) * 100.0
        expr = f"(({val2} - {val1}) / {val1}) * 100"
        return {
            "expression": expr,
            "result": pct_change,
            "operation": f"Percentage change from {val1} to {val2}",
            "formatted": f"{pct_change:+.2f}%"
        }

    # Pattern 3: X% increase on Y / Y with X% increase
    m_inc_on = re.search(r'(\d+(?:\.\d+)?)\s*%\s*(?:increase|raise|markup)\s*(?:on|to|for)\s*(\$?\d+[\d,]*(?:\.\d+)?)', text_clean)
    if m_inc_on:
        pct = float(m_inc_on.group(1))
        val = float(m_inc_on.group(2).replace('$', '').replace(',', ''))
        res = val * (1.0 + (pct / 100.0))
        expr = f"{val} * (1 + {pct} / 100)"
        return {
            "expression": expr,
            "result": res,
            "operation": f"{val} + {pct}% increase",
            "formatted": f"{res:,.2f}".rstrip('0').rstrip('.') if res % 1 != 0 else f"{int(res):,}"
        }

    # Pattern 4: Average of list of numbers
    m_avg = re.search(r'average\s+(?:of\s+)?\[?([0-9.,\s]+)\]?', text_clean)
    if m_avg:
        nums = [float(n.strip().replace(',', '')) for n in re.split(r'[,;\s]+', m_avg.group(1)) if n.strip().replace('.', '', 1).isdigit()]
        if nums:
            res = sum(nums) / len(nums)
            expr = f"sum({nums}) / {len(nums)}"
            return {
                "expression": expr,
                "result": res,
                "operation": f"Average of {len(nums)} numbers",
                "formatted": f"{res:,.2f}".rstrip('0').rstrip('.') if res % 1 != 0 else f"{int(res):,}"
            }

    # Default: Try to isolate math expression using regex
    # Match strings with numbers and operators: e.g. 2400 * 0.25, (450 + 200) / 2
    expr_match = re.search(r'([0-9\.\s\+\-\*\/\(\)\^\%]+)', text)
    if expr_match:
        cand = expr_match.group(1).strip()
        if re.search(r'[\+\-\*\/\%]', cand) and any(c.isdigit() for c in cand):
            res = evaluate_safe_math(cand)
            return {
                "expression": cand,
                "result": res,
                "operation": "Arithmetic Calculation",
                "formatted": f"{res:,.2f}".rstrip('0').rstrip('.') if isinstance(res, (int, float)) and res % 1 != 0 else f"{int(res):,}" if isinstance(res, (int, float)) else str(res)
            }

    raise ValueError(f"Could not parse a valid mathematical expression from: \"{text}\"")

def execute_calculator(expression_or_text):
    """
    Main tool execution entry point for the ReAct agent.
    Safely computes results, formatting, and returns observation.
    """
    start_time = time.time()
    try:
        # First try natural language parser
        try:
            parsed = parse_natural_language_math(expression_or_text)
            res = parsed["result"]
            expr = parsed["expression"]
            formatted = parsed["formatted"]
            op = parsed["operation"]
        except Exception:
            # Fallback to direct safe AST math
            res = evaluate_safe_math(expression_or_text)
            expr = expression_or_text.strip()
            formatted = f"{res:,.2f}".rstrip('0').rstrip('.') if isinstance(res, (int, float)) and res % 1 != 0 else f"{int(res):,}" if isinstance(res, (int, float)) else str(res)
            op = "Direct Formula Evaluation"

        elapsed_ms = int((time.time() - start_time) * 1000)
        return {
            "success": True,
            "tool": "calculator",
            "operation": op,
            "expression": expr,
            "result": res,
            "formatted_result": formatted,
            "elapsed_ms": elapsed_ms,
            "observation": f"Calculator evaluated formula: {expr} = {formatted}"
        }
    except Exception as e:
        elapsed_ms = int((time.time() - start_time) * 1000)
        return {
            "success": False,
            "tool": "calculator",
            "error": str(e),
            "elapsed_ms": elapsed_ms,
            "observation": f"Calculator execution error: {str(e)}"
        }
