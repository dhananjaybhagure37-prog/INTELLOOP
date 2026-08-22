/* ==========================================================================
   INTELLOOP — ANALYTICS & INTELLIGENCE METRICS VIEW
   Telemetry distributions, tool call frequencies, latency & throughput graphs
   ========================================================================== */

import { store } from '../state/store.js';

export function renderAnalyticsView() {
  const state = store.getState();
  const tools = state.tools || [];
  const totalUses = tools.reduce((acc, t) => acc + (t.totalUses || 0), 0);

  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Telemetry BI</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Intelligence Analytics & Metrics</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Execution throughput, tool invocation distribution, and multi-agent latency curves</p>
        </div>
      </div>

      <!-- High-Level KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-5 rounded-2xl bg-surface-container/90 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Mean Execution Latency</span>
          <div class="text-3xl font-bold text-primary font-mono mt-3">1.24s</div>
          <span class="text-[11px] text-emerald-400 mt-1">-18% vs standard LLM</span>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container/90 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Total Tool Invocations</span>
          <div class="text-3xl font-bold text-secondary font-mono mt-3">${totalUses}</div>
          <span class="text-[11px] text-on-surface-variant mt-1">Across 8 registered tools</span>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container/90 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Agent Success Convergence</span>
          <div class="text-3xl font-bold text-emerald-400 font-mono mt-3">98.4%</div>
          <span class="text-[11px] text-on-surface-variant mt-1">First-pass completion</span>
        </div>

        <div class="p-5 rounded-2xl bg-surface-container/90 border border-white/5 flex flex-col justify-between">
          <span class="text-xs font-semibold text-on-surface-variant uppercase">Memory Retrieval Latency</span>
          <div class="text-3xl font-bold text-tertiary font-mono mt-3">380ms</div>
          <span class="text-[11px] text-on-surface-variant mt-1">HNSW Vector Graph Index</span>
        </div>
      </div>

      <!-- Main Analytics Bento -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Tool Usage Breakdown (6 cols) -->
        <div class="lg:col-span-6 rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-xl">
          <h2 class="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">pie_chart</span>
            Tool Call Distribution
          </h2>

          <div class="space-y-4 text-xs">
            ${tools.map(t => {
              const pct = Math.round(((t.totalUses || 0) / (totalUses || 1)) * 100);
              return `
                <div>
                  <div class="flex justify-between text-xs mb-1">
                    <span class="font-medium text-on-surface">${t.name}</span>
                    <span class="font-mono text-on-surface-variant">${t.totalUses} calls (${pct}%)</span>
                  </div>
                  <div class="w-full h-2 bg-surface-lowest rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style="width: ${pct}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Latency by Agent (6 cols) -->
        <div class="lg:col-span-6 rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-xl">
          <h2 class="text-base font-bold text-on-surface mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[18px]">speed</span>
            Autonomous Agent Throughput & Latency
          </h2>

          <div class="space-y-3 text-xs">
            ${state.agents.map(a => `
              <div class="p-3.5 rounded-xl bg-surface-lowest/70 border border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <img src="${a.avatar}" class="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10" alt="${a.name}"/>
                  <div>
                    <span class="font-bold text-on-surface block">${a.name}</span>
                    <span class="text-[11px] text-on-surface-variant">${a.tasksCompleted} Missions Completed</span>
                  </div>
                </div>
                <div class="text-right font-mono">
                  <span class="text-xs text-primary font-bold block">${a.avgLatency}</span>
                  <span class="text-[10px] text-emerald-400">${a.successRate}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
