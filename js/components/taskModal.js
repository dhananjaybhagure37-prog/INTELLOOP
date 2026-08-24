/* ==========================================================================
   INTELLOOP — TASK LAUNCH MODAL COMPONENT
   ========================================================================== */

import { store } from '../state/store.js';
import { ApiClient } from '../api/client.js';
import { PROMPT_SCENARIOS } from '../engine/promptScenarios.js';
import { INITIAL_AGENTS } from '../state/initialData.js';
import { INITIAL_TOOLS } from '../tools/toolRegistry.js';
import { toast } from './toast.js';

export function renderTaskModal() {
  const state = store.getState();
  const agents = (state.agents && state.agents.length > 0) ? state.agents : INITIAL_AGENTS;
  const tools = (state.tools && state.tools.length > 0) ? state.tools : INITIAL_TOOLS;

  return `
    <div id="new-task-modal" class="modal-backdrop">
      <div class="modal-dialog w-full max-w-2xl bg-surface-container/95 border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        <!-- Ambient Header Bloom -->
        <div class="absolute -top-12 -left-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -top-12 -right-12 w-48 h-48 bg-secondary/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b border-white/5 relative z-10">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[20px]">rocket_launch</span>
            </div>
            <div>
              <h2 class="font-headline-md text-lg text-on-surface font-semibold">Deploy Autonomous Agent</h2>
              <p class="text-xs text-on-surface-variant">Initialize a multi-step agentic reasoning pipeline</p>
            </div>
          </div>
          <button id="close-task-modal-btn" class="text-on-surface-variant hover:text-on-surface p-1 rounded hover:bg-white/5">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <form id="new-task-form" class="mt-5 flex flex-col gap-4 relative z-10">
          <!-- Preset Scenarios Quick Select -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-sm text-xs text-on-surface-variant">Quick Scenario Presets (Hackathon Demo Ready):</label>
            <div class="flex flex-wrap gap-2" id="modal-preset-pills">
              ${PROMPT_SCENARIOS.map(s => `
                <button type="button" data-scenario-id="${s.id}" 
                        class="preset-pill px-3 py-1 rounded-full text-xs font-medium bg-surface-container-high hover:bg-primary/20 text-on-surface-variant hover:text-primary border border-white/5 transition-all truncate max-w-xs">
                  ${s.title.substring(0, 42)}...
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Mission Objective Textarea -->
          <div class="flex flex-col gap-1.5">
            <label for="task-prompt-input" class="font-label-sm text-xs text-on-surface-variant font-medium">Mission Objective / Task Prompt:</label>
            <textarea id="task-prompt-input" rows="3" required
                      class="form-input w-full bg-[#0c1324] border border-white/10 rounded-xl p-3.5 text-sm text-[#dce1fb] placeholder:text-[#c2c6d6]/55 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#0c1324] transition-all resize-none"
                      placeholder="Specify what the agent should investigate, analyze, calculate, or solve..."></textarea>
          </div>

          <!-- Grid: Domain & Priority -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="task-domain-select" class="font-label-sm text-xs text-on-surface-variant">Task Domain:</label>
              <select id="task-domain-select" class="form-input text-xs">
                <option value="Industrial IoT & AI Operations">Industrial IoT & AI Operations</option>
                <option value="Clean Energy & Materials Science">Clean Energy & Materials Science</option>
                <option value="Cybersecurity & Quantum Computing">Cybersecurity & Quantum Computing</option>
                <option value="BioTech & Precision Medicine">BioTech & Precision Medicine</option>
                <option value="Financial Quantitative Modeling">Financial Quantitative Modeling</option>
                <option value="General AI Intelligence">General AI Intelligence</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="task-priority-select" class="font-label-sm text-xs text-on-surface-variant">Execution Priority:</label>
              <select id="task-priority-select" class="form-input text-xs">
                <option value="High">High Priority</option>
                <option value="Critical">Critical (Immediate Dispatch)</option>
                <option value="Medium" selected>Medium Priority</option>
                <option value="Low">Low / Background Batch</option>
              </select>
            </div>
          </div>

          <!-- Agent Selector -->
          <div class="flex flex-col gap-1.5">
            <label for="task-agent-select" class="font-label-sm text-xs text-on-surface-variant">Assigned Autonomous Agent:</label>
            <select id="task-agent-select" class="form-input text-xs">
              ${agents.map(a => `
                <option value="${a.id}" ${a.id === 'agent-sentinel' ? 'selected' : ''}>
                  ${a.name} — ${a.role} (${a.successRate} Success)
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Tool Registry Capabilities Selected -->
          <div class="flex flex-col gap-1.5">
            <label class="font-label-sm text-xs text-on-surface-variant">Active Tools for Pipeline:</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${tools.slice(0, 4).map(t => `
                <label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-high/40 border border-white/5 text-xs text-on-surface cursor-pointer hover:bg-white/5 transition-all">
                  <input type="checkbox" checked class="accent-primary rounded" />
                  <span class="truncate">${t.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-2">
            <button type="button" id="cancel-task-btn" class="px-4 py-2 text-xs font-label-md text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit" id="run-agent-btn" class="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(173,198,255,0.4)] hover:shadow-[0_0_25px_rgba(173,198,255,0.6)] transition-all flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px]">rocket_launch</span>
              Run Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function bindTaskModalEvents() {
  const modal = document.getElementById('new-task-modal');
  const closeBtn = document.getElementById('close-task-modal-btn');
  const cancelBtn = document.getElementById('cancel-task-btn');
  const form = document.getElementById('new-task-form');
  const promptInput = document.getElementById('task-prompt-input');

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
  };

  const populateAgentOptions = () => {
    const agentSelect = document.getElementById('task-agent-select');
    if (!agentSelect) return;
    const agentsList = (store.getState().agents && store.getState().agents.length > 0)
      ? store.getState().agents
      : INITIAL_AGENTS;
    if (agentSelect.children.length === 0 || agentSelect.options.length === 0) {
      const selectedVal = agentSelect.value || 'agent-sentinel';
      agentSelect.innerHTML = agentsList.map(a => `
        <option value="${a.id}" ${a.id === selectedVal ? 'selected' : ''}>
          ${a.name} — ${a.role} (${a.successRate} Success)
        </option>
      `).join('');
    }
  };

  populateAgentOptions();

  if (closeBtn) closeBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  // Preset pill clicks
  const presetPills = document.querySelectorAll('.preset-pill');
  presetPills.forEach(pill => {
    pill.onclick = () => {
      const scenarioId = pill.dataset.scenarioId;
      const scenario = PROMPT_SCENARIOS.find(s => s.id === scenarioId);
      if (scenario && promptInput) {
        promptInput.value = scenario.title;
        const domainSelect = document.getElementById('task-domain-select');
        const agentSelect = document.getElementById('task-agent-select');
        if (domainSelect) domainSelect.value = scenario.domain;
        if (agentSelect && scenario.agentId) agentSelect.value = scenario.agentId;
      }
    };
  });

  // Form Submit
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const title = promptInput.value.trim();
      if (!title) {
        toast.show('Please enter a mission objective.', 'warning');
        return;
      }

      const domain = document.getElementById('task-domain-select')?.value || 'General AI Intelligence';
      const priority = document.getElementById('task-priority-select')?.value || 'Medium';
      const agentId = document.getElementById('task-agent-select')?.value || 'agent-sentinel';
      const agent = store.getState().agents.find(a => a.id === agentId);
      
      const submitBtn = document.getElementById('run-agent-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">autorenew</span> Starting ReAct Agent...`;
      }

      try {
        const isChaosMode = document.getElementById('chaos-mode-toggle')?.checked || false;
        toast.show('Initializing ReAct Research Orchestrator...', 'info');
        
        const res = await ApiClient.createInvestigation(title, 'Standard', domain, isChaosMode);

        const mission = store.createMission({
          id: res.investigation_id,
          title,
          domain,
          priority,
          agentId,
          agentName: agent ? agent.name : 'Sentinel-Prime'
        });

        closeModal();
        toast.show(`Mission ${res.investigation_id} dispatched! Launching live execution stream...`, 'success');

        // Navigate to execution view and start autonomous runner
        window.location.hash = `#execution?id=${res.investigation_id}`;
      } catch (err) {
        console.error('Launch error:', err);
        toast.show(`Launch error: ${err.message}`, 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">rocket_launch</span> Run Agent`;
        }
      }
    };
  }
}
