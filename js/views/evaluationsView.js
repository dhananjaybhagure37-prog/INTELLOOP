/* ==========================================================================
   INTELLOOP — AGENT EVALUATIONS & BENCHMARKS VIEW
   Systemic performance evaluation, hallucination rates, and benchmark tests
   ========================================================================== */

import { ApiClient } from '../api/client.js';
import { toast } from '../components/toast.js';

let state = {
  evaluations: [],
  loading: true
};

export function renderEvaluationsView() {
  if (state.loading) {
    return `
      <div class="flex flex-col items-center justify-center h-64">
        <span class="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
        <span class="mt-4 text-on-surface-variant text-sm">Loading evaluation metrics...</span>
      </div>
    `;
  }

  // Calculate Aggregates
  const completedEvals = state.evaluations.filter(e => e.status === 'COMPLETED');
  const totalEvals = completedEvals.length;
  
  let avgAccuracy = 0;
  let avgHallucination = 0;
  let totalToolCalls = 0;
  let avgReliability = 0;

  if (totalEvals > 0) {
    avgAccuracy = (completedEvals.reduce((acc, e) => acc + e.accuracy_score, 0) / totalEvals) * 100;
    avgHallucination = (completedEvals.reduce((acc, e) => acc + e.hallucination_rate, 0) / totalEvals) * 100;
    totalToolCalls = completedEvals.reduce((acc, e) => acc + e.tool_call_count, 0);
    avgReliability = (completedEvals.reduce((acc, e) => acc + e.reliability_score, 0) / totalEvals) * 100;
  }

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
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Avg Accuracy Score</span>
          <div class="text-3xl font-bold ${avgAccuracy > 90 ? 'text-emerald-400' : 'text-primary'} font-mono mt-3">${avgAccuracy.toFixed(1)}%</div>
          <span class="text-[11px] text-on-surface-variant mt-1">Across ${totalEvals} completed runs</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Hallucination Rate</span>
          <div class="text-3xl font-bold text-primary font-mono mt-3">${avgHallucination.toFixed(1)}%</div>
          <span class="text-[11px] text-emerald-400 mt-1">Lower is better</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Total Tool Calls</span>
          <div class="text-3xl font-bold text-secondary font-mono mt-3">${totalToolCalls}</div>
          <span class="text-[11px] text-on-surface-variant mt-1">During evaluation phase</span>
        </div>

        <div class="rounded-xl bg-surface-container/90 p-5 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Reliability Rate</span>
          <div class="text-3xl font-bold text-tertiary font-mono mt-3">${avgReliability.toFixed(1)}%</div>
          <span class="text-[11px] text-on-surface-variant mt-1">Completed without crash</span>
        </div>
      </div>

      <!-- Benchmark Test Cases -->
      <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-xl">
        <h2 class="text-base font-bold text-on-surface mb-4">Live Benchmark Results</h2>
        
        <div class="space-y-3 text-xs">
          ${state.evaluations.length === 0 ? '<p class="text-on-surface-variant text-center py-4">No evaluations run yet.</p>' : ''}
          ${state.evaluations.map((ev, i) => {
            const isCompleted = ev.status === 'COMPLETED';
            const color = isCompleted ? (ev.reliability_score === 1 ? 'emerald' : 'error') : 'primary';
            const statusText = isCompleted ? (ev.reliability_score === 1 ? `PASSED (${(ev.accuracy_score*100).toFixed(1)}%)` : 'FAILED') : 'RUNNING';
            
            return `
              <div class="p-4 rounded-xl bg-surface-lowest/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-lg bg-${color}-500/10 text-${color}-400 flex items-center justify-center font-bold font-mono">${i+1}</span>
                  <div>
                    <span class="font-bold text-on-surface block">${ev.scenario_type} Scenario (${ev.baseline_or_autonomous})</span>
                    <span class="text-on-surface-variant text-[11px]">Inv ID: ${ev.investigation_id} | Latency: ${ev.latency.toFixed(2)}s | Tool Calls: ${ev.tool_call_count}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-1 rounded bg-${color}-500/15 text-${color}-400 font-mono font-bold text-[11px] uppercase">${statusText}</span>
                  ${isCompleted && !ev.human_accuracy ? `
                    <button class="human-eval-btn bg-surface-bright text-xs px-2 py-1 rounded hover:bg-surface-variant" data-id="${ev.id}">
                      Judge
                    </button>
                  ` : ''}
                  ${ev.human_accuracy ? `<span class="text-emerald-400 text-[10px]">Judged</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

async function loadEvaluations() {
  state.loading = true;
  document.getElementById('view-mount').innerHTML = renderEvaluationsView();
  try {
    const evals = await ApiClient.getEvaluations();
    state.evaluations = evals;
  } catch (err) {
    console.error(err);
    toast.show('Failed to load evaluations', 'error');
  } finally {
    state.loading = false;
    document.getElementById('view-mount').innerHTML = renderEvaluationsView();
    bindEvaluationsEvents();
  }
}

export function bindEvaluationsEvents() {
  if (state.loading) {
    // Start initial fetch
    loadEvaluations();
    return;
  }

  const runBtn = document.getElementById('run-eval-suite-btn');
  if (runBtn) {
    runBtn.onclick = async () => {
      runBtn.disabled = true;
      runBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">autorenew</span> Running...';
      toast.show('Running standardized benchmark suite in background. Check back in a minute.', 'info');
      try {
        await ApiClient.runEvaluationSuite();
      } catch (err) {
        toast.show('Failed to start suite', 'error');
        runBtn.disabled = false;
        runBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">play_circle</span> Run Benchmark Suite';
      }
    };
  }

  document.querySelectorAll('.human-eval-btn').forEach(btn => {
    btn.onclick = async (e) => {
      const id = e.target.getAttribute('data-id');
      const accuracy = prompt("Rate accuracy (1-5):", "5");
      if (!accuracy) return;
      const reasoning = prompt("Rate reasoning quality (1-5):", "5");
      if (!reasoning) return;
      
      try {
        await ApiClient.submitHumanEvaluation(id, {
          accuracy: parseInt(accuracy, 10),
          reasoning_quality: parseInt(reasoning, 10),
          evidence_quality: 5,
          final_answer_quality: 5,
          handled_uncertainty: 1,
          refused_unsupported: 1,
          comments: "Human judged."
        });
        toast.show('Human evaluation saved!', 'success');
        loadEvaluations();
      } catch(err) {
        toast.show('Error saving judgment', 'error');
      }
    }
  });
}
