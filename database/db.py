"""
INTELLOOP AI RESEARCH PLATFORM — SQLITE DATABASE LAYER
Manages persistent storage of investigations, ReAct steps, sources, claims, conflicts, logs, tools telemetry, and docs.
"""

import sqlite3
import json
import os
import time
import random
import uuid

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "intelloop.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # 1. Investigations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id TEXT PRIMARY KEY,
        question TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PLANNING',
        domain TEXT DEFAULT 'General Intelligence',
        depth TEXT DEFAULT 'Standard',
        confidence_score REAL DEFAULT 0.0,
        confidence_level TEXT DEFAULT 'MEDIUM',
        final_report TEXT,
        created_at TEXT NOT NULL,
        completed_at TEXT,
        execution_time_ms INTEGER DEFAULT 0
    )
    """)

    # 2. Steps Table (ReAct loop events)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS steps (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        step_index INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        tool_name TEXT,
        tool_input TEXT,
        observation TEXT,
        graph_node TEXT DEFAULT 'MISSION',
        timestamp TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    )
    """)

    # 3. Sources Table (Real web sources retrieved)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sources (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        publisher TEXT,
        publish_date TEXT,
        authority TEXT DEFAULT 'Medium',
        relevance REAL DEFAULT 0.85,
        source_type TEXT DEFAULT 'Web Article',
        snippet TEXT,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    )
    """)

    # 4. Claims & Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS claims (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        finding_text TEXT NOT NULL,
        status TEXT DEFAULT 'VERIFIED',
        confidence TEXT DEFAULT 'HIGH',
        evidence_strength TEXT DEFAULT 'Strong (Multi-Source)',
        supporting_source_ids TEXT DEFAULT '[]',
        raw_passages TEXT DEFAULT '[]',
        created_at TEXT NOT NULL,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    )
    """)

    # 5. Conflicting Evidence Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conflicts (
        id TEXT PRIMARY KEY,
        investigation_id TEXT NOT NULL,
        topic TEXT NOT NULL,
        source_a_name TEXT NOT NULL,
        source_a_val TEXT NOT NULL,
        source_b_name TEXT NOT NULL,
        source_b_val TEXT NOT NULL,
        explanation TEXT,
        preferred_source TEXT,
        FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
    )
    """)

    # 6. Activity Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        investigation_id TEXT,
        timestamp TEXT NOT NULL,
        agent_name TEXT NOT NULL,
        type TEXT NOT NULL,
        tool_name TEXT,
        summary TEXT NOT NULL,
        duration_ms INTEGER DEFAULT 0
    )
    """)

    # 7. Knowledge Docs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS knowledge_docs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        size TEXT DEFAULT '1.0 MB',
        pages INTEGER DEFAULT 1,
        chunks INTEGER DEFAULT 10,
        uploaded_at TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        summary TEXT,
        extracted_claims TEXT DEFAULT '[]'
    )
    """)

    # 8. Tool Statistics & Telemetry Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tool_stats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT DEFAULT 'construction',
        status TEXT DEFAULT 'active',
        total_uses INTEGER DEFAULT 0,
        success_count INTEGER DEFAULT 0,
        fail_count INTEGER DEFAULT 0,
        avg_latency_ms INTEGER DEFAULT 450,
        last_used TEXT DEFAULT 'Never',
        description TEXT
    )
    """)

    # 9. Evaluations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS evaluations (
        id TEXT PRIMARY KEY,
        scenario_type TEXT NOT NULL,
        investigation_id TEXT,
        baseline_or_autonomous TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        latency REAL DEFAULT 0.0,
        status TEXT DEFAULT 'RUNNING',
        accuracy_score REAL DEFAULT 0.0,
        completion_score REAL DEFAULT 0.0,
        reliability_score REAL DEFAULT 0.0,
        robustness_score REAL DEFAULT 0.0,
        evidence_quality_score REAL DEFAULT 0.0,
        groundedness_score REAL DEFAULT 0.0,
        hallucination_rate REAL DEFAULT 0.0,
        recovery_rate REAL DEFAULT 0.0,
        consistency_score REAL DEFAULT 0.0,
        resource_efficiency_score REAL DEFAULT 0.0,
        tool_call_count INTEGER DEFAULT 0,
        failure_count INTEGER DEFAULT 0,
        recovery_attempt_count INTEGER DEFAULT 0,
        final_result TEXT
    )
    """)

    # 10. Human Evaluations Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS human_evaluations (
        evaluation_id TEXT PRIMARY KEY,
        accuracy INTEGER DEFAULT 0,
        evidence_quality INTEGER DEFAULT 0,
        reasoning_quality INTEGER DEFAULT 0,
        final_answer_quality INTEGER DEFAULT 0,
        handled_uncertainty INTEGER DEFAULT 0,
        refused_unsupported INTEGER DEFAULT 0,
        comments TEXT,
        FOREIGN KEY (evaluation_id) REFERENCES evaluations(id) ON DELETE CASCADE
    )
    """)

    # 11. Traces & Observability Table (Task 7)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS traces (
        id TEXT PRIMARY KEY,
        trace_id TEXT NOT NULL,
        mission_id TEXT NOT NULL,
        parent_span_id TEXT,
        span_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        agent TEXT NOT NULL,
        event_type TEXT NOT NULL,
        stage TEXT NOT NULL,
        status TEXT NOT NULL,
        latency_ms INTEGER DEFAULT 0,
        metadata TEXT,
        FOREIGN KEY (mission_id) REFERENCES investigations(id) ON DELETE CASCADE
    )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_traces_mission ON traces(mission_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_traces_ts ON traces(timestamp)")

    # Seed initial tools if not present
    cursor.execute("SELECT COUNT(*) FROM tool_stats")
    if cursor.fetchone()[0] == 0:
        initial_tools = [
            ("tool-web-search", "Tavily Web Search", "Intelligence", "travel_explore", "active", 184, 184, 0, 820, "2 mins ago", "Real-time web research for current trends, news, statistics, and industry reports via Tavily Search API & live web."),
            ("tool-academic-search", "arXiv Academic Search", "Academic", "school", "active", 142, 142, 0, 410, "Just now", "Official arXiv API integration for peer-reviewed academic literature, preprints, AI/ML, and scientific papers."),
            ("tool-calculator", "Safe Calculator & Math Engine", "Compute", "calculate", "active", 110, 110, 0, 120, "Just now", "High-precision safe mathematical solver, formula evaluator, percentages, averages, and numerical analysis."),
            ("tool-fetch-source", "Source Fetcher & Scraper", "Intelligence", "description", "active", 126, 124, 2, 640, "5 mins ago", "Fetches raw HTML web pages, removes boilerplate, and extracts structured readable text passages."),
            ("tool-fact-extractor", "Fact & Numerical Extractor", "Analysis", "analytics", "active", 142, 142, 0, 480, "12 mins ago", "Extracts percentages, financial values, dates, and named policy entities with direct source links."),
            ("tool-verifier", "Claim Verification & Conflict Engine", "Verification", "verified", "active", 165, 165, 0, 380, "15 mins ago", "Evaluates multi-source evidence backing, detects statistical disagreements, and computes confidence scores."),
            ("tool-data-analyzer", "Statistical & Comparative Analyzer", "Compute", "query_stats", "active", 98, 98, 0, 520, "25 mins ago", "Performs comparative modeling, CAGR calculations, and tabular matrix synthesis."),
            ("tool-knowledge-base", "Vector Knowledge Base", "Memory", "menu_book", "active", 110, 110, 0, 310, "1 hour ago", "Dense vector search across indexed whitepapers, PDFs, and regulatory policies.")
        ]
        cursor.executemany("""
        INSERT INTO tool_stats (id, name, category, icon, status, total_uses, success_count, fail_count, avg_latency_ms, last_used, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_tools)

    conn.commit()
    conn.close()

# --- Database Operations ---

def record_tool_usage(tool_id, success=True, latency_ms=0):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE tool_stats
    SET total_uses = total_uses + 1,
        success_count = success_count + ?,
        fail_count = fail_count + ?,
        avg_latency_ms = CASE WHEN avg_latency_ms = 0 THEN ? ELSE (avg_latency_ms + ?) / 2 END,
        last_used = 'Just now'
    WHERE id = ?
    """, (1 if success else 0, 0 if success else 1, latency_ms, latency_ms, tool_id))
    conn.commit()
    conn.close()

def get_all_tool_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tool_stats ORDER BY total_uses DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def save_investigation(inv):
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id FROM investigations WHERE id = ?", (inv.get("id"),))
    exists = cursor.fetchone()
    
    if exists:
        update_fields = []
        update_values = []
        allowed_keys = ["question", "status", "domain", "depth", "confidence_score", "confidence_level", "final_report", "completed_at", "execution_time_ms"]
        for key in allowed_keys:
            if key in inv:
                update_fields.append(f"{key} = ?")
                update_values.append(inv[key])
        
        if update_fields:
            update_values.append(inv["id"])
            query = f"UPDATE investigations SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, tuple(update_values))
    else:
        cursor.execute("""
        INSERT INTO investigations (
            id, question, status, domain, depth, confidence_score, confidence_level,
            final_report, created_at, completed_at, execution_time_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            inv.get("id"), inv.get("question"), inv.get("status", "PLANNING"),
            inv.get("domain", "General Intelligence"), inv.get("depth", "Standard"),
            inv.get("confidence_score", 0.0), inv.get("confidence_level", "MEDIUM"),
            inv.get("final_report"), inv.get("created_at", time.strftime("%Y-%m-%dT%H:%M:%SZ")),
            inv.get("completed_at"), inv.get("execution_time_ms", 0)
        ))
        
    conn.commit()
    conn.close()

def get_investigation(inv_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investigations WHERE id = ?", (inv_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    inv = dict(row)
    
    # Get steps
    cursor.execute("SELECT * FROM steps WHERE investigation_id = ? ORDER BY step_index ASC", (inv_id,))
    inv["steps"] = [dict(r) for r in cursor.fetchall()]

    # Get sources
    cursor.execute("SELECT * FROM sources WHERE investigation_id = ?", (inv_id,))
    inv["sources"] = [dict(r) for r in cursor.fetchall()]

    # Get claims
    cursor.execute("SELECT * FROM claims WHERE investigation_id = ?", (inv_id,))
    inv["claims"] = []
    for cr in cursor.fetchall():
        cd = dict(cr)
        try:
            cd["supporting_source_ids"] = json.loads(cd.get("supporting_source_ids", "[]"))
            cd["raw_passages"] = json.loads(cd.get("raw_passages", "[]"))
        except:
            cd["supporting_source_ids"] = []
            cd["raw_passages"] = []
        inv["claims"].append(cd)

    # Get conflicts
    cursor.execute("SELECT * FROM conflicts WHERE investigation_id = ?", (inv_id,))
    inv["conflicts"] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return inv

def list_investigations(limit=50):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM investigations ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def delete_investigation(inv_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM investigations WHERE id = ?", (inv_id,))
    cursor.execute("DELETE FROM steps WHERE investigation_id = ?", (inv_id,))
    cursor.execute("DELETE FROM sources WHERE investigation_id = ?", (inv_id,))
    cursor.execute("DELETE FROM claims WHERE investigation_id = ?", (inv_id,))
    cursor.execute("DELETE FROM conflicts WHERE investigation_id = ?", (inv_id,))
    conn.commit()
    conn.close()

def add_step(step):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO steps (id, investigation_id, step_index, type, title, summary, tool_name, tool_input, observation, graph_node, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        step.get("id", f"step-{int(time.time()*1000)}"),
        step["investigation_id"],
        step.get("step_index", 0),
        step["type"],
        step["title"],
        step["summary"],
        step.get("tool_name"),
        json.dumps(step.get("tool_input")) if isinstance(step.get("tool_input"), (dict, list)) else step.get("tool_input"),
        step.get("observation"),
        step.get("graph_node", "MISSION"),
        step.get("timestamp", time.strftime("%H:%M:%S"))
    ))
    conn.commit()
    conn.close()

def add_source(src):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO sources (id, investigation_id, url, title, publisher, publish_date, authority, relevance, source_type, snippet)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        src.get("id", f"src-{int(time.time()*1000)}"),
        src["investigation_id"],
        src["url"],
        src["title"],
        src.get("publisher", "Web"),
        src.get("publish_date", "Recent"),
        src.get("authority", "Medium"),
        src.get("relevance", 0.85),
        src.get("source_type", "Web Article"),
        src.get("snippet", "")
    ))
    conn.commit()
    conn.close()

def add_claim(cl):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO claims (id, investigation_id, finding_text, status, confidence, evidence_strength, supporting_source_ids, raw_passages, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cl.get("id", f"claim-{int(time.time()*1000)}"),
        cl["investigation_id"],
        cl["finding_text"],
        cl.get("status", "VERIFIED"),
        cl.get("confidence", "HIGH"),
        cl.get("evidence_strength", "Strong (Multi-Source)"),
        json.dumps(cl.get("supporting_source_ids", [])),
        json.dumps(cl.get("raw_passages", [])),
        cl.get("created_at", time.strftime("%Y-%m-%dT%H:%M:%SZ"))
    ))
    conn.commit()
    conn.close()

def add_conflict(conf):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO conflicts (id, investigation_id, topic, source_a_name, source_a_val, source_b_name, source_b_val, explanation, preferred_source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        conf.get("id", f"conf-{int(time.time()*1000)}"),
        conf["investigation_id"],
        conf["topic"],
        conf["source_a_name"],
        conf["source_a_val"],
        conf["source_b_name"],
        conf["source_b_val"],
        conf.get("explanation", ""),
        conf.get("preferred_source", "")
    ))
    conn.commit()
    conn.close()

def add_log(log):
    conn = get_db()
    cursor = conn.cursor()
    row_id = log.get("id") or f"log-{int(time.time()*1000)%1000000}-{random.randint(100, 999)}"
    cursor.execute("""
    INSERT INTO activity_logs (id, investigation_id, timestamp, agent_name, type, tool_name, summary, duration_ms)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        row_id,
        log.get("investigation_id") or log.get("missionId", "SYSTEM"),
        log.get("timestamp", time.strftime("%H:%M:%S")),
        log.get("agent_name") or log.get("agentName", "Sentinel-Prime"),
        log.get("type", "Event"),
        log.get("tool_name") or log.get("toolName"),
        log.get("summary", ""),
        log.get("duration_ms") or log.get("durationMs", 0)
    ))
    conn.commit()
    conn.close()

