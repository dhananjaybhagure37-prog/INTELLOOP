/* ==========================================================================
   INTELLOOP — REACTIVE STATE STORE & PERSISTENCE LAYER
   ========================================================================== */

import {
  INITIAL_AGENTS,
  INITIAL_MISSIONS,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from './initialData.js';
import { INITIAL_TOOLS } from '../tools/toolRegistry.js';
import { generateId } from '../utils/formatters.js';

const STORAGE_KEY = 'intelloop_state_v2';

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          agents: (parsed.agents && parsed.agents.length > 0) ? parsed.agents : JSON.parse(JSON.stringify(INITIAL_AGENTS)),
          missions: parsed.missions || INITIAL_MISSIONS,
          tools: (parsed.tools && parsed.tools.length > 0) ? parsed.tools : INITIAL_TOOLS,
          activityLogs: parsed.activityLogs || INITIAL_ACTIVITY_LOGS,
          knowledgeDocs: parsed.knowledgeDocs || INITIAL_KNOWLEDGE_DOCS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          settings: parsed.settings || INITIAL_SETTINGS,
          currentRoute: 'dashboard',
          selectedMissionId: null,
          searchQuery: ''
        };
      }
    } catch (e) {
      console.warn('Could not load stored state, fallback to initial:', e);
    }

    return {
      agents: JSON.parse(JSON.stringify(INITIAL_AGENTS)),
      missions: JSON.parse(JSON.stringify(INITIAL_MISSIONS)),
      tools: JSON.parse(JSON.stringify(INITIAL_TOOLS)),
      activityLogs: JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS)),
      knowledgeDocs: JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCS)),
      notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
      settings: JSON.parse(JSON.stringify(INITIAL_SETTINGS)),
      currentRoute: 'dashboard',
      selectedMissionId: null,
      searchQuery: ''
    };
  }

  saveState() {
    try {
      const persistable = {
        agents: this.state.agents,
        missions: this.state.missions,
        tools: this.state.tools,
        activityLogs: this.state.activityLogs,
        knowledgeDocs: this.state.knowledgeDocs,
        notifications: this.state.notifications,
        settings: this.state.settings
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, payload) {
    this.saveState();
    this.listeners.forEach(fn => fn(this.state, event, payload));
  }

  getState() {
    return this.state;
  }

  // --- Navigation & Route Actions ---
  setRoute(route, missionId = null) {
    this.state.currentRoute = route;
    if (missionId) {
      this.state.selectedMissionId = missionId;
    }
    this.notify('ROUTE_CHANGED', { route, missionId });
  }

  setSelectedMission(missionId) {
    this.state.selectedMissionId = missionId;
    this.notify('MISSION_SELECTED', missionId);
  }

  setSearchQuery(q) {
    this.state.searchQuery = q;
    this.notify('SEARCH_CHANGED', q);
  }

  // --- Mission Actions ---
  getMission(id) {
    return this.state.missions.find(m => m.id === id);
  }

  getActiveMission() {
    return this.state.missions.find(m => m.status === 'Running' || m.status === 'Planning' || m.status === 'Reasoning' || m.status === 'Using Tool') 
      || this.state.missions[0];
  }

  createMission(missionData) {
    const id = missionData.id || generateId('NX');
    const newMission = {
      id,
      title: missionData.title || 'Untitled Mission',
      domain: missionData.domain || 'AI Intelligence',
      priority: missionData.priority || 'Medium',
      agentId: missionData.agentId || 'agent-sentinel',
      agentName: missionData.agentName || 'Sentinel-Prime',
      status: 'Planning',
      progress: 5,
      currentStepIndex: 0,
      currentStepTitle: 'Initializing Mission Context',
      currentReasoningSummary: 'Allocating working memory and formulating execution plan.',
      activeToolName: null,
      activeToolId: null,
      startedAt: new Date().toISOString(),
      executionTimeMs: 0,
      toolsUsed: [],
      steps: [],
      finalResult: null,
      customScenario: missionData.customScenario || null
    };

    this.state.missions.unshift(newMission);
    this.state.selectedMissionId = id;

    // Update agent state
    const agent = this.state.agents.find(a => a.id === newMission.agentId);
    if (agent) {
      agent.state = 'Working';
      agent.currentMissionId = id;
    }

    // Add activity log
    this.addLog({
      missionId: id,
      agentName: newMission.agentName,
      type: 'Initialization',
      toolName: null,
      summary: `Mission ${id} launched: "${newMission.title}"`,
      durationMs: 0
    });

    // Add notification
    this.addNotification({
      title: 'New Mission Launched',
      message: `Mission ${id} started under ${newMission.agentName}`,
      type: 'info',
      missionId: id
    });

    this.notify('MISSION_CREATED', newMission);
    return newMission;
  }

  updateMission(id, updates) {
    const idx = this.state.missions.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.state.missions[idx] = { ...this.state.missions[idx], ...updates };
      this.notify('MISSION_UPDATED', this.state.missions[idx]);
      return this.state.missions[idx];
    }
    return null;
  }

  addMissionStep(id, step) {
    const mission = this.getMission(id);
    if (mission) {
      if (!mission.steps) mission.steps = [];
      const stepWithId = { id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...step };
      mission.steps.push(stepWithId);
      this.notify('STEP_ADDED', { missionId: id, step: stepWithId });
      return stepWithId;
    }
    return null;
  }

  completeMission(id, finalResult, stats = {}) {
    const mission = this.getMission(id);
    if (mission) {
      mission.status = 'Completed';
      mission.progress = 100;
      mission.currentStepTitle = 'Mission Completed';
      mission.currentReasoningSummary = 'Execution graph completed. Final intelligence briefing delivered.';
      mission.activeToolName = null;
      mission.activeToolId = null;
      mission.completedAt = new Date().toISOString();
      mission.finalResult = finalResult;
      if (stats.executionTimeMs) mission.executionTimeMs = stats.executionTimeMs;

      // Update agent
      const agent = this.state.agents.find(a => a.id === mission.agentId);
      if (agent) {
        agent.state = 'Idle';
        agent.currentMissionId = null;
        agent.tasksCompleted += 1;
      }

      this.addLog({
        missionId: id,
        agentName: mission.agentName,
        type: 'Mission Completed',
        toolName: null,
        summary: `Mission ${id} successfully delivered intelligence briefing.`,
        durationMs: mission.executionTimeMs
      });

      this.addNotification({
        title: 'Mission Completed',
        message: `Intelligence briefing generated for Mission ${id}`,
        type: 'success',
        missionId: id
      });

      this.notify('MISSION_COMPLETED', mission);
      return mission;
    }
    return null;
  }

  failMission(id, errorMessage) {
    const mission = this.getMission(id);
    if (mission) {
      mission.status = 'Failed';
      mission.currentStepTitle = 'Execution Terminated';
      mission.currentReasoningSummary = `Error encountered: ${errorMessage}`;
      mission.activeToolName = null;

      const agent = this.state.agents.find(a => a.id === mission.agentId);
      if (agent) {
        agent.state = 'Error';
      }

      this.addLog({
        missionId: id,
        agentName: mission.agentName,
        type: 'Error',
        toolName: mission.activeToolName,
        summary: `Mission ${id} failed: ${errorMessage}`,
        durationMs: 0
      });

      this.addNotification({
        title: 'Mission Alert',
        message: `Mission ${id} terminated with error: ${errorMessage}`,
        type: 'error',
        missionId: id
      });

      this.notify('MISSION_FAILED', { mission, error: errorMessage });
    }
  }

  // --- Agent Actions ---
  toggleAgentStatus(id) {
    const agent = this.state.agents.find(a => a.id === id);
    if (agent) {
      agent.status = agent.status === 'active' ? 'inactive' : 'active';
      this.notify('AGENT_UPDATED', agent);
      return agent;
    }
    return null;
  }

  // --- Tool Actions ---
  toggleToolStatus(id) {
    const tool = this.state.tools.find(t => t.id === id);
    if (tool) {
      tool.status = tool.status === 'active' ? 'disabled' : 'active';
      this.notify('TOOL_UPDATED', tool);
      return tool;
    }
    return null;
  }

  incrementToolUsage(id) {
    const tool = this.state.tools.find(t => t.id === id);
    if (tool) {
      tool.totalUses = (tool.totalUses || 0) + 1;
      tool.lastUsed = 'Just now';
      this.notify('TOOL_UPDATED', tool);
    }
  }

  // --- Logs & Notifications ---
  addLog(logData) {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      missionId: logData.missionId || 'SYSTEM',
      agentName: logData.agentName || 'Core Orchestrator',
      type: logData.type || 'Event',
      toolName: logData.toolName || null,
      summary: logData.summary || '',
      durationMs: logData.durationMs || 0
    };
    this.state.activityLogs.unshift(newLog);
    // Limit to 200 logs
    if (this.state.activityLogs.length > 200) {
      this.state.activityLogs.pop();
    }
    this.notify('LOG_ADDED', newLog);
  }

  addNotification(notif) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notif.title || 'System Notification',
      message: notif.message || '',
      type: notif.type || 'info',
      timestamp: 'Just now',
      read: false,
      missionId: notif.missionId || null
    };
    this.state.notifications.unshift(newNotif);
    this.notify('NOTIFICATION_ADDED', newNotif);
  }

  markNotificationRead(id) {
    const n = this.state.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.notify('NOTIFICATION_UPDATED', n);
    }
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(n => (n.read = true));
    this.notify('NOTIFICATIONS_CLEARED');
  }

  // --- Knowledge Base ---
  addKnowledgeDoc(docData) {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: docData.title || 'Uploaded Document.pdf',
      category: docData.category || 'General Knowledge',
      size: docData.size || '1.2 MB',
      pages: docData.pages || 12,
      chunks: docData.chunks || 48,
      uploadedAt: new Date().toISOString().split('T')[0],
      tags: docData.tags || ['Custom Upload', 'Verified'],
      summary: docData.summary || 'Custom enterprise intelligence document indexed for vector search.',
      sampleChunks: docData.sampleChunks || [
        'Chunk #1: Indexed vector embeddings loaded into real-time memory context.',
        'Chunk #2: Key entities cross-linked with active agent reasoning pipeline.'
      ]
    };
    this.state.knowledgeDocs.unshift(newDoc);
    this.addNotification({
      title: 'Document Indexed',
      message: `"${newDoc.title}" successfully converted to vector embeddings.`,
      type: 'success'
    });
    this.notify('DOC_ADDED', newDoc);
    return newDoc;
  }

  // --- Settings ---
  updateSettings(updates) {
    this.state.settings = { ...this.state.settings, ...updates };
    this.notify('SETTINGS_UPDATED', this.state.settings);
  }

  resetToDemoData() {
    localStorage.removeItem(STORAGE_KEY);
    this.state.agents = JSON.parse(JSON.stringify(INITIAL_AGENTS));
    this.state.missions = JSON.parse(JSON.stringify(INITIAL_MISSIONS));
    this.state.tools = JSON.parse(JSON.stringify(INITIAL_TOOLS));
    this.state.activityLogs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
    this.state.knowledgeDocs = JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCS));
    this.state.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.state.settings = JSON.parse(JSON.stringify(INITIAL_SETTINGS));
    this.state.currentRoute = 'dashboard';
    this.state.selectedMissionId = 'NX-8842-OMEGA';
    this.saveState();
    this.notify('STATE_RESET');
  }
}

export const store = new Store();
