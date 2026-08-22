/* ==========================================================================
   INTELLOOP — BACKEND REST & SSE STREAMING CLIENT
   ========================================================================== */

const API_BASE = window.location.origin.includes(':3000') || window.location.origin.includes(':8000')
  ? ''
  : 'http://localhost:3000';

export class ApiClient {
  static async createInvestigation(question, depth = 'Standard', domain = 'General Intelligence') {
    const res = await fetch(`${API_BASE}/api/investigations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, depth, domain })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to initialize investigation.');
    }
    return await res.json();
  }

  static async getInvestigation(id) {
    const res = await fetch(`${API_BASE}/api/investigations/${id}`);
    if (!res.ok) throw new Error(`Investigation ${id} not found.`);
    return await res.json();
  }

  static async listInvestigations() {
    try {
      const res = await fetch(`${API_BASE}/api/investigations`);
      if (res.ok) {
        const data = await res.json();
        return data.investigations || [];
      }
    } catch (e) {
      console.warn('Backend list fallback to local state:', e);
    }
    return [];
  }

  static async deleteInvestigation(id) {
    const res = await fetch(`${API_BASE}/api/investigations/${id}`, { method: 'DELETE' });
    return await res.json();
  }

  static subscribeToStream(id, onStep, onNodeChange, onComplete, onError) {
    const eventSource = new EventSource(`${API_BASE}/api/investigations/${id}/stream`);

    eventSource.addEventListener('step', (e) => {
      try {
        const step = JSON.parse(e.data);
        if (onStep) onStep(step);
      } catch (err) {
        console.error('SSE step parse error:', err);
      }
    });

    eventSource.addEventListener('node_change', (e) => {
      try {
        const nodeData = JSON.parse(e.data);
        if (onNodeChange) onNodeChange(nodeData);
      } catch (err) {
        console.error('SSE node parse error:', err);
      }
    });

    eventSource.addEventListener('complete', (e) => {
      try {
        const data = JSON.parse(e.data);
        if (onComplete) onComplete(data);
        eventSource.close();
      } catch (err) {
        console.error('SSE complete parse error:', err);
      }
    });

    eventSource.addEventListener('error', (e) => {
      console.warn('SSE stream notice:', e);
      if (onError) onError(e);
    });

    return () => eventSource.close();
  }

  static async testTool(toolId, params = {}) {
    const res = await fetch(`${API_BASE}/api/tools/${toolId}/test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params })
    });
    return await res.json();
  }

  static async getLogs() {
    const res = await fetch(`${API_BASE}/api/logs`);
    if (res.ok) {
      const data = await res.json();
      return data.logs || [];
    }
    return [];
  }

  static async uploadKnowledgeDoc(title, category = 'General') {
    const res = await fetch(`${API_BASE}/api/knowledge/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category })
    });
    return await res.json();
  }
}
