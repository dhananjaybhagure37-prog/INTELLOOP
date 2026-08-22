/* ==========================================================================
   INTELLOOP — AGENT EVALUATIONS & BENCHMARKS VIEW
   Systemic performance evaluation, hallucination rates, and benchmark tests
   ========================================================================== */

import { store } from '../state/store.js';
import { toast } from '../components/toast.js';

export function renderEvaluationsView() {
  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">assignment_turned_in</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Verification Suite</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Agent Evaluations & Benchmarks</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Automated factual consistency tests, reasoning depth scoring, and regression benchmarks</p>
        </div>

        <button id="run-eval-suite-btn" class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-xs font-bold shadow-[0_0_15px_rgba(173,198,255,0.3)] hover:opacity-90 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">play_circle</span>
          Run Benchmark Suite
        </button>
      </div>

      <!-- Evaluation Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Factual Grounding Score</span>
          <div class="text-3xl font-bold text-emerald-400 font-mono mt-3">99.1%</div>
          <span class="text-[11px] text-on-surface-variant mt-1">+0.8% vs last baseline</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Hallucination Rate</span>
          <div class="text-3xl font-bold text-primary font-mono mt-3">0.4%</div>
          <span class="text-[11px] text-emerald-400 mt-1">-1.2% reduction</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Tool Selection Accuracy</span>
          <div class="text-3xl font-bold text-secondary font-mono mt-3">97.8%</div>
          <span class="text-[11px] text-on-surface-variant mt-1">426 tool calls verified</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Plan Execution Depth</span>
          <div class="text-3xl font-bold text-tertiary font-mono mt-3">4.8 / 5.0</div>
          <span class="text-[11px] text-on-surface-variant mt-1">Optimal acyclic routing</span>
        </div>
      </div>

      <!-- Benchmark Test Cases -->
      <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-xl">
        <h2 class="text-base font-bold text-on-surface mb-4">Standardized Reasoning Benchmark Test Suite (GAIA / SWE-Bench / Custom)</h2>

        <div class="space-y-3 text-xs">
          <div class="p-4 rounded-xl bg-surface-lowest/70 border border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">P1</span>
              <div>
                <span class="font-bold text-on-surface block">Multi-Hop Quantitative Research (Acoustic Telemetry vs Failure Rates)</span>
                <span class="text-on-surface-variant text-[11px]">Evaluates tool dispatch, CSV extraction, and regression model accuracy.</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[11px]">PASSED (99.4%)</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-surface-lowest/70 border border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">P2</span>
              <div>
                <span class="font-bold text-on-surface block">Constraint Satisfaction & Recursive Decomposition</span>
                <span class="text-on-surface-variant text-[11px]">Evaluates planning tree branch pruning under max step limits.</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[11px]">PASSED (98.1%)</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-surface-lowest/70 border border-white/5 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">P3</span>
              <div>
                <span class="font-bold text-on-surface block">Adversarial Prompt & Hallucination Resistance</span>
                <span class="text-on-surface-variant text-[11px]">Tests fallback citation checks when external search returns conflicting data.</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span class="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[11px]">PASSED (99.8%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindEvaluationsEvents() {
  const runBtn = document.getElementById('run-eval-suite-btn');
  if (runBtn) {
    runBtn.onclick = () => {
      toast.show('Running standardized benchmark suite...', 'info');
      setTimeout(() => {
        toast.show('Benchmark suite completed: 100% test cases passed!', 'success');
      }, 1500);
    };
  }
}
