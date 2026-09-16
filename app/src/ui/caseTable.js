/**
 * R2 Transaction Cases View Component (CD-02, CD-03)
 */
import { CONSEQUENCE_LABELS, RECORD_TYPES } from '../domain/constants.js';

export function renderCaseTable(cases = [], participants = [], onNewCaseClick) {
  const container = document.getElementById('tab-cases');
  if (!container) return;

  const getParticipantName = (ref) => {
    const p = participants.find(x => x.participant_ref === ref);
    return p ? p.full_name : ref;
  };

  container.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 16px; font-weight: 700;">Discovery Transaction Cases & Incident Logs (R2)</h2>
        <p style="font-size: 12px; color: var(--text-muted);">Reconstructed past transactions, difficult incidents, workarounds, and consequence evidence</p>
      </div>
      <div>
        <button id="btn-add-case-table" class="btn btn-primary btn-sm">+ Log Transaction Case (R2)</button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Case Ref</th>
            <th>Participant</th>
            <th>Classification</th>
            <th>Period</th>
            <th>Product & Quantity</th>
            <th>Outcome</th>
            <th>Failure Point / Workaround</th>
            <th>Consequence Evidence</th>
            <th>Evidence Status</th>
          </tr>
        </thead>
        <tbody>
          ${cases.length === 0 ? `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No transaction cases recorded yet. Click "+ Log Transaction Case" to reconstruct a case.</td></tr>` : ''}
          ${cases.map(c => `
            <tr>
              <td><strong>${c.case_ref}</strong></td>
              <td>
                <div style="font-weight: 600;">${getParticipantName(c.participant_ref)}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${c.participant_ref}</div>
              </td>
              <td><span style="font-size: 11px; font-weight: 600;">${c.case_type}</span></td>
              <td>${c.transaction_period}</td>
              <td>
                <div style="font-weight: 600;">${c.product_grade}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${c.quantity_unit}</div>
              </td>
              <td>
                <span class="badge ${c.actual_result === 'SUCCESSFUL_TRANSACTION' ? 'badge-eligible' : 'badge-ineligible'}">
                  ${c.actual_result}
                </span>
              </td>
              <td style="max-width: 250px;">
                <div style="font-size: 12px; color: var(--text-primary);">${c.failure_point || 'NO_RECALLED_FAILURE'}</div>
                ${c.current_workaround ? `<div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Workaround: ${c.current_workaround}</div>` : ''}
              </td>
              <td>
                <div style="font-weight: 600; font-size: 12px; color: ${c.consequence_type !== 'NONE' ? '#f87171' : 'var(--text-secondary)'};">
                  ${CONSEQUENCE_LABELS[c.consequence_type] || c.consequence_type}
                </div>
                ${c.consequence_amount ? `<div style="font-size: 11px; color: var(--text-muted);">${c.consequence_amount}</div>` : ''}
              </td>
              <td><span class="badge badge-pending">${c.evidence_status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  const btnAdd = document.getElementById('btn-add-case-table');
  if (btnAdd) btnAdd.onclick = onNewCaseClick;
}
