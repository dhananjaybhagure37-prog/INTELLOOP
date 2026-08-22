# INTELLOOP — Autonomous Agentic AI Research Platform

<div align="center">

![INTELLOOP Logo](https://img.shields.io/badge/INTELLOOP-Autonomous_Agentic_AI-002e6a?style=for-the-badge&logo=openai&logoColor=adc6ff)
![Status](https://img.shields.io/badge/Status-Production_Ready-6ee7b7?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Python_3.10+-3776ab?style=for-the-badge&logo=python&logoColor=white)
![Storage](https://img.shields.io/badge/Storage-SQLite-003b57?style=for-the-badge&logo=sqlite&logoColor=white)
![UI](https://img.shields.io/badge/UI-Stitch_Deep_Space_Glassmorphism-6f00be?style=for-the-badge)

<p align="center">
  <b>An autonomous multi-agent intelligence and research platform that conducts real-time web investigations, extracts numerical facts, verifies claims across multiple independent sources, and synthesizes executive research briefings.</b>
</p>

</div>

---

## 🌟 Key Highlights

- **Real ReAct Agent Loop**:
  `UNDERSTAND → PLAN → DECIDE NEXT ACTION → USE TOOL → OBSERVE RESULT → EVALUATE → DECIDE NEXT ACTION → VERIFY → SYNTHESIZE → FINAL REPORT`
- **Real Web Search & Source Scraping**: Live DuckDuckGo, Wikipedia, and REST search APIs with domain authority ranking (`.gov`, `.edu`, official bodies, Tier-1 media).
- **Claim-Level Grounding & Anti-Hallucination**: Every key metric is linked to verified sources. Computes measurable confidence (`HIGH`, `MEDIUM`, `LOW`) and flags `INSUFFICIENT VERIFIED EVIDENCE` instead of fabricating data.
- **Statistical Conflict Detection**: Automatically isolates and contextualizes numerical discrepancies across sources (e.g. reporting period or geographic scope variances).
- **Embedded SQLite Database**: All investigations, steps, sources, claims, conflicts, and activity logs are stored persistently in `intelloop.db`.
- **Live Server-Sent Events (SSE) Streaming**: Real-time progress updates, reasoning graph transitions, and telemetry streaming directly to the browser.
- **Elevated High-Contrast Stitch UI**: Modern dark command center with high-contrast black prompt input, dynamic SVG reasoning graph, interactive evidence cards, and export options.

---

## 🏛️ System Architecture

```
FRONTEND (Single-Page App)
   │
   ├── High-Contrast Black Prompt Container (Clear, Voice, Attach, Start)
   ├── Dynamic SVG Reasoning Graph (Live ReAct State Machine)
   ├── Live SSE Event Stream (/api/investigations/{id}/stream)
   └── Interactive Evidence Cards & Sources Panel
   │
REST / SSE SERVER (`server.py` on Port 3000)
   │
   ├── ReAct Agent Orchestrator (`backend/agent_orchestrator.py`)
   │      ├── Task Analyzer (Decomposes question into sub-objectives)
   │      ├── Planner (Orders research roadmap)
   │      ├── Tool Dispatcher (Dynamically picks search, fetch, extract, verify)
   │      ├── Evaluator (Evaluates evidence sufficiency; loops if needed)
   │      ├── Verifier (Computes confidence & flags conflicts)
   │      └── Synthesizer (Generates structured report with citations)
   │
   ├── Real Tools Framework (`backend/tools/`)
   │      ├── `search_tool.py`: Real DuckDuckGo + Wikipedia + Tavily/Serper APIs
   │      ├── `fetch_tool.py`: Real HTTP Web Scraper & Article Text Extractor
   │      ├── `fact_extractor.py`: Numerical, percentage, currency, and date parser
   │      ├── `verifier_tool.py`: Multi-source claim verification & conflict detector
   │      └── `data_analyzer.py`: Comparative modeling & delta matrices
   │
   └── SQLite Database Layer (`database/db.py` -> `intelloop.db`)
          └── Tables: `investigations`, `steps`, `sources`, `claims`, `conflicts`, `activity_logs`, `knowledge_docs`
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+ (Zero external pip packages required — uses standard library).

### Running the Application

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/dhananjaybhagure37-prog/INTELLOOP.git
   cd INTELLOOP
   ```

2. **Start the Application Server:**
   ```bash
   python server.py
   ```

3. **Open in Browser:**
   Navigate to **`http://localhost:3000`** in any modern web browser.

---

## 📂 Project Structure

```
├── server.py                            # REST API, SSE streaming & static web server
├── database/
│   ├── db.py                            # SQLite database schema, CRUD operations & persistence
│   └── intelloop.db                     # Embedded SQLite database
├── backend/
│   ├── agent_orchestrator.py            # ReAct Loop: Understand → Plan → Act → Observe → Evaluate → Verify → Synthesize
│   └── tools/
│       ├── search_tool.py               # Real Web Search (DuckDuckGo, Wikipedia, Serper/Tavily fallback)
│       ├── fetch_tool.py                # Real HTTP Web Scraper & Article Text Extractor
│       ├── fact_extractor.py            # Numerical & Entity Fact Extractor
│       ├── verifier_tool.py             # Claim Verification & Conflict Detection Engine
│       └── data_analyzer.py             # Comparative Data & Matrix Modeler
├── css/
│   ├── design-tokens.css                # Deep Space design tokens & glassmorphic styles
│   └── app.css                          # Custom animations, prompt styling & layout
├── js/
│   ├── app.js                           # Frontend router & orchestrator
│   ├── api/
│   │   └── client.js                    # REST & SSE streaming client
│   ├── state/
│   │   ├── store.js                     # Centralized reactive frontend state
│   │   └── initialData.js               # Initial data & agents repository
│   ├── components/
│   │   ├── sidebar.js                   # Navigation rail & profile
│   │   ├── header.js                    # Status bar & notifications
│   │   ├── reasoningGraph.js            # Dynamic SVG ReAct graph
│   │   ├── toast.js                     # HUD toast notifications
│   │   └── globalSearch.js              # Ctrl+K Universal search palette
│   └── views/
│       ├── dashboardView.js             # High-contrast prompt command center
│       ├── executionView.js             # Live 3-pane ReAct execution screen
│       ├── resultView.js                # Executive briefing with evidence cards
│       ├── historyView.js               # SQLite research history
│       ├── agentsView.js                # Autonomous agent management
│       ├── toolsView.js                 # Tool registry & live testing sandbox
│       ├── knowledgeView.js             # Document upload & semantic vector search
│       ├── logsView.js                  # Audit logs & CSV export
│       └── settingsView.js              # Configuration & export state
├── index.html                           # Main frontend entry point
└── README.md                            # Documentation
```

---

## 📡 REST API & SSE Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/investigations` | Start a new autonomous ReAct research task |
| `GET` | `/api/investigations` | List historical investigations from SQLite |
| `GET` | `/api/investigations/{id}` | Get full investigation payload, steps, claims, and sources |
| `GET` | `/api/investigations/{id}/stream` | Server-Sent Events (SSE) live execution stream |
| `DELETE`| `/api/investigations/{id}` | Delete investigation from database |
| `GET` | `/api/tools` | List registered tools and usage metrics |
| `POST` | `/api/tools/{id}/test` | Test tool in isolated sandbox |
| `GET` | `/api/logs` | Fetch real-time activity logs |
| `POST` | `/api/knowledge/upload` | Ingest document for research cross-referencing |

---

## 🔒 Security & Privacy

- No API keys are hardcoded in frontend code.
- Ephemeral sandboxed tool execution.
- Input validation and sanitized HTML rendering for fetched web content.

---

## 📄 License

This project is licensed under the MIT License.
