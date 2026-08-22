/* ==========================================================================
   INTELLOOP — NOTIFICATION CENTER DRAWER
   ========================================================================== */

import { store } from '../state/store.js';

export function renderNotificationDrawer() {
  const state = store.getState();
  const notifs = state.notifications || [];
  const unreadCount = notifs.filter(n => !n.read).length;

  return `
    <div id="notification-drawer" class="fixed top-16 right-6 w-96 max-w-[90vw] bg-surface-container-high/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden transform scale-95 opacity-0 pointer-events-none transition-all duration-200">
      <!-- Header -->
      <div class="p-4 border-b border-white/5 flex items-center justify-between bg-surface-container-highest/40">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">notifications</span>
          <span class="font-headline-md text-sm font-semibold text-on-surface">Intelligence Alerts</span>
          ${unreadCount > 0 ? `<span class="px-1.5 py-0.2 rounded-full bg-error text-[10px] font-bold text-white">${unreadCount}</span>` : ''}
        </div>
        <button id="mark-all-read-btn" class="text-[11px] text-primary hover:underline">Mark all read</button>
      </div>

      <!-- Notifications List -->
      <div class="max-h-96 overflow-y-auto divide-y divide-white/5 hide-scrollbar">
        ${notifs.length === 0 ? `
          <div class="p-6 text-center text-xs text-on-surface-variant">
            <span class="material-symbols-outlined text-24px mb-1 opacity-40">notifications_paused</span>
            <p>No new notifications</p>
          </div>
        ` : notifs.map(n => {
          let icon = 'info';
          let iconColor = 'text-primary';
          if (n.type === 'success') { icon = 'check_circle'; iconColor = 'text-emerald-400'; }
          else if (n.type === 'error' || n.type === 'warning') { icon = 'warning'; iconColor = 'text-amber-400'; }

          return `
            <div class="p-3.5 hover:bg-white/5 transition-colors flex items-start gap-3 ${!n.read ? 'bg-primary/5' : ''}" data-notif-id="${n.id}">
              <span class="material-symbols-outlined ${iconColor} text-[18px] shrink-0 mt-0.5">${icon}</span>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class="font-label-sm text-xs font-semibold text-on-surface">${n.title}</span>
                  <span class="text-[10px] text-on-surface-variant font-mono">${n.timestamp}</span>
                </div>
                <p class="text-[11px] text-on-surface-variant mt-0.5 leading-snug">${n.message}</p>
                ${n.missionId ? `
                  <a href="#execution?id=${n.missionId}" class="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-1 font-mono">
                    View Mission ${n.missionId} <span class="material-symbols-outlined text-[10px]">arrow_forward</span>
                  </a>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindNotificationEvents() {
  const trigger = document.getElementById('notifications-trigger');
  const drawer = document.getElementById('notification-drawer');
  const markAllBtn = document.getElementById('mark-all-read-btn');

  const toggle = () => {
    if (!drawer) return;
    const isOpen = drawer.classList.contains('opacity-100');
    if (isOpen) {
      drawer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
      drawer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    } else {
      drawer.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      drawer.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    }
  };

  if (trigger) trigger.onclick = (e) => {
    e.stopPropagation();
    toggle();
  };

  if (markAllBtn) markAllBtn.onclick = () => {
    store.markAllNotificationsRead();
  };

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer && !drawer.contains(e.target) && trigger && !trigger.contains(e.target)) {
      drawer.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
      drawer.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
    }
  });
}
