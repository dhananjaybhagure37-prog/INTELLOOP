/* ==========================================================================
   INTELLOOP — HEADER COMPONENT
   ========================================================================== */

import { store } from '../state/store.js';

export function renderHeader() {
  const state = store.getState();
  const activeMission = state.missions.find(m => m.status === 'Running' || m.status === 'Planning' || m.status === 'Using Tool');
  const unreadNotifs = state.notifications.filter(n => !n.read).length;

  return `
    <header class="sticky top-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-6 lg:px-8 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] select-none">
      <!-- Left side: Mobile toggle & Processing Status -->
      <div class="flex items-center gap-4">
        <button id="open-mobile-sidebar" class="lg:hidden text-on-surface-variant p-1.5 rounded-lg hover:bg-white/5">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="flex items-center gap-2.5 bg-surface-container-high/60 px-3 py-1.5 rounded-full border border-white/5">
          <div class="w-2 h-2 rounded-full ${activeMission ? 'bg-primary animate-ping' : 'bg-emerald-400'}"></div>
          <span class="font-label-sm text-[11px] font-bold ${activeMission ? 'text-primary' : 'text-emerald-400'} tracking-wider uppercase">
            ${activeMission ? `Executing: ${activeMission.id}` : 'System Standby — Ready'}
          </span>
        </div>

        ${activeMission ? `
          <a href="#execution?id=${activeMission.id}" class="hidden md:flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors truncate max-w-sm">
            <span class="material-symbols-outlined text-[14px] text-primary">play_circle</span>
            <span class="truncate">"${activeMission.title}"</span>
          </a>
        ` : ''}
      </div>

      <!-- Right side: Global Search, Notification Center, Deploy Button -->
      <div class="flex items-center gap-4 lg:gap-6">
        <!-- Global Search Trigger -->
        <button id="global-search-btn" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-white/5 text-xs transition-all">
          <span class="material-symbols-outlined text-[16px] text-primary">search</span>
          <span class="hidden sm:inline">Search intelligence...</span>
          <kbd class="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-surface-lowest rounded text-on-surface-variant/70 border border-white/10">Ctrl+K</kbd>
        </button>

        <!-- Notification Trigger -->
        <button id="notifications-trigger" class="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-white/5 relative transition-colors" title="Notifications">
          <span class="material-symbols-outlined text-[22px]">notifications</span>
          ${unreadNotifs > 0 ? `
            <span class="absolute top-1 right-1 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-pulse"></span>
          ` : ''}
        </button>

        <!-- Quick Deploy Agent Trigger -->
        <button id="deploy-agent-modal-btn" class="bg-gradient-to-r from-primary-container to-secondary-container hover:opacity-95 text-white px-4 py-1.5 rounded-lg font-label-md text-xs font-semibold shadow-[0_0_15px_rgba(77,142,255,0.35)] hover:shadow-[0_0_22px_rgba(77,142,255,0.5)] transition-all flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">rocket_launch</span>
          <span>Deploy Agent</span>
        </button>
      </div>
    </header>
  `;
}
