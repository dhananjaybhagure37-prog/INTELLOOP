/* ==========================================================================
   INTELLOOP — RESEARCH HISTORY VIEW (SQLITE BACKEND INTEGRATION)
   ========================================================================== */

import { ApiClient } from '../api/client.js';
import { formatStatusBadge, formatDuration, formatDate } from '../utils/formatters.js';

export function renderHistoryView() {
  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">history</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Audit Database</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Research & Mission History</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Persistent database records stored in SQLite (intelloop.db)</p>
        </div>

        <div class="flex items-center gap-2">
          <input type="text" id="history-search-input" placeholder="Filter investigations..." 
                 class="form-input text-xs w-64 bg-surface-lowest" />
        </div>
      </div>

      <!-- Table Container -->
      <div class="rounded-2xl bg-surface-container/90 border border-white/5 shadow-xl overflow-hidden">
        <div class="overflow-x-auto hide-scrollbar">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="border-b border-white/10 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider bg-surface-container-highest/30">
                <th class="py-3.5 px-5">Investigation ID & Objective</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Domain</th>
                <th class="py-3.5 px-4">Confidence</th>
                <th class="py-3.5 px-4">Latency</th>
                <th class="py-3.5 px-4">Date</th>
                <th class="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="history-table-body" class="divide-y divide-white/5">
              <tr>
                <td colspan="7" class="p-8 text-center text-on-surface-variant">
                  <span class="material-symbols-outlined text-2xl text-primary animate-spin mb-1">autorenew</span>
                  <p>Loading records from SQLite database...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function bindHistoryEvents() {
  const tbody = document.getElementById('history-table-body');
  const searchInput = document.getElementById('history-search-input');

  ApiClient.listInvestigations().then(invs => {
    if (!tbody) return;
    if (invs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="p-8 text-center text-on-surface-variant">
            No research investigations recorded in database yet.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = invs.map(m => {
      const badge = formatStatusBadge(m.status);
      return `
        <tr class="hover:bg-white/5 transition-colors group">
          <td class="py-4 px-5">
            <span class="font-mono text-primary font-bold text-xs">${m.id}</span>
            <p class="font-medium text-on-surface mt-0.5 max-w-lg truncate text-xs">${m.question}</p>
          </td>
          <td class="py-4 px-4 whitespace-nowrap">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}">
              ${badge.label}
            </span>
          </td>
          <td class="py-4 px-4 text-on-surface-variant font-mono text-[11px]">${m.domain || 'General'}</td>
          <td class="py-4 px-4 font-mono text-emerald-400 font-bold">${m.confidence_level || 'HIGH'}</td>
          <td class="py-4 px-4 font-mono text-on-surface-variant">${formatDuration(m.execution_time_ms)}</td>
          <td class="py-4 px-4 font-mono text-on-surface-variant text-[11px]">${formatDate(m.created_at)}</td>
          <td class="py-4 px-5 text-right whitespace-nowrap">
            ${m.status === 'COMPLETED' ? `
              <a href="#result?id=${m.id}" class="px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-semibold">
                View Report
              </a>
            ` : `
              <a href="#execution?id=${m.id}" class="px-3 py-1 rounded bg-primary/15 text-primary hover:bg-primary/25 text-xs font-semibold">
                Inspect
              </a>
            `}
          </td>
        </tr>
      `;
    }).join('');
  });

  if (searchInput && tbody) {
    searchInput.oninput = (e) => {
      const q = e.target.value.toLowerCase();
      const rows = tbody.querySelectorAll('tr');
      rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
      });
    };
  }
}