def list_logs(limit=250):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM activity_logs 
        ORDER BY rowid DESC 
        LIMIT ?
    """, (limit,))
    rows = []
    for r in cursor.fetchall():
        d = dict(r)
        d["missionId"] = d.get("investigation_id")
        d["agentName"] = d.get("agent_name")
        d["toolName"] = d.get("tool_name")
        d["durationMs"] = d.get("duration_ms")
        rows.append(d)
    conn.close()
    return rows

def get_logs_by_mission(mission_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM activity_logs 
        WHERE investigation_id = ? 
        ORDER BY rowid ASC
    """, (mission_id,))
    rows = []
    for r in cursor.fetchall():
        d = dict(r)
        d["missionId"] = d.get("investigation_id")
        d["agentName"] = d.get("agent_name")
        d["toolName"] = d.get("tool_name")
        d["durationMs"] = d.get("duration_ms")
        rows.append(d)
    conn.close()
    return rows

def save_evaluation(eval_data):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM evaluations WHERE id = ?", (eval_data.get("id"),))
    exists = cursor.fetchone()
    
    if exists:
        update_fields = []
        update_values = []
        allowed_keys = [
            "end_time", "latency", "status", "accuracy_score", "completion_score",
            "reliability_score", "robustness_score", "evidence_quality_score",
            "groundedness_score", "hallucination_rate", "recovery_rate",
            "consistency_score", "resource_efficiency_score", "tool_call_count",
            "failure_count", "recovery_attempt_count", "final_result"
        ]
        for key in allowed_keys:
            if key in eval_data:
                update_fields.append(f"{key} = ?")
                update_values.append(eval_data[key])
        
        if update_fields:
            update_values.append(eval_data["id"])
            query = f"UPDATE evaluations SET {', '.join(update_fields)} WHERE id = ?"
            cursor.execute(query, tuple(update_values))
    else:
        cursor.execute("""
        INSERT INTO evaluations (
            id, scenario_type, investigation_id, baseline_or_autonomous,
            start_time, status
        ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            eval_data.get("id"), eval_data.get("scenario_type"),
            eval_data.get("investigation_id"), eval_data.get("baseline_or_autonomous"),
            eval_data.get("start_time", time.strftime("%Y-%m-%dT%H:%M:%SZ")),
            eval_data.get("status", "RUNNING")
        ))
    
    conn.commit()
    conn.close()

def get_evaluations(limit=50):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT e.*, h.accuracy as human_accuracy, h.evidence_quality as human_evidence_quality,
               h.reasoning_quality as human_reasoning, h.final_answer_quality as human_final,
               h.handled_uncertainty, h.refused_unsupported, h.comments
        FROM evaluations e
        LEFT JOIN human_evaluations h ON e.id = h.evaluation_id
        ORDER BY e.start_time DESC LIMIT ?
    """, (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

def save_human_evaluation(human_eval):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO human_evaluations (
        evaluation_id, accuracy, evidence_quality, reasoning_quality,
        final_answer_quality, handled_uncertainty, refused_unsupported, comments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        human_eval.get("evaluation_id"), human_eval.get("accuracy"),
        human_eval.get("evidence_quality"), human_eval.get("reasoning_quality"),
        human_eval.get("final_answer_quality"), human_eval.get("handled_uncertainty"),
        human_eval.get("refused_unsupported"), human_eval.get("comments")
    ))
    conn.commit()
    conn.close()

# --- Observability Tracing Operations (Task 7) ---

def save_trace_event(event):
    """Persists a structured agent telemetry event to SQLite (both traces and activity_logs)."""
    conn = get_db()
    cursor = conn.cursor()
    row_id = event.get("id") or f"evt-{int(time.time()*1000)%1000000}-{event.get('span_id', '0')}"
    
    # 1. Save into traces table
    cursor.execute("""
    INSERT INTO traces (
        id, trace_id, mission_id, parent_span_id, span_id, timestamp,
        agent, event_type, stage, status, latency_ms, metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        row_id,
        event.get("trace_id"),
        event.get("mission_id"),
        event.get("parent_span_id"),
        event.get("span_id"),
        event.get("timestamp", time.strftime("%Y-%m-%dT%H:%M:%SZ")),
        event.get("agent", "Sentinel-Prime"),
        event.get("event_type"),
        event.get("stage", "REASONING"),
        event.get("status", "SUCCESS"),
        event.get("latency_ms", 0),
        event.get("metadata", "{}")
    ))

    # 2. Synchronize to activity_logs table for immediate UI visibility in Activity Logs view
    meta_dict = {}
    if isinstance(event.get("metadata"), str):
        try:
            meta_dict = json.loads(event.get("metadata"))
        except Exception:
            meta_dict = {}
    elif isinstance(event.get("metadata"), dict):
        meta_dict = event.get("metadata")

    summary_text = (
        meta_dict.get("summary") or
        meta_dict.get("result_summary") or
        meta_dict.get("question") or
        f"{event.get('event_type')} ({event.get('stage')})"
    )
    tool_name = meta_dict.get("tool_name") or event.get("tool_name")
    
    time_str = event.get("timestamp", time.strftime("%H:%M:%S"))
    if "T" in str(time_str):
        time_display = str(time_str).split("T")[1][:8]
    else:
        time_display = str(time_str)[:8]

    cursor.execute("""
    INSERT INTO activity_logs (
        id, investigation_id, timestamp, agent_name, type, tool_name, summary, duration_ms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        f"log-{row_id}",
        event.get("mission_id", "SYSTEM"),
        time_display,
        event.get("agent", "Sentinel-Prime"),
        event.get("event_type"),
        tool_name,
        summary_text,
        event.get("latency_ms", 0)
    ))

    conn.commit()
    conn.close()

def get_traces_by_mission(mission_id):
    """Retrieves all chronological telemetry events for a specific mission."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM traces 
        WHERE mission_id = ? 
        ORDER BY timestamp ASC, id ASC
    """, (mission_id,))
    rows = []
    for r in cursor.fetchall():
        d = dict(r)
        if isinstance(d.get("metadata"), str):
            try:
                d["metadata"] = json.loads(d["metadata"])
            except Exception:
                pass
        rows.append(d)
    conn.close()
    return rows

def get_all_trace_missions(limit=50):
    """Retrieves list of missions with trace counts and aggregate telemetry."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            i.id as mission_id,
            i.question,
            i.status,
            i.domain,
            i.depth,
            i.confidence_score,
            i.execution_time_ms,
            i.created_at,
            i.completed_at,
            COUNT(t.id) as trace_count,
            SUM(CASE WHEN t.event_type LIKE '%TOOL%' THEN 1 ELSE 0 END) as tool_event_count,
            SUM(CASE WHEN t.status = 'FAILED' OR t.event_type LIKE '%FAIL%' OR t.event_type LIKE '%ERROR%' THEN 1 ELSE 0 END) as error_event_count,
            SUM(CASE WHEN t.event_type LIKE '%OPTIMIZ%' OR t.event_type LIKE '%PREVENT%' THEN 1 ELSE 0 END) as optimization_count
        FROM investigations i
        LEFT JOIN traces t ON i.id = t.mission_id
        GROUP BY i.id
        ORDER BY i.created_at DESC
        LIMIT ?
    """, (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# Initialize DB on load
init_db()
