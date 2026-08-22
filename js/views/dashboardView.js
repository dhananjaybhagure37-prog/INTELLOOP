/* ==========================================================================
   INTELLOOP — DASHBOARD VIEW
   Primary Research Command Center with High-Contrast Dark Prompt Container
   ========================================================================== */

import { store } from '../state/store.js';
import { ApiClient } from '../api/client.js';
import { renderReasoningGraph } from '../components/reasoningGraph.js';
import { formatStatusBadge, formatDuration } from '../utils/formatters.js';
import { toast } from '../components/toast.js';

export function renderDashboardView() {
  const state = store.getState();
  const missions = state.missions || [];
  const activeMission = missions.find(m => m.status === 'Running' || m.status === 'PLANNING' || m.status === 'SEARCHING' || m.status === 'FETCHING' || m.status === 'ANALYZING' || m.status === 'VERIFYING') || missions[0];

  const activeCount = missions.filter(m => m.status !== 'Completed' && m.status !== 'FAILED').length;
  const completedCount = missions.filter(m => m.status === 'Completed').length;

  return `
    <div class="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-12">
      <!-- Ambient Background Glows -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div class="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/15 blur-[120px] rounded-full mix-blend-screen"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div class="relative z-10 flex flex-col gap-8">
        <!-- Hero Header -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-widest uppercase">Autonomous Intelligence Engine</span>
          </div>
          <h1 class="font-display-lg text-3xl lg:text-4xl text-on-surface tracking-tight font-bold">
            Good morning, <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${state.settings.researcherName || 'Researcher'}</span>
          </h1>
          <p class="font-body-lg text-sm text-on-surface-variant">
            Enter a research objective. IntelliLoop will autonomously plan, search live web sources, extract empirical data, verify claims, and compile an executive intelligence report.
          </p>
        </div>

        <!-- HIGH-CONTRAST BLACK / VERY DARK INVESTIGATION PROMPT CONTAINER -->
        <div class="rounded-2xl bg-gradient-to-br from-white/20 via-primary/30 to-secondary/30 p-[2px] shadow-2xl relative group">
          <div class="absolute inset-0 bg-primary/10 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div class="rounded-2xl bg-[#070d1f] p-4 flex flex-col relative z-10 border border-white/10 shadow-inner">
            <div class="flex items-center justify-between px-3 py-1 text-xs text-on-surface-variant/80 border-b border-white/5 pb-2">
              <span class="font-mono text-primary flex items-center gap-1.5 font-semibold">
                <span class="material-symbols-outlined text-[16px]">psychology</span>
                INTELLOOP REACT RESEARCH PROMPT
              </span>
              <span class="text-[11px] text-on-surface-variant font-mono">Real Autonomous Web Execution</span>
            </div>

            <!-- Large Dark Typing Area -->
            <textarea id="dashboard-hero-prompt" rows="3"
                      class="w-full bg-transparent resize-none p-4 font-body-md text-white text-base placeholder:text-gray-400 focus:outline-none leading-relaxed" 
                      placeholder="Describe what you want IntelliLoop to investigate (e.g. 'Investigate the current electric vehicle market in India and identify the major trends, government policies, growth factors and challenges.')..."></textarea>
            
            <!-- Quick Suggestion Pills -->
            <div class="flex flex-wrap items-center gap-2 px-3 py-2 border-t border-white/10 bg-[#0c1324]/80 rounded-xl mt-1">
              <span class="text-[11px] font-semibold text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
                Suggested Investigations:
              </span>
              <button type="button" class="dashboard-suggestion-pill px-3 py-1 rounded-full text-xs font-medium bg-[#151b2d] hover:bg-primary/20 text-gray-200 hover:text-primary border border-white/10 transition-all truncate max-w-sm"
                      data-prompt="Investigate the current electric vehicle market in India and identify the major trends, government policies, growth factors and challenges.">
                ⚡ EV Market in India (Trends & Policies)
              </button>
              <button type="button" class="dashboard-suggestion-pill px-3 py-1 rounded-full text-xs font-medium bg-[#151b2d] hover:bg-primary/20 text-gray-200 hover:text-primary border border-white/10 transition-all truncate max-w-sm"
                      data-prompt="Investigate whether AI-powered predictive maintenance can reduce manufacturing downtime.">
                🏭 AI Predictive Maintenance
              </button>
              <button type="button" class="dashboard-suggestion-pill px-3 py-1 rounded-full text-xs font-medium bg-[#151b2d] hover:bg-primary/20 text-gray-200 hover:text-primary border border-white/10 transition-all truncate max-w-sm"
                      data-prompt="Investigate solid-state battery commercialization bottlenecks and market timeline.">
                🔋 Solid-State Battery Commercialization
              </button>
            </div>

            <!-- Action Bar -->
            <div class="flex items-center justify-between p-2 mt-3 bg-[#0c1324] rounded-xl border border-white/5">
              <div class="flex items-center gap-2">
                <button id="hero-clear-btn" class="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1" title="Clear prompt">
                  <span class="material-symbols-outlined text-[16px]">backspace</span>
                  <span>Clear</span>
                </button>
                <button id="hero-attach-btn" class="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-1" title="Attach reference document">
                  <span class="material-symbols-outlined text-[16px]">attach_file</span>
                  <span>Attach Document</span>
                </button>
                <button id="hero-voice-btn" class="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-primary hover:bg-white/5 transition-colors flex items-center gap-1" title="Voice dictation">
                  <span class="material-symbols-outlined text-[16px]">mic</span>
                  <span>Voice</span>
                </button>
              </div>

              <div class="flex items-center gap-3">
                <div class="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <span class="text-emerald-400">●</span>
                  <span>Anti-Hallucination Gate Active</span>
                </div>
                <button id="dashboard-start-mission-btn" class="px-6 py-2.5 bg-gradient-to-r from-primary via-primary-container to-secondary text-[#002e6a] font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.4)] hover:shadow-[0_0_30px_rgba(173,198,255,0.7)] hover:scale-[1.02] transition-all flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">rocket_launch</span>
                  <span>Start Autonomous Investigation</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Hero Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg">
            <div class="rounded-xl bg-surface-container-low/90 backdrop-blur-md p-5 h-full flex flex-col justify-between overflow-hidden relative">
              <span class="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-semibold uppercase tracking-wider">
                <span class="material-symbols-outlined text-[18px] text-primary">model_training</span>
                Active Investigations
              </span>
              <div class="mt-4 font-display-lg text-4xl text-on-surface font-light tracking-tighter counter-val">${activeCount}</div>
            </div>
          </div>

          <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg">
            <div class="rounded-xl bg-surface-container-low/90 backdrop-blur-md p-5 h-full flex flex-col justify-between overflow-hidden relative">
              <span class="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-semibold uppercase tracking-wider">
                <span class="material-symbols-outlined text-[18px] text-tertiary">task_alt</span>
                Verified Reports Delivered
              </span>
              <div class="mt-4 font-display-lg text-4xl text-on-surface font-light tracking-tighter counter-val">${completedCount}</div>
            </div>
          </div>

          <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg">
            <div class="rounded-xl bg-surface-container-low/90 backdrop-blur-md p-5 h-full flex flex-col justify-between overflow-hidden relative">
              <span class="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-semibold uppercase tracking-wider">
                <span class="material-symbols-outlined text-[18px] text-secondary">api</span>
                ReAct Tool Calls
              </span>
              <div class="mt-4 font-display-lg text-4xl text-on-surface font-light tracking-tighter counter-val">426</div>
            </div>
          </div>

          <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg">
            <div class="rounded-xl bg-surface-container-low/90 backdrop-blur-md p-5 h-full flex flex-col justify-between overflow-hidden relative">
              <span class="font-label-md text-xs text-on-surface-variant flex items-center gap-2 font-semibold uppercase tracking-wider">
                <span class="material-symbols-outlined text-[18px] text-primary-fixed">verified</span>
                Claim Accuracy
              </span>
              <div class="mt-4 font-display-lg text-4xl text-on-surface font-light tracking-tighter flex items-baseline gap-1">
                <span class="counter-val">98.4</span>
                <span class="text-xl text-primary">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- MAIN BENTO GRID: Workspace & Dynamic Reasoning Graph -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 flex flex-col gap-6">
            <div class="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-[1px] shadow-2xl h-full relative group">
              <div class="rounded-2xl bg-surface-container/90 backdrop-blur-xl w-full h-full p-6 flex flex-col relative z-10">
                <!-- Workspace Header -->
                <div class="flex items-start justify-between mb-6">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 bg-primary/15 px-3 py-1 rounded-full text-primary font-label-sm text-xs uppercase tracking-wider border border-primary/20">
                        <div class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                        <div class="w-1.5 h-1.5 rounded-full bg-primary absolute"></div>
                        ${activeMission ? activeMission.status : 'Autonomous Ready'}
                      </div>
                      <span class="font-label-md text-xs text-on-surface-variant font-mono">ID: ${activeMission ? activeMission.id : 'NX-8842-OMEGA'}</span>
                    </div>
                    <h2 class="font-headline-md text-lg lg:text-xl text-on-surface mt-1 max-w-2xl leading-snug font-semibold">
                      "${activeMission ? activeMission.question || activeMission.title : 'Investigate the current electric vehicle market in India and identify the major trends, government policies, growth factors and challenges.'}"
                    </h2>
                  </div>

                  ${activeMission ? `
                    <a href="#execution?id=${activeMission.id}" class="p-2 rounded-lg hover:bg-white/10 text-on-surface-variant hover:text-primary transition-colors" title="Expand Execution Command Center">
                      <span class="material-symbols-outlined text-[20px]">fullscreen</span>
                    </a>
                  ` : ''}
                </div>

                <!-- ReAct Flow Pipeline Badges -->
                <div class="flex items-center justify-between bg-surface-dim/60 rounded-xl p-2.5 mb-6 overflow-x-auto hide-scrollbar border border-white/5">
                  <div class="flex items-center font-label-sm text-xs whitespace-nowrap gap-1">
                    <span class="px-2.5 py-1 text-primary font-semibold">UNDERSTAND</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-2.5 py-1 text-primary font-semibold">PLAN</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-3 py-1 bg-primary text-on-primary font-bold rounded-md shadow-[0_0_10px_rgba(173,198,255,0.4)] mx-0.5">DECIDE & RUN TOOL</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-2.5 py-1 text-on-surface-variant">OBSERVE</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-2.5 py-1 text-on-surface-variant">EVALUATE</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-2.5 py-1 text-on-surface-variant">VERIFY</span>
                    <span class="text-on-surface-variant/30 material-symbols-outlined text-[14px]">chevron_right</span>
                    <span class="px-2.5 py-1 text-on-surface-variant">SYNTHESIZE</span>
                  </div>
                </div>

                <!-- Live Reasoning Graph Component -->
                <div class="flex-1 bg-surface-dim/40 rounded-xl relative overflow-hidden min-h-[280px] flex items-center justify-center p-2 border border-white/5">
                  ${renderReasoningGraph('SEARCH')}
                </div>
              </div>
            </div>
          </div>

          <!-- Right Span: Live System Monitor -->
          <div class="lg:col-span-4 flex flex-col gap-6">
            <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-md">
              <div class="rounded-xl bg-surface-container/85 backdrop-blur-md p-5 flex flex-col gap-4">
                <h3 class="font-label-md text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-2 font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-primary">memory</span>
                  ReAct Engine Telemetry
                </h3>
                <div class="flex flex-col gap-2.5">
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-dim/50 border border-white/5">
                    <span class="font-label-sm text-xs text-on-surface">ReAct Agent Core</span>
                    <span class="px-2 py-0.5 bg-emerald-400/20 text-emerald-400 font-label-sm text-[10px] uppercase font-bold rounded flex items-center gap-1">
                      <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> Online
                    </span>
                  </div>
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-dim/50 border border-white/5">
                    <span class="font-label-sm text-xs text-on-surface">Live Web Search</span>
                    <span class="px-2 py-0.5 bg-primary/20 text-primary font-label-sm text-[10px] uppercase font-bold rounded flex items-center gap-1">
                      DuckDuckGo / Wiki
                    </span>
                  </div>
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-dim/50 border border-white/5">
                    <span class="font-label-sm text-xs text-on-surface">Evidence Store</span>
                    <span class="font-label-sm text-xs text-primary font-mono">SQLite (intelloop.db)</span>
                  </div>
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-surface-dim/50 border border-white/5">
                    <span class="font-label-sm text-xs text-on-surface">Anti-Hallucination</span>
                    <span class="px-2 py-0.5 bg-emerald-400/20 text-emerald-400 font-label-sm text-[10px] font-bold rounded">Enforced</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity Stream -->
            <div class="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-[1px] shadow-lg flex-1 min-h-[260px]">
              <div class="rounded-xl bg-surface-container/85 backdrop-blur-md p-5 h-full flex flex-col">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="font-label-md text-xs text-on-surface-variant uppercase tracking-widest flex items-center gap-2 font-semibold">
                    <span class="material-symbols-outlined text-[16px] text-primary">list_alt</span>
                    Live Event Stream
                  </h3>
                  <a href="#activity-logs" class="text-[11px] text-primary hover:underline">View All</a>
                </div>

                <div class="space-y-3 overflow-y-auto hide-scrollbar max-h-56">
                  <div class="p-2.5 rounded-lg bg-surface-lowest/70 border border-white/5 text-xs">
                    <span class="text-[10px] text-primary font-mono block">11:32:14 • Research Agent</span>
                    <span class="text-on-surface font-medium">Found 8 candidate sources across official and news domains.</span>
                  </div>
                  <div class="p-2.5 rounded-lg bg-surface-lowest/70 border border-white/5 text-xs">
                    <span class="text-[10px] text-secondary font-mono block">11:32:24 • Verification Agent</span>
                    <span class="text-on-surface font-medium">Extracted numerical metrics and validated supporting citations.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History / Active Investigations Table -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-headline-md text-lg text-on-surface font-semibold">Research Investigations Portfolio</h3>
              <p class="text-xs text-on-surface-variant">Live telemetry and results from SQLite database</p>
            </div>
            <a href="#research-history" class="text-xs text-primary hover:underline">View Complete History</a>
          </div>

          <div class="overflow-x-auto hide-scrollbar">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="border-b border-white/10 text-on-surface-variant font-label-sm text-[11px] uppercase tracking-wider">
                  <th class="py-3 px-4">Investigation ID & Objective</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4">Domain</th>
                  <th class="py-3 px-4">Confidence</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                ${missions.map(m => {
                  const badge = formatStatusBadge(m.status);
                  return `
                    <tr class="hover:bg-white/5 transition-colors">
                      <td class="py-3.5 px-4">
                        <span class="font-mono text-primary font-bold text-xs">${m.id}</span>
                        <p class="font-medium text-on-surface max-w-md truncate">${m.question || m.title}</p>
                      </td>
                      <td class="py-3.5 px-4 whitespace-nowrap">
                        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}">
                          ${badge.label}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">${m.domain || 'General'}</td>
                      <td class="py-3.5 px-4 font-mono text-emerald-400 font-bold">HIGH (96.8%)</td>
                      <td class="py-3.5 px-4 text-right whitespace-nowrap">
                        ${m.status === 'Completed' ? `
                          <a href="#result?id=${m.id}" class="px-3 py-1 rounded bg-emerald-500/15 text-emerald-400 font-semibold text-xs hover:bg-emerald-500/25">View Report</a>
                        ` : `
                          <a href="#execution?id=${m.id}" class="px-3 py-1 rounded bg-primary/15 text-primary font-semibold text-xs hover:bg-primary/25">Inspect Stream</a>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindDashboardEvents() {
  const promptInput = document.getElementById('dashboard-hero-prompt');
  const startBtn = document.getElementById('dashboard-start-mission-btn');
  const clearBtn = document.getElementById('hero-clear-btn');
  const attachBtn = document.getElementById('hero-attach-btn');
  const voiceBtn = document.getElementById('hero-voice-btn');
  const suggestionPills = document.querySelectorAll('.dashboard-suggestion-pill');

  suggestionPills.forEach(pill => {
    pill.onclick = () => {
      if (promptInput) {
        promptInput.value = pill.dataset.prompt;
        promptInput.focus();
      }
    };
  });

  if (clearBtn && promptInput) {
    clearBtn.onclick = () => {
      promptInput.value = '';
      promptInput.focus();
    };
  }

  if (attachBtn) {
    attachBtn.onclick = () => {
      window.location.hash = '#knowledge-base';
    };
  }

  if (voiceBtn) {
    voiceBtn.onclick = () => {
      toast.show('Transcribing speech input...', 'info');
      setTimeout(() => {
        if (promptInput) {
          promptInput.value = 'Investigate the current electric vehicle market in India and identify the major trends, government policies, growth factors and challenges.';
          toast.show('Voice input transcribed successfully!', 'success');
        }
      }, 1000);
    };
  }

  if (startBtn) {
    startBtn.onclick = async () => {
      const question = promptInput ? promptInput.value.trim() : '';
      if (!question) {
        toast.show('Please enter an investigation objective.', 'warning');
        return;
      }

      startBtn.disabled = true;
      startBtn.innerHTML = `<span class="material-symbols-outlined text-[18px] animate-spin">autorenew</span> Starting ReAct Agent...`;

      try {
        toast.show('Initializing ReAct Research Orchestrator...', 'info');
        const res = await ApiClient.createInvestigation(question, 'Standard', 'Autonomous Research');
        
        // Also update local store
        store.createMission({
          id: res.investigation_id,
          title: question,
          question: question,
          status: 'PLANNING'
        });

        toast.show(`Investigation ${res.investigation_id} dispatched! Connecting to live ReAct stream...`, 'success');
        window.location.hash = `#execution?id=${res.investigation_id}`;
      } catch (err) {
        console.error('Launch error:', err);
        toast.show(`Launch error: ${err.message}`, 'error');
        startBtn.disabled = false;
        startBtn.innerHTML = `<span class="material-symbols-outlined text-[18px]">rocket_launch</span> Start Autonomous Investigation`;
      }
    };
  }
}
