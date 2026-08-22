/* ==========================================================================
   INTELLOOP — FORMATTERS & HELPERS
   ========================================================================== */

export function formatTimestamp(isoOrDate = new Date()) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatDate(isoOrDate = new Date()) {
  const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDuration(ms) {
  if (ms == null) return '0.0s';
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = (seconds % 60).toFixed(0);
  return `${minutes}m ${remainingSecs}s`;
}

export function formatStatusBadge(status) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'running':
    case 'active':
    case 'in_progress':
      return {
        label: 'Running',
        bg: 'bg-primary/15',
        text: 'text-primary',
        dot: 'bg-primary',
        ping: true
      };
    case 'planning':
      return {
        label: 'Planning',
        bg: 'bg-secondary/15',
        text: 'text-secondary',
        dot: 'bg-secondary',
        ping: true
      };
    case 'reasoning':
      return {
        label: 'Reasoning',
        bg: 'bg-tertiary/15',
        text: 'text-tertiary',
        dot: 'bg-tertiary',
        ping: true
      };
    case 'using tool':
    case 'tool_active':
      return {
        label: 'Using Tool',
        bg: 'bg-primary-container/20',
        text: 'text-primary',
        dot: 'bg-primary-container',
        ping: true
      };
    case 'completed':
    case 'success':
      return {
        label: 'Completed',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        dot: 'bg-emerald-400',
        ping: false
      };
    case 'failed':
    case 'error':
      return {
        label: 'Failed',
        bg: 'bg-error/20',
        text: 'text-error',
        dot: 'bg-error',
        ping: false
      };
    case 'paused':
      return {
        label: 'Paused',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        dot: 'bg-amber-400',
        ping: false
      };
    default:
      return {
        label: status || 'Idle',
        bg: 'bg-surface-container-high',
        text: 'text-on-surface-variant',
        dot: 'bg-outline-variant',
        ping: false
      };
  }
}

export function generateId(prefix = 'NX') {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${randNum}-${suffix}`;
}

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
