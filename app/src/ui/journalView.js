import {label} from './workflow.js';
/**
 * Global R5 Evidence Journal Audit Trail Component
 */
export function renderJournalView(journalEntries = [], participants = []) {
  const container = document.getElementById('tab-journal');
  if (!container) return;

  const getParticipantName = (ref) => {
    const p = participants.find(x => x.participant_ref === ref);
    return p ? p.full_name : ref;
  };

  container.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 16px; font-weight: 700;">Interviews & contact evidence</h2>
        <p style="font-size: 12px; color: var(--text-muted);">Chronological event stream of all recruitment calls, checks, permissions, and refusals</p>
      </div>
      <div style="font-size: 12px; color: var(--text-secondary);">
        Total Journal Records: <strong>${journalEntries.length}</strong>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Participant</th>
            <th>Channel</th>
            <th>Event Type</th>
            <th>Check / Action Executed</th>
            <th>Response / Evidence</th>
            <th>Status</th>
            <th>Operator</th>
          </tr>
        </thead>
        <tbody>
          ${journalEntries.length === 0 ? `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No evidence yet. Open a person in Participants, then choose Log contact or Interview & evidence.</td></tr>` : ''}
          ${journalEntries.slice().sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)).map(j => `
            <tr>
              <td><strong>${j.journal_id}</strong></td>
              <td><span style="font-size: 11px; color: var(--text-muted);">${new Date(j.timestamp).toLocaleString()}</span></td>
              <td><strong>${getParticipantName(j.participant_ref)}</strong> <span style="font-size: 11px; color: var(--text-muted);">(${j.participant_ref})</span></td>
              <td>${label(j.channel)}</td>
              <td><span style="font-size: 11px; font-weight: 600;">${label(j.event_type)}</span></td>
              <td>${j.action_performed}</td>
              <td style="max-width: 300px; color: var(--text-secondary);">${j.raw_response}</td>
              <td><span class="badge badge-pending">${j.ai_provenance?.human_review ? 'Human-reviewed · ' : ''}${label(j.evidence_status)}</span></td>
              <td>${j.operator_id}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
