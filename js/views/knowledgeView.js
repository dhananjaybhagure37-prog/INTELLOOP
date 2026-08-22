/* ==========================================================================
   INTELLOOP — KNOWLEDGE BASE & DOCUMENT PROCESSOR VIEW
   Vector embeddings repository, document indexing & semantic search sandbox
   ========================================================================== */

import { store } from '../state/store.js';
import { toast } from '../components/toast.js';

export function renderKnowledgeView() {
  const state = store.getState();
  const docs = state.knowledgeDocs || [];

  return `
    <div class="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-surface-container/90 backdrop-blur-xl border border-white/5 shadow-xl">
        <div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">menu_book</span>
            <span class="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Memory Vectors</span>
          </div>
          <h1 class="text-2xl font-bold text-on-surface mt-1">Enterprise Knowledge Base</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Dense vector index loaded with technical whitepapers, telemetry standards, and regulatory policies</p>
        </div>

        <button id="upload-doc-modal-btn" class="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-on-primary font-label-md text-xs font-bold shadow-[0_0_15px_rgba(173,198,255,0.3)] hover:opacity-90 transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px]">upload_file</span>
          + Ingest New Document
        </button>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Document List (7 cols) -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <h2 class="text-sm font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">folder</span>
            Indexed Knowledge Documents (${docs.length})
          </h2>

          <div class="space-y-3">
            ${docs.map(d => `
              <div class="rounded-xl bg-surface-container/90 border border-white/5 p-5 hover:border-primary/30 transition-all group">
                <div class="flex items-start justify-between">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                      <span class="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-on-surface">${d.title}</h3>
                      <div class="flex items-center gap-3 text-[11px] font-mono text-on-surface-variant mt-0.5">
                        <span>${d.category}</span>
                        <span>•</span>
                        <span>${d.size}</span>
                        <span>•</span>
                        <span>${d.chunks} Chunks</span>
                      </div>
                    </div>
                  </div>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold">INDEXED</span>
                </div>

                <p class="text-xs text-on-surface-variant mt-3 leading-relaxed">
                  ${d.summary}
                </p>

                <!-- Tags -->
                <div class="flex flex-wrap gap-1.5 mt-3">
                  ${(d.tags || []).map(tag => `
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-surface-lowest text-primary border border-white/5">
                      #${tag}
                    </span>
                  `).join('')}
                </div>

                <!-- Sample Chunks Accordion -->
                <div class="mt-4 pt-3 border-t border-white/5 space-y-1.5">
                  <span class="text-[10px] text-on-surface-variant/70 uppercase font-semibold block">Vector Chunks Preview:</span>
                  ${(d.sampleChunks || []).map(chunk => `
                    <div class="p-2 rounded bg-surface-lowest/70 text-[11px] font-mono text-on-surface-variant border border-white/5">
                      ${chunk}
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Semantic Vector Search Sandbox (5 cols) -->
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="rounded-2xl bg-surface-container/95 border border-white/10 shadow-2xl p-6 sticky top-20">
            <div class="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">search_insights</span>
                <h2 class="text-sm font-bold text-on-surface">Semantic Vector Search</h2>
              </div>
              <span class="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">Cosine Sim</span>
            </div>

            <div class="space-y-3">
              <div class="flex flex-col gap-1.5 text-xs">
                <label for="kb-query-input" class="text-on-surface-variant font-medium">Test Vector Query:</label>
                <input type="text" id="kb-query-input" placeholder="e.g. baseline acoustic vibration limits"
                       value="baseline vibration limits ISO"
                       class="form-input text-xs w-full bg-surface-lowest" />
              </div>

              <button id="kb-search-btn" class="w-full py-2 bg-primary/15 hover:bg-primary/25 text-primary font-bold text-xs rounded-lg border border-primary/25 transition-all flex items-center justify-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">travel_explore</span>
                Query Vector Embeddings
              </button>

              <div class="pt-3 border-t border-white/5">
                <span class="text-[10px] text-on-surface-variant uppercase font-semibold block mb-2">Nearest Neighbor Chunks:</span>
                <div id="kb-results-display" class="space-y-2">
                  <div class="p-3 rounded-lg bg-surface-lowest border border-primary/30 text-xs">
                    <div class="flex justify-between text-[10px] font-mono text-primary mb-1">
                      <span>Chunk #1 • ISO Telemetry Standards</span>
                      <span class="font-bold text-emerald-400">Score: 0.948</span>
                    </div>
                    <p class="text-on-surface-variant text-[11px]">
                      "Baseline vibration limits for Class I motors defined between 10 Hz and 1,000 Hz under ISO-13374."
                    </p>
                  </div>

                  <div class="p-3 rounded-lg bg-surface-lowest border border-white/5 text-xs opacity-75">
                    <div class="flex justify-between text-[10px] font-mono text-primary mb-1">
                      <span>Chunk #2 • Acoustic Sensors</span>
                      <span class="font-bold text-emerald-400">Score: 0.892</span>
                    </div>
                    <p class="text-on-surface-variant text-[11px]">
                      "Micro-crack acoustic emissions occur in the 20 kHz to 100 kHz envelope prior to observable temperature increases."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindKnowledgeEvents() {
  const uploadBtn = document.getElementById('upload-doc-modal-btn');
  const searchBtn = document.getElementById('kb-search-btn');
  const queryInput = document.getElementById('kb-query-input');
  const resultsDisplay = document.getElementById('kb-results-display');

  if (uploadBtn) {
    uploadBtn.onclick = () => {
      const title = prompt('Enter document title to ingest (PDF, DOCX, TXT):', 'Supply_Chain_Risk_Assessment_2026.pdf');
      if (title) {
        store.addKnowledgeDoc({
          title,
          category: 'Operations',
          size: '3.1 MB',
          pages: 22,
          chunks: 92,
          tags: ['Upload', 'Enterprise', 'Verified'],
          summary: `Enterprise risk assessment and supply chain redundancy protocols for "${title}".`
        });
        toast.show(`"${title}" vectorized and added to working memory context!`, 'success');
      }
    };
  }

  if (searchBtn && queryInput && resultsDisplay) {
    searchBtn.onclick = () => {
      const q = queryInput.value.trim() || 'vibration limits';
      resultsDisplay.innerHTML = `
        <div class="p-3 rounded-lg bg-surface-lowest border border-primary/30 text-xs">
          <div class="flex justify-between text-[10px] font-mono text-primary mb-1">
            <span>Query Match: "${q}"</span>
            <span class="font-bold text-emerald-400">Score: 0.962</span>
          </div>
          <p class="text-on-surface-variant text-[11px]">
            "Retrieved matching embeddings from active knowledge corpus. Context verified across 4 cross-linked nodes."
          </p>
        </div>
      `;
      toast.show('Vector search completed across 426 chunks!', 'info');
    };
  }
}
