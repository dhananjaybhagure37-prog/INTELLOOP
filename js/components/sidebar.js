/* ==========================================================================
   INTELLOOP — SIDEBAR NAVIGATION COMPONENT
   ========================================================================== */

import { store } from '../state/store.js';

export function renderSidebar(currentRoute = 'dashboard') {
  const state = store.getState();
  const onlineAgentsCount = state.agents.filter(a => a.status === 'active').length;
  const activeToolsCount = state.tools.filter(t => t.status === 'active').length;
  const researcherName = state.settings.researcherName || 'Researcher';

  const navItems = [
    { path: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: 'new-mission', icon: 'add_task', label: 'New Mission' },
    { path: 'active-agents', icon: 'smart_toy', label: 'Active Agents' },
    { path: 'research-history', icon: 'history', label: 'Research History' },
    { path: 'knowledge-base', icon: 'menu_book', label: 'Knowledge Base' },
    { path: 'tool-library', icon: 'construction', label: 'Tool Library' },
    { path: 'evaluations', icon: 'assignment_turned_in', label: 'Evaluations' },
    { path: 'analytics', icon: 'bar_chart', label: 'Analytics' },
    { path: 'activity-logs', icon: 'list_alt', label: 'Activity Logs' },
    { path: 'settings', icon: 'settings', label: 'Settings' }
  ];

  const linksHtml = navItems.map(item => {
    const isActive = currentRoute === item.path;
    const activeClasses = isActive
      ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_12px_rgba(77,142,255,0.3)]'
      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface';

    return `
      <a href="#${item.path}" data-path="${item.path}" 
         class="flex items-center px-4 py-2.5 rounded-lg transition-all group ${activeClasses}">
        <span class="material-symbols-outlined mr-3 text-[20px] transition-transform group-hover:scale-110">${item.icon}</span>
        <span class="font-label-md text-label-md">${item.label}</span>
        ${item.path === 'active-agents' ? `<span class="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-mono">${onlineAgentsCount}</span>` : ''}
      </a>
    `;
  }).join('');

  return `
    <aside id="app-sidebar" class="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[1px_0_0_0_rgba(255,255,255,0.05)] select-none">
      <!-- Brand Logo -->
      <div class="p-6 mb-1 flex items-center justify-between">
        <a href="#dashboard" class="flex items-center gap-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px] shadow-[0_0_15px_rgba(173,198,255,0.3)]">
            <div class="w-full h-full bg-surface-lowest rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-[20px] group-hover:rotate-45 transition-transform duration-300">all_inclusive</span>
            </div>
          </div>
          <div class="flex flex-col">
            <span class="font-headline-md text-[20px] font-bold tracking-tight text-on-surface flex items-center gap-1.5">
              INTELLOOP
              <span class="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.2 bg-primary/15 text-primary rounded border border-primary/20">AI</span>
            </span>
            <span class="text-[10px] font-mono text-on-surface-variant/70 tracking-wider">REASONING ENGINE</span>
          </div>
        </a>
        <button id="close-mobile-sidebar" class="lg:hidden text-on-surface-variant p-1 hover:text-on-surface">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 space-y-1 overflow-y-auto hide-scrollbar">
        ${linksHtml}
      </nav>

      <!-- System Telemetry Status Card -->
      <div class="mt-auto p-4 mx-4 mb-3 rounded-xl bg-surface-container-low/60 backdrop-blur-md border border-white/5 space-y-3">
        <div class="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
          <span class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 live-indicator"></span>
            System Core
          </span>
          <span class="text-primary font-mono text-[11px]">Operational</span>
        </div>
        <div class="space-y-1.5 pt-1 border-t border-white/5">
          <div class="flex justify-between text-label-sm font-label-sm opacity-80">
            <span class="text-on-surface-variant">Active Agents</span>
            <span class="text-on-surface font-mono">${onlineAgentsCount} / ${state.agents.length}</span>
          </div>
          <div class="flex justify-between text-label-sm font-label-sm opacity-80">
            <span class="text-on-surface-variant">Tools Online</span>
            <span class="text-on-surface font-mono">${activeToolsCount} / ${state.tools.length}</span>
          </div>
          <div class="flex justify-between text-label-sm font-label-sm opacity-80">
            <span class="text-on-surface-variant">Memory Vectors</span>
            <span class="material-symbols-outlined text-[14px] text-primary">check_circle</span>
          </div>
        </div>
      </div>

      <!-- User Profile Badge -->
      <div class="p-3.5 mx-4 mb-4 rounded-xl bg-surface-container-high/40 border border-white/5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="relative">
            <img alt="Profile" class="w-9 h-9 rounded-full object-cover ring-1 ring-primary/30" 
                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwkC56jEnwO_bMkMUinSdOqCJx9M175FxMB4Sh-Biboz4EyqngmWmWu38j8AqIdPZwruy9Sf6RwJsliBBsytRMeq8aK8PIpHNDySd7ZT0eKnwU4zIzq1HItOFG7UUO2LEX6I-NIVL_CL5TU7l0McnpEZvq2QMx_6AAx_bCOrJ_EAgjLjUZ0FyfKJ-HR5im1q3CUNM36EQBJbZvZ0hPElk9sCndry-iA8HMAOaddIXeevwH5UJxi8_Lig" />
            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-surface"></div>
          </div>
          <div class="flex flex-col">
            <span class="font-label-sm text-[11px] text-on-surface-variant">Active Session</span>
            <span class="font-label-md text-label-md text-on-surface font-semibold">${researcherName}</span>
          </div>
        </div>
        <a href="#settings" class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded hover:bg-white/5">
          <span class="material-symbols-outlined text-[18px]">tune</span>
        </a>
      </div>
    </aside>
  `;
}
