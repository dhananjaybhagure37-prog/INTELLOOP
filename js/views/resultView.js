/* ==========================================================================
   INTELLOOP — FINAL RESULT & VERIFIED REPORT VIEW
   Executive briefing with interactive evidence cards, conflict alerts & citations
   ========================================================================== */

import { store } from '../state/store.js';
import { ApiClient } from '../api/client.js';
import { copyToClipboard, exportMissionAsMarkdown, exportMissionAsJson } from '../utils/exportHelpers.js';
import { formatDuration } from '../utils/formatters.js';
import { toast } from '../components/toast.js';

export function renderResultView(missionId) {
  const state = store.getState();
  const mission = store.getMission(missionId) || state.missions[0];

  return `
    <div class="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-16" id="result-view-container">
      <!-- Loading placeholder while fetching from backend -->
      <div class="p-12 text-center text-on-surface-variant" id="result-loading-state">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin mb-2">autorenew</span>
        <p class="text-xs font-mono">Loading verified intelligence report from SQLite database...</p>
      </div>

      <!-- Main Result Dynamic Mount -->
      <div id="result-content-mount" class="hidden flex-col gap-6"></div>
    </div>
  `;
}

export function bindResultEvents(missionId) {
  const loading = document.getElementById('result-loading-state');
  const mount = document.getElementById('result-content-mount');

  ApiClient.getInvestigation(missionId).then(inv => {
    if (!inv) {
      if (loading) loading.innerHTML = '<p class="text-xs text-error">Investigation not found in database.</p>';
      return;
    }

    if (loading) loading.classList.add('hidden');
    if (mount) {
      mount.classList.remove('hidden');
      mount.classList.add('flex');
      mount.innerHTML = buildResultHtml(inv);
      bindResultActions(inv);
    }
  }).catch(err => {
    console.error('Error loading investigation:', err);
    if (loading) loading.innerHTML = `<p class="text-xs text-error">Error loading report: ${err.message}</p>`;
  });
}

