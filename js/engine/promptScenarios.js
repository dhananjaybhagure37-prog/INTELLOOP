/* ==========================================================================
   INTELLOOP — PRE-CONFIGURED INTELLIGENCE SCENARIOS
   ========================================================================== */

export const PROMPT_SCENARIOS = [
  {
    id: 'scenario-predictive-maintenance',
    title: 'Analyze whether AI-powered predictive maintenance can reduce manufacturing downtime.',
    domain: 'Industrial IoT & AI Operations',
    priority: 'High',
    agentId: 'agent-sentinel',
    agentName: 'Sentinel-Prime (Research Agent)',
    description: 'Comprehensive investigation into acoustic telemetry, vibrational analysis, sensor fusion, and empirical ROI metrics across automated manufacturing lines.',
    steps: [
      {
        type: 'UNDERSTAND',
        title: 'Task Understanding & Parameter Extraction',
        summary: 'Deconstructed prompt into core analytical pillars: Sensor Telemetry, Failure Prediction Algorithms, Downtime Reduction Benchmarks, and Capital ROI.',
        graphNode: 'MISSION',
        progress: 15,
        delayMs: 1200
      },
      {
        type: 'PLAN',
        title: 'Recursive Goal Planning & Tool Pipeline Formulation',
        summary: 'Formulated 4-stage execution sequence: 1) Global Academic Query, 2) Telemetry Regression Modeling, 3) Vector Knowledge Base Cross-Verification, 4) Executive Synthesis.',
        graphNode: 'PLAN',
        progress: 30,
        delayMs: 1400
      },
      {
        type: 'ACT',
        toolId: 'tool-web-search',
        toolName: 'Web Search Engine',
        toolInput: { query: 'AI predictive maintenance industrial manufacturing downtime case studies 2025 2026' },
        title: 'Executing Autonomous Web Search Tool',
        summary: 'Dispatching concurrent vector queries across manufacturing telemetry repositories and industrial engineering papers.',
        graphNode: 'SEARCH WEB',
        progress: 50,
        delayMs: 2000
      },
      {
        type: 'OBSERVE',
        title: 'Observation & Context Ingestion',
        summary: 'Indexed 18 empirical case studies from automotive and semiconductor fabs. Extracted aggregate downtime reduction figures of 32% to 48%.',
        observation: 'Extracted 18 verified industrial deployments. Core finding: Acoustic vibration sensors paired with transformer-based time-series models detect micro-fractures 72 hours prior to catastrophic failure.',
        graphNode: 'OBSERVE',
        progress: 65,
        delayMs: 1600
      },
      {
        type: 'ACT',
        toolId: 'tool-data-analyzer',
        toolName: 'Statistical Data Analyzer',
        toolInput: { dataset: 'Industrial_Failure_Rates_2025_Telemetry', method: 'multivariate_regression' },
        title: 'Statistical Regression & MTBF Modeling',
        summary: 'Executing regression analysis to correlate sensor sampling frequency with Mean Time Between Failures (MTBF).',
        graphNode: 'ANALYZE',
        progress: 80,
        delayMs: 1800
      },
      {
        type: 'OBSERVE',
        title: 'Statistical Model Observation',
        summary: 'Regression confirmed R² = 0.942. MTBF improved from 410 hours to 695 hours. False positive alarm rate dropped to 1.8%.',
        observation: 'Statistically verified: 38.6% mean downtime reduction (p < 0.001) across 4,200 continuous operating hours.',
        graphNode: 'ANALYZE',
        progress: 90,
        delayMs: 1400
      },
      {
        type: 'EVALUATE',
        title: 'Confidence Evaluation & Verification',
        summary: 'Cross-checked empirical claims against internal ISO-13374 vibration standards. Confidence rating calculated at 98.4%.',
        graphNode: 'VERIFY',
        progress: 96,
        delayMs: 1200
      },
      {
        type: 'SYNTHESIZE',
        title: 'Final Intelligence Briefing Compiled',
        summary: 'Generated executive intelligence report complete with risk factors, ROI analysis, and phased deployment roadmap.',
        graphNode: 'VERIFY',
        progress: 100,
        delayMs: 1000
      }
    ],
    finalResult: `# Executive Intelligence Briefing: AI Predictive Maintenance in Manufacturing

## Executive Summary
Autonomous analysis across 18 industrial case studies confirms that **AI-powered predictive maintenance decisively reduces unplanned downtime by 38.6% on average**, while extending equipment lifespan by up to 24%. By shifting from reactive or calendar-based maintenance to continuous multi-modal telemetry monitoring, enterprises realize a median payback period of **7.2 months**.

---

## Key Findings & Benchmark Metrics

| Metric Indicator | Traditional Schedule | AI Predictive Maintenance | Net Delta |
| :--- | :--- | :--- | :--- |
| **Unplanned Downtime (Hrs/Mo)** | 48.5 hours | 29.8 hours | **-38.6%** |
| **Mean Time Between Failures (MTBF)** | 410 hours | 695 hours | **+69.5%** |
| **Mean Time to Repair (MTTR)** | 6.2 hours | 2.4 hours | **-61.3%** |
| **Emergency Part Expediting Costs** | $142,000 / yr | $26,500 / yr | **-81.3%** |
| **False Alarm Rate** | 14.2% | 1.8% | **-87.3%** |

---

## Core Technical Drivers
1. **Multi-Modal Sensor Fusion:** Combining high-frequency acoustic emissions (20kHz–100kHz) with 3-axis accelerometer vibration data isolates micro-surface wear before thermal friction spikes occur.
2. **Temporal Transformer Architectures:** Patch-based temporal self-attention models capture long-range cyclical load patterns that traditional FFT thresholds miss.
3. **Edge-Inferenced Anomaly Detection:** Real-time inferencing on edge gateways eliminates cloud latency bottlenecks and ensures zero bandwidth degradation.

---

## Strategic Recommendations
- **Phase 1 (Months 1–2):** Instrument high-criticality CNC spindles and hydraulic pumps with high-bandwidth acoustic sensors.
- **Phase 2 (Months 3–4):** Ingest 90 days of normal telemetry to baseline zero-shot anomaly thresholds.
- **Phase 3 (Months 5+):** Connect autonomous alert dispatch directly to ERP maintenance ticketing systems.

> **Confidence Rating:** 98.4% | **Sources Verified:** 18 peer-reviewed case studies | **Model:** Intelloop Sentinel Engine`,
    sources: [
      { name: 'IEEE Industrial Electronics: Predictive Maintenance Benchmarks 2025', url: 'https://ieee.org/papers/pdm-2025' },
      { name: 'Journal of Manufacturing Systems: Acoustic Sensor Fusion in Automotive Fabs', url: 'https://sciencedirect.com/jms/acoustic-fusion' },
      { name: 'ARC Advisory Group: Enterprise Asset Management Global Market Report', url: 'https://arcweb.com/eam-report' }
    ]
  },
  {
    id: 'scenario-solid-state-batteries',
    title: 'Investigate solid-state battery commercialization bottlenecks and market timeline.',
    domain: 'Clean Energy & Materials Science',
    priority: 'Critical',
    agentId: 'agent-cyberquant',
    agentName: 'CyberQuant (Analysis Agent)',
    description: 'Deep quantitative assessment of sulfide vs oxide solid electrolyte stability, dendrite suppression, roll-to-roll manufacturing yield, and OEM adoption timelines.',
    steps: [
      {
        type: 'UNDERSTAND',
        title: 'Task Decomposition & Electrolyte Chemistry Scope',
        summary: 'Scoped research to Solid Electrolyte Interface (SEI) degradation, critical current density (CCD), manufacturing scalability, and cost/kWh projections.',
        graphNode: 'MISSION',
        progress: 15,
        delayMs: 1200
      },
      {
        type: 'PLAN',
        title: 'Strategic Verification Plan Formulated',
        summary: 'Configured automated query stream across materials patent databases, pilot line yield reports, and EV OEM supply agreements.',
        graphNode: 'PLAN',
        progress: 30,
        delayMs: 1400
      },
      {
        type: 'ACT',
        toolId: 'tool-web-search',
        toolName: 'Web Search Engine',
        toolInput: { query: 'solid state battery commercialization timeline sulfide oxide electrolyte yield 2026' },
        title: 'Querying Global Materials Science Repositories',
        summary: 'Retrieving patent filings and pilot production telemetry from top energy laboratories.',
        graphNode: 'SEARCH WEB',
        progress: 50,
        delayMs: 1900
      },
      {
        type: 'OBSERVE',
        title: 'Chemical & Manufacturing Observation',
        summary: 'Analyzed 24 pilot production lines. Sulfide electrolytes lead energy density (450 Wh/kg) but suffer moisture sensitivity (H2S generation). Oxides offer thermal safety but present high interface impedance.',
        observation: 'Identified 3 fundamental commercial bottlenecks: 1) Continuous isostatic pressing yield (<65%), 2) Lithium dendrite propagation at >5 mA/cm² CCD, 3) High dry-room capital expenditure.',
        graphNode: 'OBSERVE',
        progress: 65,
        delayMs: 1600
      },
      {
        type: 'ACT',
        toolId: 'tool-calculator',
        toolName: 'Financial & Mathematical Engine',
        toolInput: { expression: 'cost_per_kwh_projection(2026_to_2030, yield_curve=0.82)' },
        title: 'Cost Trajectory Modeling',
        summary: 'Calculating projected cost parity with traditional Li-ion (NMC811) based on simulated manufacturing learning rates.',
        graphNode: 'ANALYZE',
        progress: 80,
        delayMs: 1700
      },
      {
        type: 'OBSERVE',
        title: 'Cost Model Observation',
        summary: 'Projected cell cost: $148/kWh in 2026, reaching parity with liquid electrolyte cells ($85/kWh) by 2029–2030.',
        observation: 'Cost parity milestone modeled at Q4 2029 assuming 82% roll-to-roll coating yields at >10 GWh scale.',
        graphNode: 'ANALYZE',
        progress: 90,
        delayMs: 1300
      },
      {
        type: 'EVALUATE',
        title: 'OEM Timeline Verification',
        summary: 'Corroborated pilot line data with announced commercial roadmaps from Toyota, QuantumScape, CATL, and Samsung SDI.',
        graphNode: 'VERIFY',
        progress: 96,
        delayMs: 1100
      },
      {
        type: 'SYNTHESIZE',
        title: 'Final Clean Energy Briefing Assembled',
        summary: 'Formulated market entry timeline, risk matrix, and investment recommendations.',
        graphNode: 'VERIFY',
        progress: 100,
        delayMs: 900
      }
    ],
    finalResult: `# Executive Briefing: Solid-State Battery Commercialization & Market Timeline

## Executive Summary
Solid-State Batteries (SSB) represent the definitive next-generation energy storage architecture, delivering **450–500 Wh/kg gravimetric energy density** and near-zero thermal runaway risk. However, full automotive mass-market commercialization is bottlenecked by electrolyte interface impedance and high manufacturing capital intensity. Large-scale EV adoption will occur in **two distinct waves: premium specialty vehicles (2026–2027) followed by mainstream mass-market parity (2029–2030)**.

---

## Commercialization Roadmap

\`\`\`
2025-2026: Semi-Solid / Hybrid Polymer Pilot Lines (350 Wh/kg)
     │
2027-2028: Premium Niche & High-End EV Production (Sulfide & Ceramic, 450 Wh/kg)
     │
2029-2030+: Giga-Scale Roll-to-Roll Parity (<$85/kWh, Mass EV Market)
\`\`\`

---

## Critical Bottlenecks & Solutions Matrix

| Bottleneck Category | Failure Mechanism | State-of-the-Art Mitigation |
| :--- | :--- | :--- |
| **Interfacial Resistance** | Chemo-mechanical volume expansion of Li anode during cycling | 3D-engineered porous host frameworks with elastic polymer interlayers |
| **Dendrite Growth** | Void formation and localized current hotspots at >5 mA/cm² | Superionic conductor coatings (Li3InCl6 / Argyrodite modifications) |
| **Manufacturing Yield** | Brittle ceramic electrolyte fracture in high-speed web handling | Dry electrode fabrication paired with isostatic press calendering |

---

> **Confidence Rating:** 96.7% | **Analyzed Datasets:** 24 pilot lines, 42 patents | **Engine:** CyberQuant Intelligence Engine`,
    sources: [
      { name: 'Nature Energy: Solid Electrolyte Interphase Dynamics', url: 'https://nature.com/articles/nenergy-ssb-2025' },
      { name: 'BloombergNEF: 2026 Battery Technology Outlook', url: 'https://bnef.com/insights/battery-outlook' },
      { name: 'Advanced Functional Materials: Dendrite Suppression Mechanisms', url: 'https://onlinelibrary.wiley.com/afm/ssb' }
    ]
  },
  {
    id: 'scenario-quantum-cryptography',
    title: 'Evaluate post-quantum cryptography migration strategies for financial transactions.',
    domain: 'Cybersecurity & Quantum Computing',
    priority: 'Critical',
    agentId: 'agent-sentinel',
    agentName: 'Sentinel-Prime (Research Agent)',
    description: 'Risk assessment of Shor’s algorithm against RSA/ECC public key infrastructure and migration to NIST-standardized lattice algorithms (ML-KEM, ML-DSA).',
    steps: [
      {
        type: 'UNDERSTAND',
        title: 'Quantum Threat Vector Classification',
        summary: 'Deconstructed "Harvest Now, Decrypt Later" (HNDL) threats against SWIFT, TLS 1.3 handshakes, and ledger signatures.',
        graphNode: 'MISSION',
        progress: 15,
        delayMs: 1100
      },
      {
        type: 'PLAN',
        title: 'Cryptographic Migration Pathway Formulation',
        summary: 'Defined multi-stage evaluation across NIST FIPS 203/204/205 standards, latency overheads, and dual-signature hybrid models.',
        graphNode: 'PLAN',
        progress: 30,
        delayMs: 1300
      },
      {
        type: 'ACT',
        toolId: 'tool-code-executor',
        toolName: 'Python Sandbox / Code Executor',
        toolInput: { code: 'benchmark_pqc_handshake_latency(algorithms=["ML-KEM-768", "ML-DSA-65", "ECDSA-P256"])' },
        title: 'Benchmarking PQC Handshake Latency',
        summary: 'Simulating transaction throughput and packet fragmentation for quantum-resistant cipher suites.',
        graphNode: 'SEARCH WEB',
        progress: 55,
        delayMs: 1900
      },
      {
        type: 'OBSERVE',
        title: 'Latency Telemetry Observation',
        summary: 'ML-KEM-768 key encapsulation adds only 0.42ms computation overhead. ML-DSA signature size increases public key packet size from 64B to 1,312B.',
        observation: 'Cryptographic benchmark: ML-KEM-768 achieves 99.1% of classical TLS throughput. Key vulnerability is network MTU packet fragmentation on legacy banking routers.',
        graphNode: 'OBSERVE',
        progress: 70,
        delayMs: 1500
      },
      {
        type: 'ACT',
        toolId: 'tool-knowledge-base',
        toolName: 'Vector Knowledge Base',
        toolInput: { query: 'NIST post-quantum cryptographic standards financial compliance timeline' },
        title: 'Knowledge Base Policy Query',
        summary: 'Querying internal regulatory repository for Basel Committee and Federal Reserve PQC transition mandates.',
        graphNode: 'ANALYZE',
        progress: 85,
        delayMs: 1600
      },
      {
        type: 'OBSERVE',
        title: 'Compliance Policy Observation',
        summary: 'Retrieved 3 regulatory directives: Mandatory cryptographic inventory by Q4 2026, dual-hybrid deployment by Q2 2027.',
        observation: 'Regulatory mandate confirms hybrid classical-quantum signatures as the required bridge mechanism through 2030.',
        graphNode: 'ANALYZE',
        progress: 92,
        delayMs: 1200
      },
      {
        type: 'SYNTHESIZE',
        title: 'Final Post-Quantum Blueprint Delivered',
        summary: 'Delivered financial migration roadmap, MTU mitigation strategy, and algorithm selection guidelines.',
        graphNode: 'VERIFY',
        progress: 100,
        delayMs: 900
      }
    ],
    finalResult: `# Executive Briefing: Post-Quantum Cryptography (PQC) Financial Migration

## Threat Context: The "Harvest Now, Decrypt Later" Threat
Adversaries are actively exfiltrating encrypted high-value financial telemetry and confidential transaction logs to store until cryptanalytically relevant quantum computers (CRQC) can break underlying RSA-2048 and ECC-256 keys via Shor's algorithm. Financial institutions must initiate immediate migration to NIST-standardized Post-Quantum algorithms.

---

## Standardized Algorithm Selection Matrix

| Purpose | Classical Standard | NIST PQC Replacement | Key Size Impact |
| :--- | :--- | :--- | :--- |
| **Key Encapsulation (KEM)** | ECDH / RSA Key Exchange | **ML-KEM (Kyber-768)** | 1,184 Bytes (vs 32 Bytes) |
| **Digital Signatures** | ECDSA / RSA-PSS | **ML-DSA (Dilithium-3)** | 3,293 Bytes (vs 64 Bytes) |
| **High-Security Signatures** | Ed25519 | **SLH-DSA (SPHINCS+)** | 17,088 Bytes (Stateless Hash) |

---

## 3-Stage Financial Migration Blueprint
1. **Stage 1: Cryptographic Inventory & Discovery (2025–2026)**
   - Scan all internal APIs, TLS endpoints, HSMs, and database encryption layers to identify hardcoded RSA/ECC dependencies.
2. **Stage 2: Hybrid Dual-Signature Protocol Rollout (2026–2027)**
   - Implement composite TLS ciphers combining X25519 + ML-KEM-768, guaranteeing classical security while establishing quantum resistance.
3. **Stage 3: Full PQC Enforcement & Legacy Deprecation (2028–2030)**
   - Deprecate classical public key infrastructure; enforce mandatory ML-DSA hardware security module verification across SWIFT payment rails.

> **Confidence Rating:** 99.2% | **NIST Compliance:** FIPS 203 / 204 Compliant`,
    sources: [
      { name: 'NIST Post-Quantum Cryptography Standardization Project', url: 'https://csrc.nist.gov/projects/pqc' },
      { name: 'Bank for International Settlements (BIS): Project Leap', url: 'https://bis.org/publ/othp59.htm' }
    ]
  }
];
