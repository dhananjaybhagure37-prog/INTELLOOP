/* ==========================================================================
   INTELLOOP — INITIAL DATA STORE & MOCK REPOSITORY
   ========================================================================== */

import { INITIAL_TOOLS } from '../tools/toolRegistry.js';

export const INITIAL_AGENTS = [
  {
    id: 'agent-sentinel',
    name: 'Sentinel-Prime',
    role: 'Research & Intelligence Agent',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkC56jEnwO_bMkMUinSdOqCJx9M175FxMB4Sh-Biboz4EyqngmWmWu38j8AqIdPZwruy9Sf6RwJsliBBsytRMeq8aK8PIpHNDySd7ZT0eKnwU4zIzq1HItOFG7UUO2LEX6I-NIVL_CL5TU7l0McnpEZvq2QMx_6AAx_bCOrJ_EAgjLjUZ0FyfKJ-HR5im1q3CUNM36EQBJbZvZ0hPElk9sCndry-iA8HMAOaddIXeevwH5UJxi8_Lig',
    specialization: 'Deep multi-source web indexing, academic validation, and cross-domain citation mapping.',
    status: 'active',
    state: 'Working',
    currentMissionId: 'NX-8842-OMEGA',
    tasksCompleted: 148,
    successRate: '98.4%',
    avgLatency: '1.4s',
    toolsAssigned: ['tool-web-search', 'tool-knowledge-base', 'tool-document-analyzer', 'tool-summarizer'],
    systemPrompt: 'You are an autonomous intelligence gathering specialist capable of high-recall research and citation verification.'
  },
  {
    id: 'agent-cyberquant',
    name: 'CyberQuant',
    role: 'Quantitative Analysis Agent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    specialization: 'Multivariate time-series modeling, anomaly detection, statistical regressions, and quantitative simulations.',
    status: 'active',
    state: 'Idle',
    currentMissionId: null,
    tasksCompleted: 96,
    successRate: '96.8%',
    avgLatency: '0.9s',
    toolsAssigned: ['tool-data-analyzer', 'tool-calculator', 'tool-code-executor'],
    systemPrompt: 'You are a quantitative modeling agent specializing in statistical inference and mathematical rigor.'
  },
  {
    id: 'agent-stratagem',
    name: 'Stratagem-X',
    role: 'Hierarchical Planning Agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    specialization: 'Recursive goal decomposition, multi-step dependency resolution, and dynamic contingency planning.',
    status: 'active',
    state: 'Standby',
    currentMissionId: null,
    tasksCompleted: 112,
    successRate: '99.1%',
    avgLatency: '0.6s',
    toolsAssigned: ['tool-knowledge-base', 'tool-summarizer'],
    systemPrompt: 'You are a strategic orchestration specialist responsible for decomposing complex objectives into executable acyclic graphs.'
  },
  {
    id: 'agent-scribe',
    name: 'Scribe-Omni',
    role: 'Briefing & Report Agent',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    specialization: 'High-signal executive synthesis, structured Markdown generation, data tables, and risk matrices.',
    status: 'active',
    state: 'Idle',
    currentMissionId: null,
    tasksCompleted: 134,
    successRate: '97.9%',
    avgLatency: '1.1s',
    toolsAssigned: ['tool-summarizer', 'tool-report-generator', 'tool-document-analyzer'],
    systemPrompt: 'You are an executive intelligence briefer specializing in synthesizing technical data into clear, actionable reports.'
  },
  {
    id: 'agent-codecraft',
    name: 'CodeCraft Sandbox',
    role: 'System & Code Execution Agent',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    specialization: 'Ephemeral sandbox execution, algorithmic verification, data transformation scripts, and API testing.',
    status: 'active',
    state: 'Idle',
    currentMissionId: null,
    tasksCompleted: 82,
    successRate: '95.2%',
    avgLatency: '1.8s',
    toolsAssigned: ['tool-code-executor', 'tool-calculator', 'tool-web-search'],
    systemPrompt: 'You are an isolated sandbox engineering agent focused on script execution and algorithmic validation.'
  }
];

