/* ==========================================================================
   INTELLOOP — TOOL REGISTRY & LIVE SANDBOX VIEW (TAVILY + ARXIV INTEGRATION)
   Complete tool catalog with enable/disable switches and interactive sandbox
   ========================================================================== */

import { store } from '../state/store.js';
import { ApiClient } from '../api/client.js';
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
          <h1 class="text-2xl font-bold text-on-surface mt-1">Autonomous Tool Registry & Telemetry</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Real external integrations: Tavily Web Search API, arXiv Academic Search, and Safe AST Calculator</p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Dynamic Tool-Calling Engine Active</span>
        </div>
      </div>

      <!-- Main Layout: Tool Cards Grid (7 cols) + Live Test Sandbox (5 cols) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Tools Grid (7 cols) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4" id="tools-cards-grid">
          ${tools.map(t => renderToolCardHtml(t)).join('')}
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
                <span class="text-[10px] font-mono text-primary px-2 py-0.5 rounded bg-primary/15">Live Backend REPL</span>
              </div>

              <!-- Tool Select -->
              <div class="flex flex-col gap-1.5 text-xs">
                <label for="sandbox-tool-select" class="text-on-surface-variant font-medium">Select Tool to Test:</label>
                <select id="sandbox-tool-select" class="form-input text-xs bg-surface-lowest">
                  <option value="tool-academic-search">Academic Search (arXiv Official API)</option>
                  <option value="tool-web-search">Web Search (Tavily / Live Web)</option>
                  <option value="tool-calculator">Safe Calculator & Math Engine (Compute)</option>
                  <option value="tool-fetch-source">Source Fetcher & Scraper (Intelligence)</option>
                  <option value="tool-data-analyzer">Statistical & Comparative Analyzer (Compute)</option>
                </select>
              </div>

              <!-- Test Input -->
              <div class="flex flex-col gap-1.5 text-xs">
                <label for="sandbox-input-payload" class="text-on-surface-variant font-medium">Input Query / Expression:</label>
                <textarea id="sandbox-input-payload" rows="3" class="form-input text-xs font-mono resize-none bg-[#0c1324]"
                          placeholder='e.g. transformer models medical diagnosis or 25% of 2400'></textarea>
              </div>

              <button id="run-sandbox-btn" class="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-[#002e6a] font-bold text-xs rounded-lg shadow-[0_0_15px_rgba(173,198,255,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[16px]">play_arrow</span>
                Execute Tool in Sandbox
              </button>

              <!-- Sandbox Output Viewer -->
              <div class="flex flex-col gap-1 text-xs">
                <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Sandbox Telemetry Output:</span>
                <div id="sandbox-output-display" class="p-3.5 rounded-xl bg-surface-lowest font-mono text-[11px] text-primary border border-white/5 min-h-[140px] max-h-64 overflow-y-auto hide-scrollbar whitespace-pre-wrap">
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

