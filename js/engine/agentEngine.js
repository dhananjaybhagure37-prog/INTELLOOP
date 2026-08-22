/* ==========================================================================
   INTELLOOP — AUTONOMOUS AGENTIC REASONING ENGINE
   Multi-step iterative execution engine with tool dispatch & self-evaluation
   ========================================================================== */

import { store } from '../state/store.js';
import { PROMPT_SCENARIOS } from './promptScenarios.js';
import { synthesizeDynamicPlan } from './dynamicSynthesizer.js';
import { ToolRegistry } from '../tools/toolRegistry.js';

export class AgentEngine {
  constructor() {
    this.toolRegistry = new ToolRegistry(store.getState().tools);
    this.activeExecution = null;
    this.isPaused = false;
    this.stepResolver = null;
  }

  findMatchingScenario(title) {
    const lower = (title || '').toLowerCase();
    return PROMPT_SCENARIOS.find(s => {
      const sLower = s.title.toLowerCase();
      return lower.includes(sLower) || sLower.includes(lower) ||
        (lower.includes('predictive') && sLower.includes('predictive')) ||
        (lower.includes('battery') && sLower.includes('battery')) ||
        (lower.includes('quantum') && sLower.includes('quantum'));
    });
  }

  async runMission(missionId) {
    const mission = store.getMission(missionId);
    if (!mission) {
      console.error(`Mission ${missionId} not found.`);
      return;
    }

    if (this.activeExecution && this.activeExecution.missionId === missionId) {
      console.warn(`Mission ${missionId} is already executing.`);
      return;
    }

    // Stop any existing execution
    this.stop();

    // Prepare steps
    let steps = [];
    let finalResult = '';
    let sources = [];

    const scenario = this.findMatchingScenario(mission.title);
    if (scenario) {
      steps = JSON.parse(JSON.stringify(scenario.steps));
      finalResult = scenario.finalResult;
      sources = scenario.sources || [];
    } else {
      const synthesized = synthesizeDynamicPlan(mission.title);
      steps = synthesized.steps;
      finalResult = synthesized.finalResult;
      sources = synthesized.sources || [];
    }

    this.activeExecution = {
      missionId,
      steps,
      finalResult,
      sources,
      currentStepIndex: 0,
      startTime: Date.now(),
      abortController: new AbortController()
    };

    store.updateMission(missionId, {
      status: 'Running',
      progress: 5,
      currentStepIndex: 0,
      currentStepTitle: 'Mission Initialized',
      currentReasoningSummary: 'Allocating memory context and parsing task objectives.',
      steps: []
    });

    const signal = this.activeExecution.abortController.signal;

    try {
      for (let i = 0; i < steps.length; i++) {
        if (signal.aborted) break;

        // Check pause state
        while (this.isPaused) {
          await new Promise(resolve => setTimeout(resolve, 200));
          if (signal.aborted) break;
        }

        const step = steps[i];
        this.activeExecution.currentStepIndex = i;

        // Update step status & reasoning summary
        let status = 'Running';
        if (step.type === 'PLAN') status = 'Planning';
        else if (step.type === 'UNDERSTAND') status = 'Reasoning';
        else if (step.type === 'ACT') status = 'Using Tool';
        else if (step.type === 'OBSERVE') status = 'Reasoning';
        else if (step.type === 'EVALUATE') status = 'Reasoning';

        store.updateMission(missionId, {
          status,
          progress: step.progress || Math.round(((i + 1) / steps.length) * 100),
          currentStepIndex: i,
          currentStepTitle: step.title,
          currentReasoningSummary: step.summary,
          activeToolName: step.toolName || null,
          activeToolId: step.toolId || null
        });

        // Add to step history
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        store.addMissionStep(missionId, {
          type: step.type,
          title: step.title,
          summary: step.summary,
          toolName: step.toolName,
          toolInput: step.toolInput,
          observation: step.observation,
          graphNode: step.graphNode,
          timestamp,
          completed: true
        });

        // Add real-time activity log
        store.addLog({
          missionId,
          agentName: mission.agentName,
          type: step.type,
          toolName: step.toolName,
          summary: step.toolName ? `Tool [${step.toolName}]: ${step.summary}` : step.summary,
          durationMs: step.delayMs || 1000
        });

        // If tool was called, increment usage
        if (step.toolId) {
          store.incrementToolUsage(step.toolId);
        }

        // Delay calculation based on speed setting
        const speedSetting = store.getState().settings.executionSpeed || 1;
        let waitTime = (step.delayMs || 1200) / (speedSetting > 0 ? speedSetting : 1);

        if (speedSetting === 0) {
          // Step-by-step manual debug mode: wait until explicit next step call
          await new Promise(resolve => {
            this.stepResolver = resolve;
          });
        } else {
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }

      if (!signal.aborted) {
        const totalDuration = Date.now() - this.activeExecution.startTime;
        store.completeMission(missionId, finalResult, { executionTimeMs: totalDuration });
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error('Agent Engine Error:', err);
        store.failMission(missionId, err.message || 'Execution error encountered.');
      }
    } finally {
      this.activeExecution = null;
    }
  }

  pause() {
    this.isPaused = true;
    if (this.activeExecution) {
      store.updateMission(this.activeExecution.missionId, { status: 'Paused' });
    }
  }

  resume() {
    this.isPaused = false;
    if (this.activeExecution) {
      store.updateMission(this.activeExecution.missionId, { status: 'Running' });
    }
  }

  stepForward() {
    if (this.stepResolver) {
      const resolve = this.stepResolver;
      this.stepResolver = null;
      resolve();
    }
  }

  stop() {
    if (this.activeExecution && this.activeExecution.abortController) {
      this.activeExecution.abortController.abort();
    }
    this.activeExecution = null;
    this.isPaused = false;
    this.stepResolver = null;
  }
}

export const agentEngine = new AgentEngine();
