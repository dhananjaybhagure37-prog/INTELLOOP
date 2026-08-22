/* ==========================================================================
   INTELLOOP — TOAST NOTIFICATION MANAGER
   ========================================================================== */

export class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = 'toast-item';

    let icon = 'info';
    let iconColor = 'text-primary';
    if (type === 'success') {
      icon = 'check_circle';
      iconColor = 'text-emerald-400';
    } else if (type === 'error') {
      icon = 'error';
      iconColor = 'text-error';
    } else if (type === 'warning') {
      icon = 'warning';
      iconColor = 'text-amber-400';
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined ${iconColor} text-[20px] shrink-0 mt-0.5">${icon}</span>
      <div class="flex-1 text-sm font-label-md text-on-surface leading-snug">${message}</div>
      <button class="text-on-surface-variant hover:text-on-surface ml-2 shrink-0">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    this.container.appendChild(toast);
    // Trigger transition
    requestAnimationFrame(() => toast.classList.add('show'));

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  }

  dismiss(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }
}

export const toast = new ToastManager();