export const INITIAL_MISSIONS = [
  {
    id: 'NX-8842-OMEGA',
    title: 'Analyze whether AI-powered predictive maintenance can reduce manufacturing downtime.',
    domain: 'Industrial IoT & AI Operations',
    priority: 'High',
    agentId: 'agent-sentinel',
    agentName: 'Sentinel-Prime',
    status: 'Running',
    progress: 65,
    currentStepIndex: 3,
    currentStepTitle: 'Executing Tool: Web Search Tool',
    currentReasoningSummary: 'Evaluating retrieved vibration telemetry against ISO-13374 vibration standards.',
    activeToolName: 'Web Search Engine',
    activeToolId: 'tool-web-search',
    startedAt: new Date(Date.now() - 45000).toISOString(),
    executionTimeMs: 45000,
    toolsUsed: ['Web Search Engine', 'Statistical Data Analyzer'],
    steps: [
      {
        id: 's-1',
        type: 'UNDERSTAND',
        title: 'Task Understanding & Parameter Extraction',
        summary: 'Deconstructed prompt into acoustic telemetry, vibration analysis, downtime benchmarks, and capital ROI.',
        timestamp: '09:41:00',
        completed: true,
        graphNode: 'MISSION'
      },
      {
        id: 's-2',
        type: 'PLAN',
        title: 'Planning Phase Complete',
        summary: 'Identified 4 sub-objectives: 1) Query empirical studies, 2) Model MTBF regression, 3) Verify false alarm rates, 4) Formulate ROI.',
        timestamp: '09:41:04',
        completed: true,
        graphNode: 'PLAN'
      },
      {
        id: 's-3',
        type: 'ACT',
        title: 'Executing Tool: Web Search Tool',
        summary: 'Query: "AI predictive maintenance manufacturing case studies 2025 2026"',
        toolName: 'Web Search Engine',
        toolInput: { query: 'AI predictive maintenance manufacturing case studies 2025 2026' },
        timestamp: '09:41:10',
        completed: true,
        graphNode: 'SEARCH WEB'
      },
      {
        id: 's-4',
        type: 'OBSERVE',
        title: 'Observation Received: 18 Industrial Case Studies',
        summary: 'Indexed 18 empirical case studies from automotive and semiconductor fabs. Mean downtime reduction: 38.6%.',
        observation: 'Extracted 18 verified industrial deployments. Acoustic vibration sensors detect micro-fractures 72 hours prior to catastrophic failure.',
        timestamp: '09:41:22',
        completed: false,
        graphNode: 'OBSERVE'
      }
    ],
    finalResult: null
  },
  {
    id: 'NX-7721-BETA',
    title: 'Investigate solid-state battery commercialization bottlenecks and market timeline.',
    domain: 'Clean Energy & Materials Science',
    priority: 'Critical',
    agentId: 'agent-cyberquant',
    agentName: 'CyberQuant',
    status: 'Completed',
    progress: 100,
    currentStepIndex: 7,
    currentStepTitle: 'Mission Completed',
    currentReasoningSummary: 'Completed full econometric cost parity simulation and OEM timeline verification.',
    activeToolName: null,
    activeToolId: null,
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 3540000).toISOString(),
    executionTimeMs: 60000,
    toolsUsed: ['Web Search Engine', 'Financial & Mathematical Engine'],
    steps: [],
    finalResult: `# Executive Briefing: Solid-State Battery Commercialization & Market Timeline\n\n## Executive Summary\nSolid-State Batteries (SSB) deliver **450–500 Wh/kg gravimetric energy density** and near-zero thermal runaway risk. Automotive mass-market adoption will occur in **two waves: premium specialty vehicles (2026–2027) followed by mass-market cost parity (<$85/kWh) by 2029–2030**.`
  },
  {
    id: 'NX-6140-DELTA',
    title: 'Evaluate post-quantum cryptography migration strategies for financial transactions.',
    domain: 'Cybersecurity & Quantum Computing',
    priority: 'Critical',
    agentId: 'agent-sentinel',
    agentName: 'Sentinel-Prime',
    status: 'Completed',
    progress: 100,
    currentStepIndex: 6,
    currentStepTitle: 'Mission Completed',
    currentReasoningSummary: 'Completed NIST FIPS 203/204 lattice algorithm verification and SWIFT migration roadmap.',
    activeToolName: null,
    activeToolId: null,
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 7145000).toISOString(),
    executionTimeMs: 55000,
    toolsUsed: ['Python Sandbox / Code Executor', 'Vector Knowledge Base'],
    steps: [],
    finalResult: `# Executive Briefing: Post-Quantum Cryptography Financial Migration\n\nFinancial institutions must adopt hybrid X25519 + ML-KEM-768 key encapsulation by 2027 to defeat Harvest Now, Decrypt Later adversaries.`
  },
  {
    id: 'NX-5502-ALPHA',
    title: 'Synthesize recent clinical trial outcomes for mRNA oncology vaccines.',
    domain: 'BioTech & Precision Medicine',
    priority: 'Medium',
    agentId: 'agent-scribe',
    agentName: 'Scribe-Omni',
    status: 'Completed',
    progress: 100,
    currentStepIndex: 5,
    currentStepTitle: 'Mission Completed',
    currentReasoningSummary: 'Synthesized Phase II trial data across melanoma and pancreatic ductal adenocarcinoma.',
    activeToolName: null,
    activeToolId: null,
    startedAt: new Date(Date.now() - 14400000).toISOString(),
    completedAt: new Date(Date.now() - 14352000).toISOString(),
    executionTimeMs: 48000,
    toolsUsed: ['Web Search Engine', 'Executive Summarizer'],
    steps: [],
    finalResult: `# Executive Briefing: mRNA Personalized Cancer Vaccines\n\nPhase II randomized trials indicate customized neoantigen mRNA vaccines combined with PD-1 inhibitors reduce recurrence risk by 44% in resected stage III/IV melanoma.`
  }
];

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'log-1',
    timestamp: '09:41:22',
    missionId: 'NX-8842-OMEGA',
    agentName: 'Sentinel-Prime',
    type: 'Observation',
    toolName: 'Web Search Engine',
    summary: 'Observation Received: 18 empirical case studies indexed with aggregate downtime reduction of 38.6%.',
    durationMs: 420
  },
  {
    id: 'log-2',
    timestamp: '09:41:10',
    missionId: 'NX-8842-OMEGA',
    agentName: 'Sentinel-Prime',
    type: 'Tool Invocaton',
    toolName: 'Web Search Engine',
    summary: 'Executing Tool: Web Search Engine with query "AI predictive maintenance manufacturing case studies 2025 2026"',
    durationMs: 820
  },
  {
    id: 'log-3',
    timestamp: '09:41:04',
    missionId: 'NX-8842-OMEGA',
    agentName: 'Sentinel-Prime',
    type: 'Planning',
    toolName: null,
    summary: 'Planning Phase Complete: Formulated 4-stage sequential execution plan.',
    durationMs: 310
  },
  {
    id: 'log-4',
    timestamp: '09:41:02',
    missionId: 'NX-8842-OMEGA',
    agentName: 'Sentinel-Prime',
    type: 'Understanding',
    toolName: null,
    summary: 'Task Understood: Context loaded into active memory working context (42.8 MB).',
    durationMs: 190
  },
  {
    id: 'log-5',
    timestamp: '09:41:00',
    missionId: 'NX-8842-OMEGA',
    agentName: 'Sentinel-Prime',
    type: 'Initialization',
    toolName: null,
    summary: 'Mission NX-8842-OMEGA Initialized by Researcher.',
    durationMs: 50
  },
  {
    id: 'log-6',
    timestamp: '08:45:12',
    missionId: 'NX-7721-BETA',
    agentName: 'CyberQuant',
    type: 'Mission Completed',
    toolName: 'Financial & Mathematical Engine',
    summary: 'Mission NX-7721-BETA completed in 60.0s. Final Briefing delivered with 96.7% confidence rating.',
    durationMs: 60000
  },
  {
    id: 'log-7',
    timestamp: '07:32:05',
    missionId: 'NX-6140-DELTA',
    agentName: 'Sentinel-Prime',
    type: 'Mission Completed',
    toolName: 'Vector Knowledge Base',
    summary: 'Mission NX-6140-DELTA completed in 55.0s. Quantum cryptography roadmap generated.',
    durationMs: 55000
  }
];

