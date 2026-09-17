/**
 * Discovery Intelligence Query Component (Phase AI-8)
 * Enables operators to run qualitative research queries across approved R5 discovery evidence.
 * Enforces strict grounding: ONLY human-approved or corrected evidence is included in the query context.
 */

export function renderDiscoveryIntelligence(containerId = 'tab-intelligence', journalEntries = [], participants = [], onRunQuery) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const approvedEntries = journalEntries.filter(j => {
    const state = j.ai_provenance?.human_review?.review_state;
    return state === 'APPROVED' || state === 'CORRECTED';
  });

  container.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 16px; font-weight: 700; color: var(--primary);">🧠 Discovery insights</h2>
        <p style="font-size: 12px; color: var(--text-muted);">Qualitative research synthesis grounded exclusively in human-approved discovery evidence</p>
      </div>
      <div>
        <span class="badge badge-eligible">${approvedEntries.length} Approved Records In Knowledge Base</span>
      </div>
    </div>

    <!-- Query Input Bar -->
    <div style="background-color: var(--bg-card); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
      <div class="form-group full-width" style="margin-bottom: 10px;">
        <label for="query-intelligence-input" style="font-weight: 700; font-size: 12px;">Ask a Discovery Research Question</label>
        <div style="display: flex; gap: 8px; margin-top: 4px;">
          <input type="text" id="query-intelligence-input" class="form-control" placeholder="e.g. What problems have Dikko tomato producers repeatedly reported regarding transport or sales?" style="font-size: 12px;">
          <button id="btn-run-intelligence-query" class="btn btn-primary" style="white-space: nowrap;">Review evidence patterns</button>
        </div>
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
        <button class="btn btn-ghost btn-sm quick-query-chip" data-q="What transport delays or spoilage problems have producers reported?">Transport & Spoilage</button>
        <button class="btn btn-ghost btn-sm quick-query-chip" data-q="What prices per basket were reported by retail buyers versus producers?">Price Comparisons</button>
        <button class="btn btn-ghost btn-sm quick-query-chip" data-q="Which interviews contain explicit contradictions or open questions?">Contradictions & Gaps</button>
        <button class="btn btn-ghost btn-sm quick-query-chip" data-q="What existing workarounds do participants currently use?">Current Workarounds</button>
      </div>
    </div>

    <!-- Answer & Citations Output Container -->
    <div id="intelligence-results-container" style="background-color: var(--bg-input); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color); min-height: 180px;">
      <div style="color: var(--text-muted); font-size: 12px; text-align: center; padding-top: 40px;">
        Select a sample question above or enter a research query to synthesize approved discovery records.
      </div>
    </div>
  `;

  const inputEl = document.getElementById('query-intelligence-input');
  const btnRun = document.getElementById('btn-run-intelligence-query');
  const resultsContainer = document.getElementById('intelligence-results-container');

  const executeQuery = async (queryText) => {
    if (!queryText || queryText.trim() === '') return;
    resultsContainer.innerHTML = `<div style="font-size: 12px; color: var(--primary); padding: 20px; text-align: center;">Synthesizing approved evidence records...</div>`;

    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          journalEntries: journalEntries,
          participants: participants
        })
      });

      const resData = await response.json();

      resultsContainer.innerHTML = `
        <div style="font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
          Synthesis Result (${resData.approved_evidence_count} Approved Records Examined)
        </div>
        <div style="font-size: 12px; color: var(--text-primary); line-height: 1.6; white-space: pre-line; background-color: var(--bg-card); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 14px;">
          ${resData.answer}
        </div>

        <h4 style="font-size: 12px; font-weight: 700; margin-bottom: 8px; color: var(--text-secondary);">Source Evidence Citations:</h4>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${(resData.citations || []).map(c => `
            <div style="font-size: 11px; background-color: var(--bg-card); padding: 8px 10px; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
              <strong>${c.participant_name} (${c.participant_ref})</strong> | Ref: <code>${c.journal_id}</code>
              <div style="color: var(--text-muted); margin-top: 2px;">${c.summary}</div>
            </div>
          `).join('') || '<div style="font-size: 11px; color: var(--text-muted);">No direct citations available.</div>'}
        </div>
      `;
    } catch (err) {
      resultsContainer.innerHTML = `<div style="color: var(--danger); font-size: 12px; padding: 10px;">Query error: ${err.message}</div>`;
    }
  };

  if (btnRun) btnRun.onclick = () => executeQuery(inputEl.value);

  document.querySelectorAll('.quick-query-chip').forEach(chip => {
    chip.onclick = () => {
      const q = chip.getAttribute('data-q');
      inputEl.value = q;
      executeQuery(q);
    };
  });
}