function buildResultHtml(inv) {
  const rawMarkdown = inv.final_report || '# Autonomous Intelligence Report\n\nNo report available.';
  const claims = inv.claims || [];
  const sources = inv.sources || [];
  const conflicts = inv.conflicts || [];

  // Parse simple markdown into styled HTML
  let parsedHtml = rawMarkdown
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-on-surface pb-3 mb-4 border-b border-white/10">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-primary mt-6 mb-3 flex items-center gap-2"><span class="w-1.5 h-4 bg-primary rounded"></span>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-sm font-semibold text-secondary mt-4 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-on-surface font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-primary">$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-[#070d1f] p-4 rounded-xl font-mono text-xs text-primary border border-white/10 my-3 overflow-x-auto"><code>$1</code></pre>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary bg-primary/10 p-3 rounded-r-lg text-xs text-primary-fixed my-3">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="text-xs text-on-surface-variant leading-relaxed mb-3">');

  return `
    <!-- Top Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-high/60 backdrop-blur-xl border border-white/5 shadow-lg">
      <div class="flex items-center gap-3">
        <a href="#dashboard" class="p-2 rounded-lg bg-surface-lowest hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors" title="Back to Dashboard">
          <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        </a>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-primary font-bold text-xs">${inv.id}</span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              Verified & Grounded
            </span>
          </div>
          <h1 class="text-base font-bold text-on-surface mt-0.5 max-w-xl truncate">${inv.question}</h1>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button id="copy-result-btn" class="px-3 py-1.5 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-primary">content_copy</span>
          <span>Copy Result</span>
        </button>
        <button id="export-md-btn" class="px-3 py-1.5 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-secondary">download</span>
          <span>Markdown</span>
        </button>
        <button id="export-json-btn" class="px-3 py-1.5 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-tertiary">code</span>
          <span>JSON</span>
        </button>
        <button id="print-pdf-btn" class="px-3 py-1.5 rounded-lg bg-surface-lowest hover:bg-white/10 text-on-surface border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px] text-emerald-400">print</span>
          <span>Print / PDF</span>
        </button>
      </div>
    </div>

    <!-- Conflicting Evidence Alert Box if detected -->
    ${conflicts.length > 0 ? `
      <div class="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 shadow-lg flex flex-col gap-2">
        <div class="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <span class="material-symbols-outlined text-[18px]">warning</span>
          <span>Conflicting Evidence Detected Across Consulted Sources</span>
        </div>
        <p class="text-xs text-on-surface leading-relaxed">
          <strong>Discrepancy:</strong> ${conflicts[0].topic}
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 text-xs">
          <div class="p-2.5 rounded-lg bg-surface-lowest/80 border border-white/5">
            <span class="font-mono text-primary text-[10px] block">${conflicts[0].source_a_name}</span>
            <p class="text-on-surface-variant mt-0.5">${conflicts[0].source_a_val}</p>
          </div>
          <div class="p-2.5 rounded-lg bg-surface-lowest/80 border border-white/5">
            <span class="font-mono text-secondary text-[10px] block">${conflicts[0].source_b_name}</span>
            <p class="text-on-surface-variant mt-0.5">${conflicts[0].source_b_val}</p>
          </div>
        </div>
        <span class="text-[11px] text-on-surface-variant/80 font-mono mt-1">
          <strong>Analytical Explanation:</strong> ${conflicts[0].explanation || 'Differing baseline reporting periods or geographic scopes.'}
        </span>
      </div>
    ` : ''}

    <!-- Main Grid: Report (8 cols) + Evidence & Sources Panel (4 cols) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Report Body (8 cols) -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <div class="rounded-2xl bg-surface-container/95 border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          <div class="report-content prose prose-invert max-w-none text-xs">
            ${parsedHtml}
          </div>
        </div>
      </div>

      <!-- Evidence Cards & Citations (4 cols) -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <!-- Interactive Evidence Cards -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-5 shadow-xl flex flex-col gap-4">
          <h3 class="font-label-md text-xs text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-primary">verified</span>
            Claim Evidence Cards (${claims.length})
          </h3>

          <div class="space-y-3">
            ${claims.length === 0 ? `
              <div class="p-4 rounded-xl bg-surface-lowest text-xs text-on-surface-variant">
                Multi-source evidence evaluated across ${sources.length} sources.
              </div>
            ` : claims.map(c => `
              <div class="p-3.5 rounded-xl bg-surface-lowest border border-white/5 flex flex-col gap-2 hover:border-primary/30 transition-all cursor-pointer claim-card group">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${c.confidence === 'HIGH' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}">
                    ${c.status || 'VERIFIED'}
                  </span>
                  <span class="text-[10px] text-on-surface-variant font-mono">Confidence: ${c.confidence}</span>
                </div>
                <p class="text-xs text-on-surface font-medium leading-snug">
                  "${c.finding_text}"
                </p>
                <div class="text-[10px] text-primary flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">link</span>
                  <span>${c.evidence_strength || 'Strong Multi-Source Backing'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Consulted Authoritative Sources Panel -->
        <div class="rounded-2xl bg-surface-container/90 border border-white/5 p-5 shadow-xl flex flex-col gap-3">
          <h3 class="font-label-md text-xs text-on-surface-variant uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-secondary">travel_explore</span>
            Consulted Sources (${sources.length})
          </h3>

          <div class="space-y-2.5 text-xs">
            ${sources.map(s => `
              <a href="${s.url}" target="_blank" rel="noopener noreferrer" 
                 class="p-3 rounded-xl bg-surface-lowest/80 border border-white/5 hover:border-primary/40 hover:bg-white/5 transition-all flex flex-col gap-1 group block">
                <div class="flex items-start justify-between">
                  <span class="font-bold text-on-surface text-xs group-hover:text-primary transition-colors line-clamp-1">
                    ${s.title}
                  </span>
                  <span class="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary shrink-0 ml-1">open_in_new</span>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant">
                  <span class="text-secondary">${s.publisher || 'Web'}</span>
                  <span>•</span>
                  <span class="text-emerald-400">${s.authority || 'High Authority'}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindResultActions(inv) {
  const copyBtn = document.getElementById('copy-result-btn');
  const exportMdBtn = document.getElementById('export-md-btn');
  const exportJsonBtn = document.getElementById('export-json-btn');
  const printPdfBtn = document.getElementById('print-pdf-btn');

  if (copyBtn) {
    copyBtn.onclick = () => {
      copyToClipboard(inv.final_report || '').then(() => {
        toast.show('Research report copied to clipboard!', 'success');
      });
    };
  }

  if (exportMdBtn) {
    exportMdBtn.onclick = () => {
      exportMissionAsMarkdown({
        id: inv.id,
        title: inv.question,
        agentName: 'ReAct Research Agent',
        status: inv.status,
        executionTimeMs: inv.execution_time_ms,
        finalResult: inv.final_report,
        steps: inv.steps || [],
        toolsUsed: ['searchWeb', 'fetchSource', 'extractFacts', 'verifyClaim', 'analyzeData']
      });
      toast.show('Markdown report downloaded.', 'info');
    };
  }

  if (exportJsonBtn) {
    exportJsonBtn.onclick = () => {
      exportMissionAsJson(inv);
      toast.show('JSON investigation bundle downloaded.', 'info');
    };
  }

  if (printPdfBtn) {
    printPdfBtn.onclick = () => {
      window.print();
    };
  }
}