export const INITIAL_KNOWLEDGE_DOCS = [
  {
    id: 'doc-1',
    title: 'Industrial IoT & Acoustic Vibration Telemetry Standards 2026.pdf',
    category: 'Engineering & IoT',
    size: '4.8 MB',
    pages: 34,
    chunks: 142,
    uploadedAt: '2026-08-20',
    tags: ['IoT', 'Acoustic Sensors', 'MTBF', 'ISO-13374'],
    summary: 'Standardized baseline vibration frequency limits, FFT spectral analysis formulas, and edge gateway protocols for manufacturing lines.',
    sampleChunks: [
      'Chunk #1: Baseline vibration limits for Class I motors defined between 10 Hz and 1,000 Hz under ISO-13374.',
      'Chunk #2: Micro-crack propagation acoustic emissions occur in the 20 kHz to 100 kHz envelope prior to observable temperature increases.'
    ]
  },
  {
    id: 'doc-2',
    title: 'Solid State Battery Chemistry & Electrolyte Impedance Whitepaper.pdf',
    category: 'Materials Science',
    size: '6.2 MB',
    pages: 48,
    chunks: 198,
    uploadedAt: '2026-08-19',
    tags: ['Battery', 'Argyrodite', 'Dendrites', 'EV OEM'],
    summary: 'Detailed comparative analysis of sulfide vs oxide solid electrolytes, critical current density thresholds, and roll-to-roll calendering tolerances.',
    sampleChunks: [
      'Chunk #1: Sulfide-based solid electrolytes demonstrate ionic conductivities exceeding 10^-2 S/cm at 25°C.',
      'Chunk #2: Lithium dendrite penetration is suppressed by maintaining isostatic stack pressure above 5 MPa during high-rate charging.'
    ]
  },
  {
    id: 'doc-3',
    title: 'NIST Post-Quantum Cryptography Transition Mandates (FIPS 203/204).docx',
    category: 'Cybersecurity',
    size: '2.1 MB',
    pages: 18,
    chunks: 76,
    uploadedAt: '2026-08-18',
    tags: ['PQC', 'NIST', 'ML-KEM', 'ML-DSA', 'FIPS'],
    summary: 'Regulatory timelines for deprecating RSA/ECC and mandating ML-KEM-768 and ML-DSA-65 cipher suites across federal and financial endpoints.',
    sampleChunks: [
      'Chunk #1: FIPS 203 specifies Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM) as the primary quantum-resistant standard.',
      'Chunk #2: Dual-certificate hybrid handshakes must be supported by financial payment switches starting Q1 2027.'
    ]
  },
  {
    id: 'doc-4',
    title: 'Autonomous Multi-Agent Systems & Consensus Routing Architectures.pdf',
    category: 'AI Architecture',
    size: '3.4 MB',
    pages: 26,
    chunks: 110,
    uploadedAt: '2026-08-15',
    tags: ['Multi-Agent', 'Reasoning Graphs', 'Tool Orchestration', 'Self-Healing'],
    summary: 'Design patterns for asynchronous agentic reasoning loops, tool state machines, and safe thought-stream monitoring.',
    sampleChunks: [
      'Chunk #1: Iterative tool-use loops should decouple private intermediate chain-of-thought from executive observation logs to ensure enterprise compliance.',
      'Chunk #2: Multi-agent consensus mechanisms improve factual grounding by 42% relative to single-pass autoregressive prompting.'
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Mission Step Active',
    message: 'Sentinel-Prime is executing Web Search Tool for Mission NX-8842-OMEGA.',
    type: 'info',
    timestamp: 'Just now',
    read: false,
    missionId: 'NX-8842-OMEGA'
  },
  {
    id: 'notif-2',
    title: 'Mission Completed',
    message: 'Mission NX-7721-BETA (Solid-State Batteries) successfully generated Intelligence Briefing.',
    type: 'success',
    timestamp: '1 hour ago',
    read: false,
    missionId: 'NX-7721-BETA'
  },
  {
    id: 'notif-3',
    title: 'Tool Telemetry Synced',
    message: 'Vector Knowledge Base synced 142 new embedding chunks into memory context.',
    type: 'system',
    timestamp: '3 hours ago',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Security Alert: Classical Cipher Deprecation',
    message: 'Post-Quantum migration evaluation highlighted RSA-2048 key exchange vulnerability.',
    type: 'warning',
    timestamp: '5 hours ago',
    read: true,
    missionId: 'NX-6140-DELTA'
  }
];

export const INITIAL_SETTINGS = {
  workspaceName: 'Nexus Global Operations',
  researcherName: 'Researcher',
  modelProvider: 'Gemini 2.5 Pro (Thinking / Reasoning Engine)',
  executionSpeed: 1, // 1x normal, 2x fast, 5x turbo, 0 step-by-step
  maxSteps: 10,
  autoRetry: true,
  safeReasoningMode: true,
  theme: 'dark-space',
  density: 'standard', // standard | compact
  soundEffects: true,
  autoSaveLocal: true
};
