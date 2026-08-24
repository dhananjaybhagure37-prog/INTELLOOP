/* ==========================================================================
   INTELLOOP — AGENTS MANAGEMENT VIEW
   Autonomous Agent Roster with capabilities, telemetry & deployment triggers
   ========================================================================== */

import { store } from '../state/store.js';
import { INITIAL_AGENTS } from '../state/initialData.js';
import { toast } from '../components/toast.js';

export function renderAgentsView() {
  const state = store.getState();
  const agents = (state.agents && state.agents.length > 0) ? state.agents : INITIAL_AGENTS;

  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Autonomous Squad</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Autonomous Agent Roster</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Specialized autonomous reasoning units available for task orchestration</p>
        </div>

        <button id="agents-new-mission-btn" class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-xs font-bold shadow-[0_0_15px_rgba(173,198,255,0.3)] hover:shadow-[0_0_22px_rgba(173,198,255,0.5)] transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">add_task</span>
          Deploy Agent
        </button>
      </div>

      <!-- Agent Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${agents.map(a => {
          const isActive = a.status === 'active';
          return `
            <div class="rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg hover:shadow-2xl transition-all group">
              <div class="rounded-2xl bg-surface-container/90 backdrop-blur-xl p-6 flex flex-col justify-between h-full relative overflow-hidden">
                <!-- Status & Avatar -->
                <div>
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <img src="${a.avatar}" alt="${a.name}" class="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-primary/50 transition-all" />
                        <span class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-outline-variant'} ring-2 ring-surface"></span>
                      </div>
                      <div>
                        <h3 class="font-headline-md text-base font-bold text-on-surface">${a.name}</h3>
                        <span class="text-xs text-primary font-mono">${a.role}</span>
                      </div>
                    </div>

                    <button class="toggle-agent-status-btn text-xs px-2.5 py-1 rounded-full font-mono font-semibold transition-colors ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-surface-lowest text-on-surface-variant border border-white/5'}"
                            data-agent-id="${a.id}">
                      ${isActive ? 'ACTIVE' : 'STANDBY'}
                    </button>
                  </div>

                  <!-- Specialization Description -->
                  <p class="text-xs text-on-surface-variant leading-relaxed mb-4">
                    ${a.specialization}
                  </p>

                  <!-- Telemetry Stats -->
                  <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-surface-lowest/70 border border-white/5 text-center mb-4">
                    <div>
                      <span class="text-[10px] text-on-surface-variant block">Tasks</span>
                      <span class="font-mono text-xs font-bold text-on-surface">${a.tasksCompleted}</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-on-surface-variant block">Success</span>
                      <span class="font-mono text-xs font-bold text-emerald-400">${a.successRate}</span>
                    </div>
                    <div>
                      <span class="text-[10px] text-on-surface-variant block">Latency</span>
                      <span class="font-mono text-xs font-bold text-primary">${a.avgLatency}</span>
                    </div>
                  </div>

                  <!-- Tools Assigned Pills -->
                  <div class="mb-4">
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1.5 font-semibold">Assigned Capabilities:</span>
                    <div class="flex flex-wrap gap-1.5">
                      ${(a.toolsAssigned || []).map(tId => {
                        const tObj = state.tools.find(tool => tool.id === tId);
                        return `
                          <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-white/5 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[10px] text-primary">${tObj ? tObj.icon : 'construction'}</span>
                            ${tObj ? tObj.name : tId}
                          </span>
                        `;
                      }).join('')}
                    </div>
                  </div>
                </div>

                <!-- Footer Action -->
                <div class="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span class="text-[11px] font-mono text-on-surface-variant">
                    Status: <strong class="text-on-surface">${a.state || 'Idle'}</strong>
                  </span>
                  <button class="deploy-this-agent-btn px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-semibold border border-primary/20 transition-all flex items-center gap-1"
                          data-agent-id="${a.id}">
                    <span class="material-symbols-outlined text-[14px]">rocket_launch</span>
                    Deploy
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindAgentsEvents() {
  const newMissionBtn = document.getElementById('agents-new-mission-btn');
  const toggleBtns = document.querySelectorAll('.toggle-agent-status-btn');
  const deployBtns = document.querySelectorAll('.deploy-this-agent-btn');

  if (newMissionBtn) {
    newMissionBtn.onclick = () => {
      const modal = document.getElementById('new-task-modal');
      if (modal) modal.classList.add('open');
    };
  }

  toggleBtns.forEach(btn => {
    btn.onclick = () => {
      const agentId = btn.dataset.agentId;
      const updated = store.toggleAgentStatus(agentId);
      if (updated) {
        toast.show(`${updated.name} status updated to ${updated.status.toUpperCase()}`, 'info');
      }
    };
  });

  deployBtns.forEach(btn => {
    btn.onclick = () => {
      const agentId = btn.dataset.agentId;
      const modal = document.getElementById('new-task-modal');
      const agentSelect = document.getElementById('task-agent-select');
      if (agentSelect) agentSelect.value = agentId;
      if (modal) modal.classList.add('open');
    };
  });
}
