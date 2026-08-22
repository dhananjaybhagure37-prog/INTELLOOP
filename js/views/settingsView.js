/* ==========================================================================
   INTELLOOP — SYSTEM SETTINGS & DATA MANAGEMENT VIEW
   Model providers, agent parameters, workspace preferences & state persistence
   ========================================================================== */

import { store } from '../state/store.js';
import { toast } from '../components/toast.js';

export function renderSettingsView() {
  const state = store.getState();
  const settings = state.settings || {};

  return `
    <div class="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-16">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">settings</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Configuration</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Platform Settings</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage reasoning engine parameters, AI model providers, and persistent workspace storage</p>
        </div>
      </div>

      <!-- Settings Form -->
      <form id="settings-form" class="space-y-6">
        <!-- Section 1: General Workspace -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-lg space-y-4">
          <h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">business</span>
            General Workspace Configuration
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="flex flex-col gap-1.5">
              <label for="set-workspace-name" class="text-on-surface-variant font-medium">Workspace Name:</label>
              <input type="text" id="set-workspace-name" value="${settings.workspaceName || 'Nexus Global Operations'}" 
                     class="form-input text-xs bg-surface-lowest" />
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="set-researcher-name" class="text-on-surface-variant font-medium">Researcher Name:</label>
              <input type="text" id="set-researcher-name" value="${settings.researcherName || 'Researcher'}" 
                     class="form-input text-xs bg-surface-lowest" />
            </div>
          </div>
        </div>

        <!-- Section 2: AI Model Provider & Engine Architecture -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-lg space-y-4">
          <h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[18px]">psychology</span>
            Reasoning Engine & AI Model Provider
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="flex flex-col gap-1.5">
              <label for="set-model-provider" class="text-on-surface-variant font-medium">Underlying Model Simulation:</label>
              <select id="set-model-provider" class="form-input text-xs bg-surface-lowest">
                <option value="Gemini 2.5 Pro (Thinking / Reasoning Engine)" selected>Gemini 2.5 Pro (Thinking / Reasoning Engine)</option>
                <option value="Claude 3.5 Sonnet (Tool Orchestrator)">Claude 3.5 Sonnet (Tool Orchestrator)</option>
                <option value="GPT-4o (Reasoning & Code Sandbox)">GPT-4o (Reasoning & Code Sandbox)</option>
                <option value="DeepSeek-R1 (Lattice Verification)">DeepSeek-R1 (Lattice Verification)</option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="set-execution-speed" class="text-on-surface-variant font-medium">Default Execution Speed:</label>
              <select id="set-execution-speed" class="form-input text-xs bg-surface-lowest">
                <option value="1" ${settings.executionSpeed === 1 ? 'selected' : ''}>1x Normal (Realistic)</option>
                <option value="2" ${settings.executionSpeed === 2 ? 'selected' : ''}>2x Accelerated</option>
                <option value="5" ${settings.executionSpeed === 5 ? 'selected' : ''}>5x Turbo Fast</option>
                <option value="0" ${settings.executionSpeed === 0 ? 'selected' : ''}>Step-by-Step (Manual Debug)</option>
              </select>
            </div>
          </div>

          <div class="pt-2 border-t border-white/5 space-y-3">
            <label class="flex items-center gap-3 text-xs text-on-surface cursor-pointer">
              <input type="checkbox" id="set-safe-reasoning" ${settings.safeReasoningMode !== false ? 'checked' : ''} class="accent-primary w-4 h-4 rounded" />
              <span>
                <strong>Safe Reasoning Mode (Recommended):</strong> Hides raw internal chain-of-thought tokens and presents clean, executive-level thought summaries.
              </span>
            </label>

            <label class="flex items-center gap-3 text-xs text-on-surface cursor-pointer">
              <input type="checkbox" id="set-auto-retry" ${settings.autoRetry !== false ? 'checked' : ''} class="accent-primary w-4 h-4 rounded" />
              <span>
                <strong>Autonomous Self-Healing Loop:</strong> Automatically retry and pivot tool strategy if an external tool invocation errors.
              </span>
            </label>
          </div>
        </div>

        <!-- Section 3: Appearance & Density -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-lg space-y-4">
          <h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary text-[18px]">palette</span>
            Appearance & UI Density
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="flex flex-col gap-1.5">
              <label for="set-theme-select" class="text-on-surface-variant font-medium">Design Palette:</label>
              <select id="set-theme-select" class="form-input text-xs bg-surface-lowest">
                <option value="dark-space" selected>Deep Space Glass (Stitch Official)</option>
                <option value="cyber-violet">Cyber Violet Luminescence</option>
                <option value="matrix-cyan">Telemetry Cyan Matrix</option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label for="set-density-select" class="text-on-surface-variant font-medium">Dashboard Layout Density:</label>
              <select id="set-density-select" class="form-input text-xs bg-surface-lowest">
                <option value="standard" selected>Standard (Optimized for Command Center)</option>
                <option value="compact">Compact (High-Density Telemetry)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 4: Data Persistence & Reset -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-6 shadow-lg space-y-4">
          <h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-error text-[18px]">database</span>
            Data Management & Storage
          </h2>
          <p class="text-xs text-on-surface-variant">
            Platform state is persistently synchronized with your browser's LocalStorage. You can backup, export, or reset to initial hackathon demo data at any time.
          </p>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button type="button" id="export-workspace-state-btn" class="px-4 py-2 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <span class="material-symbols-outlined text-[16px] text-primary">cloud_download</span>
              Export Full Workspace State (JSON)
            </button>

            <button type="button" id="reset-demo-data-btn" class="px-4 py-2 rounded-lg bg-error/15 hover:bg-error/25 text-error border border-error/20 text-xs font-semibold flex items-center gap-1.5 transition-colors">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset to Clean Demo Data
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end pt-4">
          <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(173,198,255,0.4)] hover:shadow-[0_0_25px_rgba(173,198,255,0.6)] transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">save</span>
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  `;
}

export function bindSettingsEvents() {
  const form = document.getElementById('settings-form');
  const resetBtn = document.getElementById('reset-demo-data-btn');
  const exportBtn = document.getElementById('export-workspace-state-btn');

  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const workspaceName = document.getElementById('set-workspace-name')?.value;
      const researcherName = document.getElementById('set-researcher-name')?.value;
      const modelProvider = document.getElementById('set-model-provider')?.value;
      const executionSpeed = parseFloat(document.getElementById('set-execution-speed')?.value || '1');
      const safeReasoningMode = document.getElementById('set-safe-reasoning')?.checked;
      const autoRetry = document.getElementById('set-auto-retry')?.checked;
      const theme = document.getElementById('set-theme-select')?.value;
      const density = document.getElementById('set-density-select')?.value;

      store.updateSettings({
        workspaceName,
        researcherName,
        modelProvider,
        executionSpeed,
        safeReasoningMode,
        autoRetry,
        theme,
        density
      });

      toast.show('Settings saved and persisted to LocalStorage!', 'success');
    };
  }

  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm('Reset workspace to initial demo state? All custom missions will be refreshed.')) {
        store.resetToDemoData();
        toast.show('Workspace state reset to default demo dataset.', 'info');
        window.location.hash = '#dashboard';
        window.location.reload();
      }
    };
  }

  if (exportBtn) {
    exportBtn.onclick = () => {
      const stateJson = JSON.stringify(store.getState(), null, 2);
      const blob = new Blob([stateJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Intelloop-State-Backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.show('Workspace backup downloaded.', 'info');
    };
  }
}
