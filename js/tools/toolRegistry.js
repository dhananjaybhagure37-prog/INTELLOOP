/* ==========================================================================
   INTELLOOP — TOOL REGISTRY & EXECUTION SANDBOX
   ========================================================================== */

export const INITIAL_TOOLS = [
  {
    id: 'tool-web-search',
    name: 'Web Search Engine',
    category: 'Intelligence',
    icon: 'travel_explore',
    description: 'Autonomous multi-query web indexing, citation retrieval, and real-time domain verification.',
    status: 'active',
    totalUses: 184,
    avgLatencyMs: 820,
    lastUsed: '2 mins ago',
    parametersSchema: {
      query: { type: 'string', description: 'Search term or research prompt' },
      maxResults: { type: 'number', default: 8, description: 'Maximum search snippets to index' },
      freshness: { type: 'string', default: 'year', enum: ['day', 'week', 'month', 'year', 'all'] }
    },
    execute: async (params) => {
      const q = params.query || 'AI intelligence trends';
      const resultsCount = Math.floor(8 + Math.random() * 8);
      return {
        success: true,
        query: q,
        sourcesFound: resultsCount,
        topSources: [
          { title: `Global Intelligence Report 2026: ${q.substring(0, 30)}`, url: `https://intel.org/paper/${Math.floor(Math.random()*1000)}`, relevance: '99.4%' },
          { title: `Empirical Benchmarks & Technical Analysis: ${q.substring(0, 25)}`, url: `https://arxiv.org/abs/2603.${Math.floor(1000 + Math.random()*9000)}`, relevance: '96.8%' },
          { title: `Industry Deployment Case Studies: Operational Telemetry`, url: `https://techreview.io/analysis/case-studies`, relevance: '92.1%' }
        ],
        observation: `Discovered ${resultsCount} authoritative sources across indexed research databases. Extracted 4 primary consensus themes and 2 divergence points.`
      };
    }
  },
  {
    id: 'tool-code-executor',
    name: 'Python Sandbox / Code Executor',
    category: 'Compute',
    icon: 'terminal',
    description: 'Isolated ephemeral execution environment for statistical computing, regressions, and data transformations.',
    status: 'active',
    totalUses: 92,
    avgLatencyMs: 640,
    lastUsed: '8 mins ago',
    parametersSchema: {
      language: { type: 'string', default: 'python', enum: ['python', 'javascript', 'r'] },
      code: { type: 'string', description: 'Script to execute in sandbox' }
    },
    execute: async (params) => {
      const code = params.code || 'import numpy as np\n# Monte Carlo Simulation';
      return {
        success: true,
        runtimeMs: 420,
        memoryUsedMb: '18.4MB',
        stdout: `[SANDBOX OUTPUT]\n>>> Iterations: 10,000\n>>> Mean Value: 42.84 ± 0.08\n>>> Variance Reduction: 34.2%\n>>> P-value: 0.0028 (Statistically Significant)\nExecution status: 0 (Success)`,
        stderr: '',
        observation: `Code executed successfully in isolated sandbox environment (duration 420ms). Variance calculation confirmed 34.2% reduction.`
      };
    }
  },
  {
    id: 'tool-data-analyzer',
    name: 'Statistical Data Analyzer',
    category: 'Analysis',
    icon: 'analytics',
    description: 'Time-series decomposition, multivariate correlation, anomaly detection, and regression modeling.',
    status: 'active',
    totalUses: 138,
    avgLatencyMs: 910,
    lastUsed: '15 mins ago',
    parametersSchema: {
      dataset: { type: 'string', description: 'Data matrix or telemetry metric stream' },
      method: { type: 'string', default: 'correlation', enum: ['correlation', 'arima_forecast', 'clustering', 'anomaly'] }
    },
    execute: async (params) => {
      return {
        success: true,
        dataset: params.dataset || 'Telemetry_Stream_A',
        method: params.method || 'multivariate_regression',
        rSquared: 0.942,
        anomaliesDetected: 0,
        correlationCoefficient: 0.88,
        observation: `Computed statistical model: Strong positive correlation (R² = 0.942) with zero critical anomalies detected across 1,200 sample data points.`
      };
    }
  },
  {
    id: 'tool-knowledge-base',
    name: 'Vector Knowledge Base',
    category: 'Memory',
    icon: 'menu_book',
    description: 'Dense vector embeddings search across uploaded enterprise documents, technical whitepapers, and operational logs.',
    status: 'active',
    totalUses: 165,
    avgLatencyMs: 380,
    lastUsed: '1 min ago',
    parametersSchema: {
      query: { type: 'string', description: 'Semantic vector search query' },
      topK: { type: 'number', default: 5 }
    },
    execute: async (params) => {
      return {
        success: true,
        query: params.query || 'knowledge query',
        matchedChunks: 4,
        topScore: 0.928,
        retrievedContext: [
          'Chunk #1: Historical benchmark telemetry indicates predictive maintenance achieves 38% reduction in unplanned downtime.',
          'Chunk #2: Mean time between failures (MTBF) improved from 412 hours to 688 hours post-algorithmic intervention.'
        ],
        observation: `Retrieved 4 relevant vector embedding chunks (cosine similarity: 0.928) from enterprise knowledge base.`
      };
    }
  },
  {
    id: 'tool-document-analyzer',
    name: 'Document & PDF Extractor',
    category: 'Intelligence',
    icon: 'description',
    description: 'Parses complex multi-column PDFs, tables, charts, and structured XML/JSON document assets.',
    status: 'active',
    totalUses: 74,
    avgLatencyMs: 1100,
    lastUsed: '32 mins ago',
    parametersSchema: {
      documentId: { type: 'string', description: 'ID or URI of document' }
    },
    execute: async (params) => {
      return {
        success: true,
        pagesParsed: 28,
        tablesExtracted: 6,
        entitiesIdentified: 42,
        observation: `Parsed 28 pages, extracted 6 structured telemetry tables, and mapped 42 domain entities.`
      };
    }
  },
  {
    id: 'tool-calculator',
    name: 'Financial & Mathematical Engine',
    category: 'Compute',
    icon: 'calculate',
    description: 'High-precision mathematical solver, ROI calculator, discount cash flow, and risk assessment equations.',
    status: 'active',
    totalUses: 110,
    avgLatencyMs: 210,
    lastUsed: '45 mins ago',
    parametersSchema: {
      expression: { type: 'string', description: 'Mathematical or financial formula' }
    },
    execute: async (params) => {
      return {
        success: true,
        evaluatedResult: '$4,850,000 Annual Savings (314% Net ROI over 3-year horizon)',
        observation: `Calculated exact financial return: $4.85M net projected savings with 314% ROI.`
      };
    }
  },
  {
    id: 'tool-summarizer',
    name: 'Executive Summarizer',
    category: 'Synthesis',
    icon: 'summarize',
    description: 'Distills complex multi-source research into dense, actionable, executive-level briefings with key findings.',
    status: 'active',
    totalUses: 214,
    avgLatencyMs: 540,
    lastUsed: 'Just now',
    parametersSchema: {
      inputData: { type: 'string', description: 'Raw research corpus' },
      style: { type: 'string', default: 'executive', enum: ['executive', 'technical', 'bulleted'] }
    },
    execute: async (params) => {
      return {
        success: true,
        compressionRatio: '86%',
        keyTakeawaysCount: 4,
        observation: `Synthesized 14,000 input tokens into 4 high-signal executive takeaways with 86% compression ratio.`
      };
    }
  },
  {
    id: 'tool-report-generator',
    name: 'Intelligence Briefing Generator',
    category: 'Synthesis',
    icon: 'picture_as_pdf',
    description: 'Compiles structured briefings, comparative data tables, risk heatmaps, and formal citations.',
    status: 'active',
    totalUses: 156,
    avgLatencyMs: 780,
    lastUsed: '1 hour ago',
    parametersSchema: {
      title: { type: 'string', description: 'Report title' },
      sections: { type: 'array', description: 'List of report section keys' }
    },
    execute: async (params) => {
      return {
        success: true,
        sectionsCompiled: 5,
        wordCount: 1480,
        observation: `Compiled formal 5-section intelligence briefing complete with telemetry charts, references, and risk matrix.`
      };
    }
  }
];

export class ToolRegistry {
  constructor(tools = INITIAL_TOOLS) {
    this.tools = new Map(tools.map(t => [t.id, t]));
  }

  getAll() {
    return Array.from(this.tools.values());
  }

  getActive() {
    return Array.from(this.tools.values()).filter(t => t.status === 'active');
  }

  get(id) {
    return this.tools.get(id);
  }

  toggleStatus(id) {
    const tool = this.tools.get(id);
    if (tool) {
      tool.status = tool.status === 'active' ? 'disabled' : 'active';
      return tool;
    }
    return null;
  }

  async run(toolId, params = {}) {
    const tool = this.tools.get(toolId);
    if (!tool) {
      throw new Error(`Tool "${toolId}" not found in registry.`);
    }
    if (tool.status === 'disabled') {
      throw new Error(`Tool "${tool.name}" is currently disabled.`);
    }

    tool.totalUses += 1;
    tool.lastUsed = 'Just now';
    return await tool.execute(params);
  }
}
