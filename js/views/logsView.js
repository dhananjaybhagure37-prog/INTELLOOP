/* ==========================================================================
   INTELLOOP — REASONING & ACTIVITY LOGS VIEW
   Audit trail of agent thought-stream, tool invocations, observations & events
   ========================================================================== */

import { store } from '../state/store.js';
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

        <button id="export-logs-csv-btn" class="px-4 py-2 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-primary">download</span>
          Export Audit Log (CSV)
        </button>
      </div>

      <!-- Filters Bar -->
      <div class="p-4 rounded-xl bg-surface-container-high/60 border border-white/5 flex flex-wrap items-center gap-3 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-on-surface-variant font-medium">Filter Type:</span>
          <select id="log-type-filter" class="form-input text-xs py-1.5 bg-surface-lowest">
            <option value="all">All Events</option>
            <option value="Observation">Observation</option>
            <option value="Tool Invocaton">Tool Invocations</option>
            <option value="Planning">Planning</option>
            <option value="Understanding">Understanding</option>
            <option value="Mission Completed">Mission Completed</option>
          </select>
        </div>

        <div class="flex-1 min-w-[200px]">
          <input type="text" id="log-search-filter" placeholder="Search event logs..." 
                 class="form-input text-xs w-full py-1.5 bg-surface-lowest" />
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
              ${logs.map(log => `
                <tr class="hover:bg-white/5 transition-colors group">
                  <td class="py-3 px-4 text-primary whitespace-nowrap">${log.timestamp}</td>
                  <td class="py-3 px-4 text-on-surface font-bold whitespace-nowrap">${log.missionId}</td>
                  <td class="py-3 px-4 text-secondary whitespace-nowrap">${log.agentName}</td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded bg-surface-lowest text-on-surface font-sans text-[10px] font-semibold">
                      ${log.type}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-tertiary whitespace-nowrap">${log.toolName || '—'}</td>
                  <td class="py-3 px-4 text-on-surface-variant font-sans text-xs max-w-md truncate">${log.summary}</td>
                  <td class="py-3 px-4 text-right text-on-surface-variant whitespace-nowrap">${log.durationMs ? `${log.durationMs}ms` : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindLogsEvents() {
  const exportBtn = document.getElementById('export-logs-csv-btn');
  const typeFilter = document.getElementById('log-type-filter');
  const searchFilter = document.getElementById('log-search-filter');
  const tbody = document.getElementById('activity-logs-tbody');

  if (exportBtn) {
    exportBtn.onclick = () => {
      exportLogsAsCsv(store.getState().activityLogs);
      toast.show('Audit logs exported to CSV.', 'info');
    };
  }

  const applyFilters = () => {
    if (!tbody) return;
    const typeVal = typeFilter ? typeFilter.value.toLowerCase() : 'all';
    const searchVal = searchFilter ? searchFilter.value.toLowerCase() : '';

    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      const matchType = typeVal === 'all' || text.includes(typeVal);
      const matchSearch = !searchVal || text.includes(searchVal);
      row.style.display = (matchType && matchSearch) ? '' : 'none';
    });
  };

  if (typeFilter) typeFilter.onchange = applyFilters;
  if (searchFilter) searchFilter.oninput = applyFilters;
}
