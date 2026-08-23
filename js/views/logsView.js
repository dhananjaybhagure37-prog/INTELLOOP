/* ==========================================================================
   INTELLOOP — REASONING & ACTIVITY LOGS VIEW
   Audit trail of agent thought-stream, tool invocations, observations & events
   Connected to real SQLite telemetry and end-to-end mission trace pipeline
   ========================================================================== */

import { store } from '../state/store.js';
import { ApiClient } from '../api/client.js';
import { exportLogsAsCsv } from '../utils/exportHelpers.js';
import { toast } from '../components/toast.js';

export function renderLogsView() {
  const state = store.getState();
  const logs = state.activityLogs || [];

  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">list_alt</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Audit Trail</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Autonomous Reasoning & Activity Log</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Real-time immutable telemetry trace of all agent thought-streams, tool states, and observations</p>
        </div>

        <div class="flex items-center gap-2.5">
          <button id="refresh-activity-logs-btn" class="px-3.5 py-2 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-[16px] text-primary">refresh</span>
            Refresh
          </button>
          <button id="export-logs-csv-btn" class="px-4 py-2 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors">
            <span class="material-symbols-outlined text-[16px] text-primary">download</span>
            Export Audit Log (CSV)
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="p-4 rounded-xl bg-surface-container-high/60 border border-white/5 flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-on-surface-variant font-medium">Filter Type:</span>
          <select id="log-type-filter" class="form-input text-xs py-1.5 bg-surface-lowest rounded-lg border border-white/10 text-on-surface">
            <option value="all">All Events</option>
            <option value="Mission">Mission Lifecycle (Init/Complete)</option>
            <option value="Planning">Planning & Understanding</option>
            <option value="Decision">Decision / Next Action</option>
            <option value="LLM">LLM / Groq API Calls</option>
            <option value="Tool">Tool Invocations & Results</option>
            <option value="Verification">Verification & Evaluation</option>
            <option value="Error">Errors & Anomalies</option>
            <option value="Recovery">Recoveries & Fallbacks</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <input type="text" id="log-search-filter" placeholder="Search event logs by mission ID, agent, tool, or summary..." 
                 class="form-input text-xs w-full py-1.5 px-3 bg-surface-lowest rounded-lg border border-white/10 text-on-surface focus:border-primary" />
        </div>

        <div class="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span id="log-count-display">${logs.length} Live Trace Events</span>
        </div>
      </div>

      <!-- Logs Stream Table -->
      <div class="rounded-2xl bg-surface-container/90 border border-white/5 shadow-xl overflow-hidden">
        <div class="overflow-x-auto hide-scrollbar">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-white/10 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider bg-surface-container-highest/30">
                <th class="py-3 px-4">Timestamp</th>
                <th class="py-3 px-4">Mission ID</th>
                <th class="py-3 px-4">Agent</th>
                <th class="py-3 px-4">Event Type</th>
                <th class="py-3 px-4">Tool</th>
                <th class="py-3 px-4">Execution Summary</th>
                <th class="py-3 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody id="activity-logs-tbody" class="divide-y divide-white/5 font-mono text-[11px]">
              ${renderLogRows(logs)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Full Mission Trace Lifecycle Modal (Hidden by Default) -->
      <div id="mission-trace-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden items-center justify-center p-4">
        <div class="bg-surface-container border border-white/10 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="p-5 border-b border-white/10 flex items-center justify-between bg-surface-container-highest/40">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[18px]">account_tree</span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-on-surface flex items-center gap-2" id="modal-mission-title">
                  Mission Lifecycle Trace
                </h3>
                <p class="text-[11px] text-on-surface-variant" id="modal-mission-subtitle">Chronological sequence of all agent reasoning, tool calls, and recoveries</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <a id="modal-open-observability-btn" href="#observability" class="px-3 py-1.5 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-semibold border border-primary/30 flex items-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[14px]">monitoring</span>
                Observability View
              </a>
              <button id="modal-close-btn" class="w-8 h-8 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <!-- Chronological Pipeline Flow Badge Bar -->
          <div class="px-5 py-3 bg-surface-lowest/60 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[10px] font-mono">
            <span class="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold">START</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">PLAN</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold">DECISION</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">TOOL CALL</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">FAIL/SUCCESS</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">DIAGNOSIS</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">RECOVERY</span>
            <span class="text-on-surface-variant">→</span>
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">COMPLETE</span>
          </div>

          <!-- Modal Body (Chronological Trace Events) -->
          <div class="p-5 overflow-y-auto space-y-3 flex-1 hide-scrollbar" id="modal-trace-events-mount">
            <div class="text-center p-8 text-on-surface-variant text-xs">
              <span class="material-symbols-outlined text-2xl text-primary animate-spin">autorenew</span>
              <p class="mt-2">Loading mission trace sequence...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderLogRows(logs) {
  if (!logs || logs.length === 0) {
    return `
      <tr>
        <td colspan="7" class="py-8 text-center text-on-surface-variant text-xs font-sans">
          No activity logs recorded yet. Start a research mission to observe live telemetry.
        </td>
      </tr>
    `;
  }

  return logs.map(log => {
    const missionId = log.missionId || log.investigation_id || 'SYSTEM';
    const type = log.type || 'Event';
    const agent = log.agentName || log.agent_name || 'Sentinel-Prime';
    const tool = log.toolName || log.tool_name || '—';
    const summary = log.summary || '';
    const duration = log.durationMs || log.duration_ms || 0;
    const timeDisplay = log.timestamp || '—';

    let typeColor = 'bg-surface-lowest text-on-surface border border-white/10';
    if (type.includes('LLM') || type.includes('Groq')) {
      typeColor = 'bg-secondary/15 text-secondary border border-secondary/30';
    } else if (type.includes('Tool') || type.includes('Observation')) {
      typeColor = 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    } else if (type.includes('Error') || type.includes('Fail')) {
      typeColor = 'bg-rose-500/15 text-rose-300 border border-rose-500/30';
    } else if (type.includes('Recovery') || type.includes('Optimization') || type.includes('Diagnosis')) {
      typeColor = 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    } else if (type.includes('Verification')) {
      typeColor = 'bg-teal-500/15 text-teal-300 border border-teal-500/30';
    } else if (type.includes('Plan') || type.includes('Decision') || type.includes('Understand')) {
      typeColor = 'bg-purple-500/15 text-purple-300 border border-purple-500/30';
    }

    return `
      <tr class="hover:bg-white/5 transition-colors group cursor-pointer log-row-item" data-mission-id="${missionId}">
        <td class="py-3 px-4 text-primary whitespace-nowrap">${timeDisplay}</td>
        <td class="py-3 px-4 font-bold whitespace-nowrap">
          <span class="px-2 py-0.5 rounded bg-surface-lowest text-primary hover:text-white border border-primary/20 hover:border-primary transition-all flex items-center gap-1 w-fit">
            <span class="material-symbols-outlined text-[12px]">visibility</span>
            ${missionId}
          </span>
        </td>
        <td class="py-3 px-4 text-secondary whitespace-nowrap">${agent}</td>
        <td class="py-3 px-4 whitespace-nowrap">
          <span class="px-2 py-0.5 rounded font-sans text-[10px] font-semibold ${typeColor}">
            ${type}
          </span>
        </td>
        <td class="py-3 px-4 text-tertiary whitespace-nowrap font-semibold">${tool}</td>
        <td class="py-3 px-4 text-on-surface-variant font-sans text-xs max-w-md truncate group-hover:text-on-surface transition-colors" title="${summary}">
          ${summary}
        </td>
        <td class="py-3 px-4 text-right text-on-surface-variant whitespace-nowrap font-mono">
          ${duration ? `${duration}ms` : '—'}
        </td>
      </tr>
    `;
  }).join('');
}

export function bindLogsEvents() {
  const exportBtn = document.getElementById('export-logs-csv-btn');
  const refreshBtn = document.getElementById('refresh-activity-logs-btn');
  const typeFilter = document.getElementById('log-type-filter');
  const searchFilter = document.getElementById('log-search-filter');
  const tbody = document.getElementById('activity-logs-tbody');
  const countDisplay = document.getElementById('log-count-display');
  const modal = document.getElementById('mission-trace-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // 1. Fetch live logs from SQLite database
  const loadFreshLogs = async () => {
    try {
      const logs = await ApiClient.getLogs();
      if (logs && logs.length > 0) {
        store.state.activityLogs = logs;
        if (tbody) tbody.innerHTML = renderLogRows(logs);
        if (countDisplay) countDisplay.innerText = `${logs.length} Live Trace Events`;
        bindRowClicks();
      }
    } catch (err) {
      console.warn('Error loading fresh activity logs:', err);
    }
  };

  // 2. Row Click / Modal Handler
  const bindRowClicks = () => {
    const rows = document.querySelectorAll('.log-row-item');
    rows.forEach(r => {
      r.onclick = () => {
        const mId = r.dataset.missionId;
        if (mId && mId !== 'SYSTEM') {
          openMissionTraceModal(mId);
        }
      };
    });
  };

  // 3. Open Full Trace Modal for a specific Mission ID
  const openMissionTraceModal = async (missionId) => {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    const titleEl = document.getElementById('modal-mission-title');
    const mountEl = document.getElementById('modal-trace-events-mount');
    const obsBtn = document.getElementById('modal-open-observability-btn');

    if (titleEl) titleEl.innerText = `Mission Lifecycle Trace: ${missionId}`;
    if (obsBtn) obsBtn.href = `#observability`;

    if (mountEl) {
      mountEl.innerHTML = `
        <div class="text-center p-8 text-on-surface-variant text-xs">
          <span class="material-symbols-outlined text-2xl text-primary animate-spin">autorenew</span>
          <p class="mt-2">Aggregating telemetry spans for ${missionId}...</p>
        </div>
      `;

      try {
        const traces = await ApiClient.getMissionTraces(missionId);
        if (!traces || traces.length === 0) {
          mountEl.innerHTML = `<div class="p-8 text-center text-on-surface-variant text-xs font-sans">No detailed spans captured for ${missionId} yet.</div>`;
          return;
        }

        mountEl.innerHTML = traces.map((t, idx) => {
          let badgeColor = 'bg-primary/20 text-primary border-primary/30';
          let icon = 'bolt';
          if (t.event_type.includes('LLM') || t.event_type.includes('Groq')) {
            badgeColor = 'bg-secondary/20 text-secondary border-secondary/30';
            icon = 'smart_toy';
          } else if (t.event_type.includes('Tool')) {
            badgeColor = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            icon = 'terminal';
          } else if (t.event_type.includes('Error') || t.status === 'FAILED') {
            badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
            icon = 'warning';
          } else if (t.event_type.includes('Recovery') || t.event_type.includes('Optimization') || t.event_type.includes('Diagnosis')) {
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            icon = 'auto_fix_high';
          } else if (t.event_type.includes('Verification')) {
            badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
            icon = 'verified';
          }

          const metaStr = typeof t.metadata === 'object' ? JSON.stringify(t.metadata, null, 2) : String(t.metadata || '{}');

          return `
            <div class="p-3.5 rounded-xl bg-surface-lowest/90 border border-white/5 flex flex-col gap-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-5 h-5 rounded bg-surface-container flex items-center justify-center text-[11px] text-on-surface font-mono">
                    ${idx + 1}
                  </span>
                  <span class="font-mono text-xs font-bold text-on-surface">${t.event_type}</span>
                  <span class="px-2 py-0.2 rounded border text-[10px] font-mono ${badgeColor}">${t.stage}</span>
                </div>
                <div class="flex items-center gap-2 font-mono text-[11px]">
                  <span class="text-primary font-bold">${t.latency_ms || 0}ms</span>
                  <span class="text-on-surface-variant">${(t.timestamp || '').substring(11, 19)}</span>
                </div>
              </div>

              <details class="text-[11px] font-mono text-on-surface-variant">
                <summary class="cursor-pointer text-[10px] text-primary hover:underline select-none">
                  Inspect Metadata & Payload
                </summary>
                <pre class="mt-2 p-2.5 rounded bg-[#050914] text-[10px] text-on-surface-variant font-mono border border-white/5 overflow-x-auto"><code>${metaStr}</code></pre>
              </details>
            </div>
          `;
        }).join('');
      } catch (e) {
        mountEl.innerHTML = `<div class="p-8 text-center text-rose-400 text-xs font-sans">Error loading trace: ${e.message}</div>`;
      }
    }
  };

  if (modalCloseBtn && modal) {
    modalCloseBtn.onclick = () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    };
  }

  if (exportBtn) {
    exportBtn.onclick = () => {
      exportLogsAsCsv(store.getState().activityLogs);
      toast.show('Audit logs exported to CSV.', 'info');
    };
  }

  if (refreshBtn) {
    refreshBtn.onclick = () => {
      toast.show('Refreshing activity logs from SQLite...', 'info');
      loadFreshLogs();
    };
  }

  const applyFilters = () => {
    if (!tbody) return;
    const typeVal = typeFilter ? typeFilter.value.toLowerCase() : 'all';
    const searchVal = searchFilter ? searchFilter.value.toLowerCase() : '';

    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      let matchType = true;
      if (typeVal !== 'all') {
        if (typeVal === 'mission') matchType = text.includes('mission initialization') || text.includes('mission completed');
        else if (typeVal === 'planning') matchType = text.includes('planning') || text.includes('understanding');
        else if (typeVal === 'decision') matchType = text.includes('decision');
        else if (typeVal === 'llm') matchType = text.includes('llm') || text.includes('groq');
        else if (typeVal === 'tool') matchType = text.includes('tool');
        else if (typeVal === 'verification') matchType = text.includes('verification') || text.includes('eval');
        else if (typeVal === 'error') matchType = text.includes('error') || text.includes('fail');
        else if (typeVal === 'recovery') matchType = text.includes('recovery') || text.includes('fallback') || text.includes('optimiz') || text.includes('diagnosis');
        else matchType = text.includes(typeVal);
      }
      const matchSearch = !searchVal || text.includes(searchVal);
      if (matchType && matchSearch) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (countDisplay) countDisplay.innerText = `${visibleCount} Filtered Events`;
  };

  if (typeFilter) typeFilter.onchange = applyFilters;
  if (searchFilter) searchFilter.oninput = applyFilters;

  // Initialize data load
  loadFreshLogs();
}
