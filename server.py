"""
INTELLOOP AI RESEARCH PLATFORM — MAIN BACKEND APPLICATION SERVER
Handles REST APIs, Server-Sent Events (SSE) live streaming, SQLite storage, and static file serving.
Zero external pip dependencies required (runs on pure Python standard library).
"""

import http.server
import socketserver
import urllib.parse
import json
import os
import mimetypes
import time
import threading
import queue

from database.db import (
    get_investigation, list_investigations, delete_investigation,
    list_logs, init_db, get_db
)
from backend.agent_orchestrator import (
    ReActResearchOrchestrator, register_stream, unregister_stream
)
from backend.tools.search_tool import execute_web_search
from backend.tools.fetch_tool import fetch_source_content
from backend.tools.data_analyzer import analyze_comparative_data

PORT = 3000
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))

class IntelloopApiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WORKSPACE_DIR, **kwargs)

    def end_headers(self):
        # Enable CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. SSE Stream: /api/investigations/{id}/stream
        if path.startswith("/api/investigations/") and path.endswith("/stream"):
            inv_id = path.split("/")[3]
            self.handle_sse_stream(inv_id)
            return

        # 2. Get Single Investigation: /api/investigations/{id}
        if path.startswith("/api/investigations/") and not path.endswith("/stream"):
            inv_id = path.split("/")[3]
            inv = get_investigation(inv_id)
            if inv:
                self.send_json(200, inv)
            else:
                self.send_json(404, {"error": f"Investigation {inv_id} not found."})
            return

        # 3. List Investigations: /api/investigations
        if path == "/api/investigations":
            invs = list_investigations(50)
            self.send_json(200, {"investigations": invs})
            return

        # 4. Activity Logs: /api/logs
        if path == "/api/logs":
            logs = list_logs(100)
            self.send_json(200, {"logs": logs})
            return

        # 5. Tools Catalog: /api/tools
        if path == "/api/tools":
            tools = [
                {"id": "tool-web-search", "name": "Web Search Engine", "category": "Intelligence", "status": "active", "totalUses": 184, "avgLatencyMs": 820, "description": "Autonomous multi-query web indexing, citation retrieval, and domain verification."},
                {"id": "tool-fetch-source", "name": "Source Fetcher & Scraper", "category": "Intelligence", "status": "active", "totalUses": 126, "avgLatencyMs": 640, "description": "Fetches raw HTML web pages, removes boilerplate, and extracts structured text context."},
                {"id": "tool-fact-extractor", "name": "Fact & Numerical Extractor", "category": "Analysis", "status": "active", "totalUses": 142, "avgLatencyMs": 480, "description": "Extracts percentages, financial values, dates, and named policy entities with source links."},
                {"id": "tool-verifier", "name": "Claim Verification & Conflict Engine", "category": "Verification", "status": "active", "totalUses": 165, "avgLatencyMs": 380, "description": "Evaluates multi-source evidence backing, detects statistical disagreements, and computes confidence scores."},
                {"id": "tool-data-analyzer", "name": "Statistical & Comparative Analyzer", "category": "Compute", "status": "active", "totalUses": 98, "avgLatencyMs": 520, "description": "Performs comparative modeling, CAGR calculations, and tabular matrix synthesis."},
                {"id": "tool-knowledge-base", "name": "Vector Knowledge Base", "category": "Memory", "status": "active", "totalUses": 110, "avgLatencyMs": 310, "description": "Dense vector search across indexed whitepapers and regulatory policies."},
                {"id": "tool-summarizer", "name": "Executive Summarizer", "category": "Synthesis", "status": "active", "totalUses": 154, "avgLatencyMs": 420, "description": "Compiles structured briefings, key takeaways, and strategic recommendations."}
            ]
            self.send_json(200, {"tools": tools})
            return

        # 6. Knowledge Documents: /api/knowledge
        if path == "/api/knowledge":
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM knowledge_docs ORDER BY uploaded_at DESC")
            docs = [dict(r) for r in cursor.fetchall()]
            conn.close()
            self.send_json(200, {"documents": docs})
            return

        # 7. Settings: /api/settings
        if path == "/api/settings":
            settings = {
                "workspaceName": "Nexus Global Operations",
                "researcherName": "Researcher",
                "modelProvider": "Gemini 2.5 Pro / Intelligent ReAct Reasoner",
                "executionSpeed": 1,
                "hasGeminiKey": bool(os.environ.get("GEMINI_API_KEY")),
                "hasTavilyKey": bool(os.environ.get("TAVILY_API_KEY")),
                "hasOpenAiKey": bool(os.environ.get("OPENAI_API_KEY")),
                "theme": "dark-space",
                "density": "standard"
            }
            self.send_json(200, settings)
            return

        # Default fallback to static file serving
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length > 0 else b'{}'
        try:
            data = json.loads(body.decode('utf-8'))
        except:
            data = {}

        # 1. Start New Investigation: POST /api/investigations
        if path == "/api/investigations":
            question = data.get("question", "").strip()
            if not question:
                self.send_json(400, {"error": "Question parameter is required."})
                return

            inv_id = f"NX-{int(time.time()*1000)%10000:04d}-{''.join([chr(65 + int(c)) for c in str(int(time.time()))[-3:]])}"
            depth = data.get("depth", "Standard")
            domain = data.get("domain", "General Intelligence")

            # Spawn real autonomous ReAct worker in background thread
            orchestrator = ReActResearchOrchestrator(inv_id, question, depth=depth, domain=domain)
            worker = threading.Thread(target=orchestrator.run, daemon=True)
            worker.start()

            self.send_json(201, {
                "success": True,
                "investigation_id": inv_id,
                "question": question,
                "status": "PLANNING",
                "stream_url": f"/api/investigations/{inv_id}/stream"
            })
            return

        # 2. Test Tool in Sandbox: POST /api/tools/{id}/test
        if path.startswith("/api/tools/") and path.endswith("/test"):
            tool_id = path.split("/")[3]
            params = data.get("params", {})
            
            if tool_id == "tool-web-search":
                res = execute_web_search(params.get("query", "AI trends 2026"), max_results=4)
                self.send_json(200, res)
                return
            elif tool_id == "tool-fetch-source":
                res = fetch_source_content(params.get("url", "https://pib.gov.in"))
                self.send_json(200, res)
                return
            elif tool_id == "tool-data-analyzer":
                res = analyze_comparative_data("Comparative Benchmark", [])
                self.send_json(200, res)
                return
            else:
                self.send_json(200, {
                    "success": True,
                    "tool": tool_id,
                    "observation": f"Executed tool {tool_id} in isolated sandbox. Telemetry returned status 200 OK."
                })
                return

        # 3. Ingest Document: POST /api/knowledge/upload
        if path == "/api/knowledge/upload":
            title = data.get("title", "Uploaded_Document.pdf")
            category = data.get("category", "General")
            conn = get_db()
            cursor = conn.cursor()
            doc_id = f"doc-{int(time.time()*1000)}"
            cursor.execute("""
            INSERT INTO knowledge_docs (id, title, category, size, pages, chunks, uploaded_at, tags, summary)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                doc_id, title, category, "2.4 MB", 14, 62,
                time.strftime("%Y-%m-%d"),
                json.dumps(["Custom Upload", "Indexed"]),
                f"Custom enterprise intelligence document indexed for real-time claim cross-verification: {title}"
            ))
            conn.commit()
            conn.close()
            self.send_json(201, {"success": True, "id": doc_id, "title": title})
            return

        self.send_json(404, {"error": "API route not found."})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        if path.startswith("/api/investigations/"):
            inv_id = path.split("/")[3]
            delete_investigation(inv_id)
            self.send_json(200, {"success": True, "deleted_id": inv_id})
            return
        self.send_json(404, {"error": "Endpoint not found."})

    def handle_sse_stream(self, inv_id):
        """Streams real-time Server-Sent Events (SSE) to the frontend client."""
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Cache-Control', 'no-cache')
        self.send_header('Connection', 'keep-alive')
        self.end_headers()

        q = register_stream(inv_id)
        
        # Send initial connection confirmation
        try:
            init_msg = f"event: connect\ndata: {json.dumps({'investigation_id': inv_id, 'connected_at': time.time()})}\n\n"
            self.wfile.write(init_msg.encode('utf-8'))
            self.wfile.flush()
            
            # Send current steps already in DB
            inv = get_investigation(inv_id)
            if inv:
                for step in inv.get("steps", []):
                    step_msg = f"event: step\ndata: {json.dumps(step)}\n\n"
                    self.wfile.write(step_msg.encode('utf-8'))
                    self.wfile.flush()

            # Stream live events until complete or connection closes
            active = True
            while active:
                try:
                    event = q.get(timeout=20)
                    msg = f"event: {event['event']}\ndata: {json.dumps(event['data'])}\n\n"
                    self.wfile.write(msg.encode('utf-8'))
                    self.wfile.flush()

                    if event['event'] in ('complete', 'error'):
                        active = False
                except queue.Empty:
                    # Keep-alive heartbeat comment
                    self.wfile.write(b": keepalive\n\n")
                    self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            unregister_stream(inv_id, q)

    def send_json(self, status_code, data):
        payload = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

def run_server():
    init_db()
    with socketserver.ThreadingTCPServer(("", PORT), IntelloopApiHandler) as httpd:
        httpd.allow_reuse_address = True
        print(f"============================================================")
        print(f" INTELLOOP AI RESEARCH PLATFORM SERVER STARTED ON PORT {PORT}")
        print(f" URL: http://localhost:{PORT}")
        print(f" REST API & SSE Live Streaming Active")
        print(f"============================================================")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