function renderToolCardHtml(t) {
  const isActive = t.status === 'active';
  const totalUses = t.total_uses !== undefined ? t.total_uses : (t.totalUses || 0);
  const successCount = t.success_count !== undefined ? t.success_count : totalUses;
  const failCount = t.fail_count !== undefined ? t.fail_count : 0;
  const avgLatency = t.avg_latency_ms || t.avgLatencyMs || 250;
  const lastUsed = t.last_used || t.lastUsed || 'Recently';

  return `
    <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-md hover:shadow-xl transition-all">
      <div class="rounded-xl bg-surface-container/90 backdrop-blur-xl p-5 flex flex-col justify-between h-full">
        <div>
          <div class="flex items-start justify-between mb-3">
            <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary border border-white/5">
              <span class="material-symbols-outlined text-[22px]">${t.icon || 'construction'}</span>
            </div>
            <button class="toggle-tool-btn text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold transition-colors ${isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-surface-lowest text-on-surface-variant'}"
                    data-tool-id="${t.id}">
              ${isActive ? 'CONNECTED' : 'OFFLINE'}
            </button>
          </div>

          <h3 class="font-headline-md text-sm font-bold text-on-surface mb-1">${t.name}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] font-mono text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/15 inline-block">
              ${t.category}
            </span>
            <span class="text-[10px] font-mono text-on-surface-variant">Avg: ${avgLatency}ms</span>
          </div>
          <p class="text-xs text-on-surface-variant leading-snug line-clamp-2 mb-3">
            ${t.description}
          </p>
        </div>

        <div class="pt-3 border-t border-white/5 flex flex-col gap-2">
          <div class="flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
            <span>Calls: <strong class="text-on-surface font-bold">${totalUses}</strong></span>
            <span class="text-emerald-400">Success: ${successCount}</span>
            <span class="${failCount > 0 ? 'text-amber-400' : 'text-on-surface-variant'}">Fail: ${failCount}</span>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[10px] font-mono text-on-surface-variant/70">Last: ${lastUsed}</span>
            <button class="select-sandbox-tool-btn text-xs text-primary hover:underline flex items-center gap-1 font-sans font-semibold"
                    data-tool-id="${t.id}">
              Test in Sandbox <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindToolsEvents() {
  const grid = document.getElementById('tools-cards-grid');
  const toolSelect = document.getElementById('sandbox-tool-select');
  const inputPayload = document.getElementById('sandbox-input-payload');
  const runSandboxBtn = document.getElementById('run-sandbox-btn');
  const outputDisplay = document.getElementById('sandbox-output-display');

  // Fetch real tool stats from backend
  fetch('/api/tools')
    .then(res => res.json())
    .then(data => {
      if (data.tools && grid) {
        grid.innerHTML = data.tools.map(t => renderToolCardHtml(t)).join('');
        rebindGridButtons();
      }
    })
    .catch(err => console.warn('Could not refresh tool stats:', err));

  function rebindGridButtons() {
    const toggleBtns = document.querySelectorAll('.toggle-tool-btn');
    const selectSandboxBtns = document.querySelectorAll('.select-sandbox-tool-btn');

    toggleBtns.forEach(btn => {
      btn.onclick = () => {
        const toolId = btn.dataset.toolId;
        const updated = store.toggleToolStatus(toolId);
        if (updated) {
          btn.className = `toggle-tool-btn text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold transition-colors ${updated.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-surface-lowest text-on-surface-variant'}`;
          btn.innerText = updated.status === 'active' ? 'CONNECTED' : 'OFFLINE';
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
  }

  if (toolSelect) {
    toolSelect.onchange = () => {
      if (!inputPayload) return;
      if (toolSelect.value === 'tool-academic-search' || toolSelect.value === 'academic_search' || toolSelect.value === 'arxiv') {
        inputPayload.value = 'transformer models medical diagnosis';
      } else if (toolSelect.value === 'tool-calculator' || toolSelect.value === 'calculator') {
        inputPayload.value = '25% of 2400';
      } else if (toolSelect.value === 'tool-web-search' || toolSelect.value === 'searchWeb' || toolSelect.value === 'tavily') {
        inputPayload.value = 'latest electric vehicle sales trends India';
      } else if (toolSelect.value === 'tool-fetch-source') {
        inputPayload.value = 'https://pib.gov.in';
      } else {
        inputPayload.value = '{"query": "test parameters"}';
      }
    };
    toolSelect.dispatchEvent(new Event('change'));
  }

  if (runSandboxBtn) {
    runSandboxBtn.onclick = async () => {
      const toolId = toolSelect.value;
      const rawVal = inputPayload.value.trim();
      let params = {};

      if (toolId.includes('calc')) {
        params = { expression: rawVal, query: rawVal };
      } else if (toolId.includes('academic') || toolId.includes('arxiv')) {
        params = { query: rawVal, max_results: 4 };
      } else if (toolId.includes('search') || toolId.includes('web') || toolId.includes('tavily')) {
        params = { query: rawVal, max_results: 4 };
      } else if (toolId.includes('fetch')) {
        params = { url: rawVal };
      } else {
        try {
          params = JSON.parse(rawVal);
        } catch {
          params = { query: rawVal };
        }
      }

      if (outputDisplay) {
        outputDisplay.innerHTML = `<span class="text-secondary animate-pulse">>>> Initializing real tool sandbox runtime...\n>>> Dispatched payload to ${toolId}</span>`;
      }

      try {
        const result = await ApiClient.testTool(toolId, params);
        if (result && result.success === false) {
          if (outputDisplay) {
            outputDisplay.innerHTML = `<span class="text-amber-400 font-bold">[EXECUTION COMPLETED WITH ERRORS]</span>\n` + JSON.stringify(result, null, 2);
          }
          toast.show(`Tool execution failed: ${result.error || 'Check telemetry output'}`, 'error');
        } else {
          if (outputDisplay) {
            outputDisplay.innerHTML = `<span class="text-emerald-400 font-bold">[EXECUTION SUCCESS] Status 200 OK</span>\n` + JSON.stringify(result, null, 2);
          }
          toast.show(`Tool executed successfully!`, 'success');
        }
      } catch (err) {
        if (outputDisplay) {
          outputDisplay.innerHTML = `<span class="text-error font-bold">[EXECUTION ERROR]</span>\n${err.message}`;
        }
        toast.show(err.message, 'error');
      }
    };
  }

  rebindGridButtons();
}
