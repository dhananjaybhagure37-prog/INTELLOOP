/* ==========================================================================
   INTELLOOP — TOOL REGISTRY & LIVE SANDBOX VIEW
   Complete tool catalog with enable/disable switches and interactive sandbox
   ========================================================================== */

import { store } from '../state/store.js';
import { ToolRegistry } from '../tools/toolRegistry.js';
import { toast } from '../components/toast.js';

export function renderToolsView() {
  const state = store.getState();
  const tools = state.tools || [];

  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">construction</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Capability Framework</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Autonomous Tool Registry</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Hardware sandbox, external vector APIs, and computational modules available to agents</p>
        </div>
      </div>

      <!-- Main Layout: Tool Cards Grid (8 cols) + Live Test Sandbox (4 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Tools Grid (7 cols) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${tools.map(t => {
            const isActive = t.status === 'active';
            return `
              <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-md hover:shadow-xl transition-all">
                <div class="rounded-xl bg-surface-container/90 backdrop-blur-xl p-5 flex flex-col justify-between h-full">
                  <div>
                    <div class="flex items-start justify-between mb-3">
                      <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-white/5">
                        <span class="material-symbols-outlined text-[22px]">${t.icon || 'construction'}</span>
                      </div>
                      <button class="toggle-tool-btn text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-surface-lowest text-on-surface-variant'}"
                              data-tool-id="${t.id}">
                        ${isActive ? 'ONLINE' : 'OFFLINE'}
                      </button>
                    </div>

                    <h3 class="font-headline-md text-sm font-bold text-on-surface mb-1">${t.name}</h3>
                    <span class="text-[10px] font-mono text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/15 inline-block mb-2">
                      ${t.category}
                    </span>
                    <p class="text-xs text-on-surface-variant leading-snug line-clamp-2 mb-3">
                      ${t.description}
                    </p>
                  </div>

                  <div class="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                    <span>Uses: <strong class="text-on-surface">${t.totalUses || 0}</strong></span>
                    <button class="select-sandbox-tool-btn text-xs text-primary hover:underline flex items-center gap-1 font-sans"
                            data-tool-id="${t.id}">
                      Test in Sandbox <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Interactive Tool Test Sandbox (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-[1px] shadow-2xl sticky top-20">
            <div class="rounded-2xl bg-surface-container/95 backdrop-blur-2xl p-6 flex flex-col gap-4">
              <div class="flex items-center justify-between pb-3 border-b border-white/10">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-[20px]">terminal</span>
                  <h2 class="text-sm font-bold text-on-surface">Interactive Tool Sandbox</h2>
                </div>
                <span class="text-[10px] font-mono text-primary px-2 py-0.5 rounded bg-primary/15">Live REPL</span>
              </div>

              <!-- Tool Select -->
              <div class="flex flex-col gap-1.5 text-xs">
                <label for="sandbox-tool-select" class="text-on-surface-variant font-medium">Select Tool to Test:</label>
                <select id="sandbox-tool-select" class="form-input text-xs">
                  ${tools.map(t => `<option value="${t.id}">${t.name} (${t.category})</option>`).join('')}
                </select>
              </div>

              <!-- Test Input -->
              <div class="flex flex-col gap-1.5 text-xs">
                <label for="sandbox-input-payload" class="text-on-surface-variant font-medium">Input Query / Parameters:</label>
                <textarea id="sandbox-input-payload" rows="3" class="form-input text-xs font-mono resize-none"
                          placeholder='e.g. {"query": "AI predictive maintenance case studies 2026"}'></textarea>
              </div>

              <button id="run-sandbox-btn" class="w-full py-2 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(173,198,255,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                Execute Tool in Sandbox
              </button>

              <!-- Sandbox Output Viewer -->
              <div class="flex flex-col gap-1 text-xs">
                <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Sandbox Telemetry Output:</span>
                <div id="sandbox-output-display" class="p-3.5 rounded-xl bg-surface-lowest font-mono text-[11px] text-primary border border-white/5 min-h-[140px] max-h-60 overflow-y-auto hide-scrollbar whitespace-pre-wrap">
// Ready to execute. Select a tool and click "Execute Tool in Sandbox".
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindToolsEvents() {
  const toggleBtns = document.querySelectorAll('.toggle-tool-btn');
  const selectSandboxBtns = document.querySelectorAll('.select-sandbox-tool-btn');
  const toolSelect = document.getElementById('sandbox-tool-select');
  const inputPayload = document.getElementById('sandbox-input-payload');
  const runSandboxBtn = document.getElementById('run-sandbox-btn');
  const outputDisplay = document.getElementById('sandbox-output-display');

  const registry = new ToolRegistry(store.getState().tools);

  toggleBtns.forEach(btn => {
    btn.onclick = () => {
      const toolId = btn.dataset.toolId;
      const updated = store.toggleToolStatus(toolId);
      if (updated) {
        toast.show(`Tool ${updated.name} is now ${updated.status.toUpperCase()}`, 'info');
      }
    };
  });

  selectSandboxBtns.forEach(btn => {
    btn.onclick = () => {
      const toolId = btn.dataset.toolId;
      if (toolSelect) {
        toolSelect.value = toolId;
        toolSelect.dispatchEvent(new Event('change'));
      }
    };
  });

  if (toolSelect) {
    toolSelect.onchange = () => {
      const tool = registry.get(toolSelect.value);
      if (tool && inputPayload) {
        if (tool.id === 'tool-web-search') inputPayload.value = '{"query": "AI predictive maintenance industrial benchmarks"}';
        else if (tool.id === 'tool-code-executor') inputPayload.value = '{"code": "import numpy as np\\nprint(np.mean([42, 48, 52, 60]))"}';
        else if (tool.id === 'tool-calculator') inputPayload.value = '{"expression": "4850000 * 0.386"}';
        else inputPayload.value = '{"query": "test parameters"}';
      }
    };
    toolSelect.dispatchEvent(new Event('change'));
  }

  if (runSandboxBtn) {
    runSandboxBtn.onclick = async () => {
      const toolId = toolSelect.value;
      let params = {};
      try {
        params = JSON.parse(inputPayload.value || '{}');
      } catch (e) {
        params = { query: inputPayload.value };
      }

      if (outputDisplay) {
        outputDisplay.innerHTML = `<span class="text-secondary animate-pulse">>>> Initializing ephemeral sandbox runtime...\n>>> Dispatched payload to ${toolId}</span>`;
      }

      try {
        const result = await registry.run(toolId, params);
        store.incrementToolUsage(toolId);
        if (outputDisplay) {
          outputDisplay.innerHTML = `<span class="text-emerald-400 font-bold">[EXECUTION SUCCESS] Status 200 OK</span>\n` + JSON.stringify(result, null, 2);
        }
        toast.show(`Tool executed successfully!`, 'success');
      } catch (err) {
        if (outputDisplay) {
          outputDisplay.innerHTML = `<span class="text-error font-bold">[EXECUTION ERROR]</span>\n${err.message}`;
        }
        toast.show(err.message, 'error');
      }
    };
  }
}
