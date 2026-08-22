/* ==========================================================================
   INTELLOOP — GLOBAL SEARCH COMMAND PALETTE (Ctrl+K)
   ========================================================================== */

import { store } from '../state/store.js';

export function renderGlobalSearchModal() {
  return `
    <div id="global-search-modal" class="modal-backdrop">
      <div class="modal-dialog w-full max-w-xl bg-surface-container/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <!-- Search Input Bar -->
        <div class="p-4 border-b border-white/5 flex items-center gap-3 bg-surface-container-high/50">
          <span class="material-symbols-outlined text-primary text-[22px]">search</span>
          <input type="text" id="global-search-input" 
                 class="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/50 text-sm focus:outline-none" 
                 placeholder="Search missions, agents, tools, knowledge documents, activity logs..." />
          <kbd class="px-2 py-0.5 text-[10px] font-mono bg-surface-lowest text-on-surface-variant rounded border border-white/10">ESC</kbd>
        </div>

        <!-- Search Results List -->
        <div id="global-search-results" class="max-h-96 overflow-y-auto p-3 space-y-1">
          <!-- Initial Quick Navigation -->
          <div class="px-3 py-2 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Quick Actions</div>
          <a href="#new-mission" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
            <span class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-[18px]">add_task</span>
              <span>Deploy New Agent Mission</span>
            </span>
            <span class="text-[10px] text-on-surface-variant">Action</span>
          </a>
          <a href="#active-agents" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
            <span class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-secondary text-[18px]">smart_toy</span>
              <span>Manage Autonomous Agent Roster</span>
            </span>
            <span class="text-[10px] text-on-surface-variant">View</span>
          </a>
          <a href="#tool-library" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
            <span class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-tertiary text-[18px]">construction</span>
              <span>Open Tool Registry & Sandbox</span>
            </span>
            <span class="text-[10px] text-on-surface-variant">View</span>
          </a>
        </div>
      </div>
    </div>
  `;
}

export function bindGlobalSearchEvents() {
  const modal = document.getElementById('global-search-modal');
  const input = document.getElementById('global-search-input');
  const resultsContainer = document.getElementById('global-search-results');

  const closeModal = () => {
    if (modal) modal.classList.remove('open');
  };

  const openModal = () => {
    if (modal) {
      modal.classList.add('open');
      if (input) {
        input.value = '';
        input.focus();
        renderResults('');
      }
    }
  };

  // Trigger button
  const triggerBtn = document.getElementById('global-search-btn');
  if (triggerBtn) triggerBtn.onclick = openModal;

  // Keyboard shortcut Ctrl+K / Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal && modal.classList.contains('open')) {
        closeModal();
      } else {
        openModal();
      }
    }
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal backdrop click
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  // Filter dynamic results
  function renderResults(q) {
    if (!resultsContainer) return;
    const query = (q || '').trim().toLowerCase();
    const state = store.getState();

    if (!query) {
      // Default quick actions
      resultsContainer.innerHTML = `
        <div class="px-3 py-2 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">Quick Actions</div>
        <a href="#new-mission" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-primary text-[18px]">add_task</span>
            <span>Deploy New Agent Mission</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">Action</span>
        </a>
        <a href="#active-agents" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[18px]">smart_toy</span>
            <span>Manage Autonomous Agent Roster</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">View</span>
        </a>
        <a href="#tool-library" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-tertiary text-[18px]">construction</span>
            <span>Open Tool Registry & Sandbox</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">View</span>
        </a>
        <a href="#knowledge-base" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface group">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-primary-fixed text-[18px]">menu_book</span>
            <span>Search Knowledge Base Documents</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">View</span>
        </a>
      `;
      bindItemClicks();
      return;
    }

    const matchedMissions = state.missions.filter(m => m.title.toLowerCase().includes(query) || m.id.toLowerCase().includes(query));
    const matchedAgents = state.agents.filter(a => a.name.toLowerCase().includes(query) || a.role.toLowerCase().includes(query));
    const matchedTools = state.tools.filter(t => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query));
    const matchedDocs = state.knowledgeDocs.filter(d => d.title.toLowerCase().includes(query) || d.summary.toLowerCase().includes(query));

    let html = '';

    if (matchedMissions.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">Missions (${matchedMissions.length})</div>`;
      html += matchedMissions.map(m => `
        <a href="#execution?id=${m.id}" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface">
          <span class="flex items-center gap-2.5 truncate">
            <span class="material-symbols-outlined text-primary text-[16px]">model_training</span>
            <span class="font-mono text-primary text-[11px]">${m.id}</span>
            <span class="truncate">${m.title}</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-high">${m.status}</span>
        </a>
      `).join('');
    }

    if (matchedAgents.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-secondary uppercase tracking-wider mt-2">Agents (${matchedAgents.length})</div>`;
      html += matchedAgents.map(a => `
        <a href="#active-agents" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-secondary text-[16px]">smart_toy</span>
            <span class="font-semibold">${a.name}</span>
            <span class="text-on-surface-variant truncate text-[11px]">— ${a.role}</span>
          </span>
          <span class="text-[10px] text-primary">${a.successRate}</span>
        </a>
      `).join('');
    }

    if (matchedTools.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-tertiary uppercase tracking-wider mt-2">Tools (${matchedTools.length})</div>`;
      html += matchedTools.map(t => `
        <a href="#tool-library" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface">
          <span class="flex items-center gap-2.5">
            <span class="material-symbols-outlined text-tertiary text-[16px]">${t.icon || 'construction'}</span>
            <span class="font-semibold">${t.name}</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">${t.category}</span>
        </a>
      `).join('');
    }

    if (matchedDocs.length > 0) {
      html += `<div class="px-3 py-1.5 text-[11px] font-bold text-primary-fixed uppercase tracking-wider mt-2">Knowledge Base (${matchedDocs.length})</div>`;
      html += matchedDocs.map(d => `
        <a href="#knowledge-base" class="search-result-item flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-on-surface">
          <span class="flex items-center gap-2.5 truncate">
            <span class="material-symbols-outlined text-primary-fixed text-[16px]">description</span>
            <span class="truncate">${d.title}</span>
          </span>
          <span class="text-[10px] text-on-surface-variant">${d.size}</span>
        </a>
      `).join('');
    }

    if (!html) {
      html = `
        <div class="text-center py-8 text-on-surface-variant text-xs">
          <span class="material-symbols-outlined text-[32px] text-on-surface-variant/40 mb-2">search_off</span>
          <p>No results found for "${q}".</p>
        </div>
      `;
    }

    resultsContainer.innerHTML = html;
    bindItemClicks();
  }

  function bindItemClicks() {
    const items = resultsContainer?.querySelectorAll('.search-result-item');
    items?.forEach(item => {
      item.addEventListener('click', () => closeModal());
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });
  }
}
