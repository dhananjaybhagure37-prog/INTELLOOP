/* ==========================================================================
   INTELLOOP - INITIAL DATA STORE & AGENTS REPOSITORY
   ========================================================================== */

export const INITIAL_AGENTS = [
  {
    id: 'agent-sentinel',
    name: 'Sentinel-Prime',
    role: 'Research & Intelligence Agent',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwkC56jEnwO_bMkMUinSdOqCJx9M175FxMB4Sh-Biboz4EyqngmWmWu38j8AqIdPZwruy9Sf6RwJsliBBsytRMeq8aK8PIpHNDySd7ZT0eKnwU4zIzq1HItOFG7UUO2LEX6I-NIVL_CL5TU7l0McnpEZvq2QMx_6AAx_bCOrJ_EAgjLjUZ0FyfKJ-HR5im1q3CUNM36EQBJbZvZ0hPElk9sCndry-iA8HMAOaddIXeevwH5UJxi8_Lig',
    specialization: 'Deep multi-source web indexing, academic validation, and cross-domain citation mapping.',
    status: 'active',
    state: 'Working',
    currentMissionId: null,
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

export const INITIAL_MISSIONS = [];
export const INITIAL_ACTIVITY_LOGS = [];
export const INITIAL_KNOWLEDGE_DOCS = [];
export const INITIAL_NOTIFICATIONS = [];
export const INITIAL_SETTINGS = {
  theme: 'deep-space',
  autoDeploy: false,
  researcherName: 'Researcher'
};
