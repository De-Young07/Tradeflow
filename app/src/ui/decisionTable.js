/**
 * R4 Stage Decisions & Stage B Entry Gate View Component (CD-05)
 */
import { STAGE_DECISION_LABELS, CRITERIA_RESULTS } from '../domain/constants.js';

export function renderDecisionTable(decisions = [], onNewDecisionClick) {
  const container = document.getElementById('tab-decisions');
  if (!container) return;

  const getDecisionBadgeClass = (decision) => {
    switch (decision) {
      case 'PROCEED': return 'badge-eligible';
      case 'PAUSE': return 'badge-pending';
      case 'NARROW': return 'badge-info';
      case 'REJECT': return 'badge-ineligible';
      default: return 'badge-pending';
    }
  };

  const calculateGatePassed = (assessment = {}) => {
    const vals = Object.values(assessment);
    if (vals.length < 5) return false;
    return vals.every(v => v === CRITERIA_RESULTS.MET);
  };

  const countMetCriteria = (assessment = {}) => {
    return Object.values(assessment).filter(v => v === CRITERIA_RESULTS.MET).length;
  };

  container.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h2 style="font-size: 16px; font-weight: 700;">Experiment Cycle Stage Decisions & Entry Gate (R4)</h2>
        <p style="font-size: 12px; color: var(--text-muted);">Auditable decision records, supporting/contradictory evidence citations, and 5-criteria Stage B gate checks</p>
      </div>
      <div>
        <button id="btn-add-decision-table" class="btn btn-primary btn-sm">+ Record Stage Decision (R4)</button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Decision Ref</th>
            <th>Decision Point</th>
            <th>Stage Decision</th>
            <th>Stage B Gate Check</th>
            <th>Evidence Citations</th>
            <th>Evidence Rationale</th>
            <th>Limits & Gaps</th>
            <th>Next Operational Step</th>
            <th>Lead</th>
          </tr>
        </thead>
        <tbody>
          ${decisions.length === 0 ? `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No stage decisions recorded yet. Click "+ Record Stage Decision" to evaluate evidence or Stage B gate.</td></tr>` : ''}
          ${decisions.map(d => {
            const gatePassed = calculateGatePassed(d.gate_assessment);
            const metCount = countMetCriteria(d.gate_assessment);
            const suppRefs = d.supporting_case_refs || [];
            const contraRefs = d.contradictory_case_refs || [];

            return `
              <tr>
                <td>
                  <strong>${d.decision_ref}</strong>
                  <div style="font-size: 10px; color: var(--text-muted);">${d.decision_date ? d.decision_date.split('T')[0] : ''}</div>
                </td>
                <td><span style="font-size: 11px; font-weight: 600;">${d.decision_point}</span></td>
                <td>
                  <span class="badge ${getDecisionBadgeClass(d.stage_decision)}">
                    ${STAGE_DECISION_LABELS[d.stage_decision] || d.stage_decision}
                  </span>
                </td>
                <td>
                  <div style="font-size: 11px; font-weight: 600;">
                    <span class="badge ${gatePassed ? 'badge-eligible' : 'badge-ineligible'}">
                      ${gatePassed ? 'PASSED (5/5)' : `BLOCKED (${metCount}/5)`}
                    </span>
                  </div>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">
                    1:${d.gate_assessment?.unresolved_problem || '?'} | 
                    2:${d.gate_assessment?.upcoming_job || '?'} | 
                    3:${d.gate_assessment?.actionable_deadline || '?'} | 
                    4:${d.gate_assessment?.active_acceptance || '?'} | 
                    5:${d.gate_assessment?.feasible_responsibilities || '?'}
                  </div>
                </td>
                <td style="font-size: 11px;">
                  ${suppRefs.length > 0 ? `<div style="color: var(--success); font-weight: 600;">Supp: ${suppRefs.join(', ')}</div>` : ''}
                  ${contraRefs.length > 0 ? `<div style="color: var(--danger); font-weight: 600;">Contra: ${contraRefs.join(', ')}</div>` : ''}
                  ${suppRefs.length === 0 && contraRefs.length === 0 ? `<span style="color: var(--text-muted);">None cited</span>` : ''}
                </td>
                <td style="max-width: 200px;">
                  <div style="font-size: 12px; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${d.decision_rationale}">${d.decision_rationale}</div>
                </td>
                <td style="max-width: 180px; font-size: 11px;">
                  ${d.evidence_limits ? `<div style="color: var(--text-muted);">Limits: ${d.evidence_limits}</div>` : ''}
                  ${d.unresolved_questions ? `<div style="color: var(--warning);">Gaps: ${d.unresolved_questions}</div>` : ''}
                  ${!d.evidence_limits && !d.unresolved_questions ? `<span style="color: var(--text-muted);">-</span>` : ''}
                </td>
                <td style="font-size: 11px; max-width: 160px;">
                  ${d.next_step_action || '<span style="color: var(--text-muted);">-</span>'}
                </td>
                <td style="font-size: 11px;">
                  <strong>${d.decision_maker}</strong>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  const btnAdd = document.getElementById('btn-add-decision-table');
  if (btnAdd) btnAdd.onclick = onNewDecisionClick;
}
