/**
 * R4 Stage Decision Intake & Stage B Gate Evaluator Modal (CD-05)
 */
import { createR4Decision } from '../domain/models.js';
import { validateR4Decision } from '../domain/validation.js';
import { DECISION_POINTS, STAGE_DECISIONS, CRITERIA_RESULTS, RECORD_TYPES } from '../domain/constants.js';

export function renderDecisionModal(onSave, participants = [], cases = [], existingDecisionsCount = 0) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const defaultRef = `TF-CD05-D${String(existingDecisionsCount + 1).padStart(3, '0')}`;

  modalContainer.innerHTML = `
    <div class="modal-content" style="max-width: 850px;">
      <div class="modal-header">
        <h2>Record Experiment Stage Decision & Evaluate Gate (CD-05 / R4)</h2>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body">
        <form id="form-decision" onsubmit="return false;">
          <div class="form-grid">
            <div class="form-group">
              <label for="input-decision-ref">Decision Reference *</label>
              <input type="text" id="input-decision-ref" class="form-control" value="${defaultRef}" required>
            </div>

            <div class="form-group">
              <label for="input-decision-point">Decision Point Stage *</label>
              <select id="input-decision-point" class="form-control">
                <option value="${DECISION_POINTS.DISCOVERY_REVIEW}">Discovery Evidence Review</option>
                <option value="${DECISION_POINTS.STAGE_B_GATE}">Stage B Manual Test Entry Gate</option>
                <option value="${DECISION_POINTS.FINAL_REVIEW}">Experiment Cycle Final Review</option>
              </select>
            </div>

            <!-- Stage B Gate Evaluator Widget -->
            <div class="form-group full-width" style="background-color: var(--bg-input); border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-md);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: var(--primary); font-size: 13px;">Stage B Entry Gate Assessment (5 Mandatory Criteria)</strong>
                <span id="gate-eval-badge" class="badge badge-ineligible">GATE BLOCKED (0/5)</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 6px 10px; border-radius: var(--radius-sm);">
                  <span>1. Real, documented, unresolved transaction failure (CD-02/03)</span>
                  <select class="gate-crit-select form-control" id="crit-unresolved" style="width: 120px; padding: 2px 6px; font-size: 11px;">
                    <option value="${CRITERIA_RESULTS.UNKNOWN}">UNKNOWN</option>
                    <option value="${CRITERIA_RESULTS.MET}">MET ✓</option>
                    <option value="${CRITERIA_RESULTS.UNMET}">UNMET ✗</option>
                  </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 6px 10px; border-radius: var(--radius-sm);">
                  <span>2. Concrete upcoming sale or purchase job identified (CD-04)</span>
                  <select class="gate-crit-select form-control" id="crit-upcoming" style="width: 120px; padding: 2px 6px; font-size: 11px;">
                    <option value="${CRITERIA_RESULTS.UNKNOWN}">UNKNOWN</option>
                    <option value="${CRITERIA_RESULTS.MET}">MET ✓</option>
                    <option value="${CRITERIA_RESULTS.UNMET}">UNMET ✗</option>
                  </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 6px 10px; border-radius: var(--radius-sm);">
                  <span>3. Actionable deadline established before commitment (CD-04)</span>
                  <select class="gate-crit-select form-control" id="crit-deadline" style="width: 120px; padding: 2px 6px; font-size: 11px;">
                    <option value="${CRITERIA_RESULTS.UNKNOWN}">UNKNOWN</option>
                    <option value="${CRITERIA_RESULTS.MET}">MET ✓</option>
                    <option value="${CRITERIA_RESULTS.UNMET}">UNMET ✗</option>
                  </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 6px 10px; border-radius: var(--radius-sm);">
                  <span>4. Participant actively requested/accepted specific bounded help (R5)</span>
                  <select class="gate-crit-select form-control" id="crit-acceptance" style="width: 120px; padding: 2px 6px; font-size: 11px;">
                    <option value="${CRITERIA_RESULTS.UNKNOWN}">UNKNOWN</option>
                    <option value="${CRITERIA_RESULTS.MET}">MET ✓</option>
                    <option value="${CRITERIA_RESULTS.UNMET}">UNMET ✗</option>
                  </select>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background-color: var(--bg-card); padding: 6px 10px; border-radius: var(--radius-sm);">
                  <span>5. Required task responsibilities are within team capability (CD-05)</span>
                  <select class="gate-crit-select form-control" id="crit-feasible" style="width: 120px; padding: 2px 6px; font-size: 11px;">
                    <option value="${CRITERIA_RESULTS.UNKNOWN}">UNKNOWN</option>
                    <option value="${CRITERIA_RESULTS.MET}">MET ✓</option>
                    <option value="${CRITERIA_RESULTS.UNMET}">UNMET ✗</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Stage Decision Output Selector -->
            <div class="form-group full-width">
              <label for="input-stage-decision" style="font-size: 13px; font-weight: 700;">Stage Decision Output *</label>
              <select id="input-stage-decision" class="form-control">
                <option value="${STAGE_DECISIONS.PAUSE}">PAUSE (Pause testing pending missing evidence/facts)</option>
                <option value="${STAGE_DECISIONS.NARROW}">NARROW (Narrow target commodity, area, or buyer scope)</option>
                <option value="${STAGE_DECISIONS.REJECT}">REJECT (Reject hypothesis for tested segment)</option>
                <option value="${STAGE_DECISIONS.PROCEED}" disabled>PROCEED to Stage B (Requires 5/5 Gate Criteria MET)</option>
              </select>
            </div>

            <!-- Evidence Citations -->
            <div class="form-group">
              <label for="select-supporting-refs">Supporting Case References (R1 / R2)</label>
              <select id="select-supporting-refs" class="form-control" multiple style="height: 80px;">
                ${participants.map(p => `<option value="${p.participant_ref}">${p.participant_ref}: ${p.full_name}</option>`).join('')}
                ${cases.map(c => `<option value="${c.case_ref}">${c.case_ref}: ${c.product_grade}</option>`).join('')}
              </select>
              <small style="font-size: 10px; color: var(--text-muted);">Hold Ctrl/Cmd to select multiple supporting cases.</small>
            </div>

            <div class="form-group">
              <label for="select-contradictory-refs">Contradictory / Refusal References (R2)</label>
              <select id="select-contradictory-refs" class="form-control" multiple style="height: 80px;">
                ${cases.map(c => `<option value="${c.case_ref}">${c.case_ref}: ${c.consequence_type}</option>`).join('')}
              </select>
              <small style="font-size: 10px; color: var(--text-muted);">Select cases showing working alternatives or refusals.</small>
            </div>

            <!-- Rationale & Limits -->
            <div class="form-group full-width">
              <label for="input-decision-rationale">Evidence-Based Rationale *</label>
              <textarea id="input-decision-rationale" class="form-control" rows="2" placeholder="Record explicit justification grounded in discovery evidence..." required></textarea>
            </div>

            <div class="form-group">
              <label for="input-evidence-limits">Evidence Limits & Boundaries</label>
              <textarea id="input-evidence-limits" class="form-control" rows="2" placeholder="State explicit limits of discovery evidence (e.g. initial Dikko sample only)..."></textarea>
            </div>

            <div class="form-group">
              <label for="input-unresolved-questions">Unresolved Questions / Gaps</label>
              <textarea id="input-unresolved-questions" class="form-control" rows="2" placeholder="List missing facts or open hypotheses..."></textarea>
            </div>

            <div class="form-group">
              <label for="input-next-step">Next Operational Step</label>
              <input type="text" id="input-next-step" class="form-control" placeholder="e.g. Conduct direct phone calls to verify buyer spending authority">
            </div>

            <div class="form-group">
              <label for="input-decision-maker">Decision Maker / Lead *</label>
              <input type="text" id="input-decision-maker" class="form-control" value="TradeFlow Experiment Lead" required>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button id="btn-cancel-modal" class="btn btn-ghost">Cancel</button>
        <button id="btn-save-decision" class="btn btn-primary">Save Stage Decision (R4)</button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  // Live Gate Evaluator Update
  const updateGateEvaluation = () => {
    const c1 = document.getElementById('crit-unresolved').value;
    const c2 = document.getElementById('crit-upcoming').value;
    const c3 = document.getElementById('crit-deadline').value;
    const c4 = document.getElementById('crit-acceptance').value;
    const c5 = document.getElementById('crit-feasible').value;

    const metCount = [c1, c2, c3, c4, c5].filter(x => x === CRITERIA_RESULTS.MET).length;
    const gatePassed = metCount === 5;

    const badge = document.getElementById('gate-eval-badge');
    const proceedOption = document.querySelector('#input-stage-decision option[value="PROCEED"]');
    const decisionSelect = document.getElementById('input-stage-decision');

    if (gatePassed) {
      badge.textContent = `GATE PASSED (5/5 Criteria Met) ✓`;
      badge.className = 'badge badge-eligible';
      proceedOption.removeAttribute('disabled');
    } else {
      badge.textContent = `GATE BLOCKED (${metCount}/5 Met)`;
      badge.className = 'badge badge-ineligible';
      proceedOption.setAttribute('disabled', 'true');
      if (decisionSelect.value === STAGE_DECISIONS.PROCEED) {
        decisionSelect.value = STAGE_DECISIONS.PAUSE;
      }
    }

    return { c1, c2, c3, c4, c5, gatePassed };
  };

  document.querySelectorAll('.gate-crit-select').forEach(sel => {
    sel.addEventListener('change', updateGateEvaluation);
  });

  updateGateEvaluation();

  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('btn-cancel-modal').onclick = closeModal;

  document.getElementById('btn-save-decision').onclick = () => {
    const gateEval = updateGateEvaluation();

    const getSelectedValues = (selectEl) => {
      return Array.from(selectEl.selectedOptions).map(opt => opt.value);
    };

    const decisionData = createR4Decision({
      decision_ref: document.getElementById('input-decision-ref').value,
      record_type: RECORD_TYPES.FIELD,
      decision_point: document.getElementById('input-decision-point').value,
      stage_decision: document.getElementById('input-stage-decision').value,
      gate_assessment: {
        unresolved_problem: gateEval.c1,
        upcoming_job: gateEval.c2,
        actionable_deadline: gateEval.c3,
        active_acceptance: gateEval.c4,
        feasible_responsibilities: gateEval.c5
      },
      supporting_case_refs: getSelectedValues(document.getElementById('select-supporting-refs')),
      contradictory_case_refs: getSelectedValues(document.getElementById('select-contradictory-refs')),
      decision_rationale: document.getElementById('input-decision-rationale').value,
      evidence_limits: document.getElementById('input-evidence-limits').value,
      unresolved_questions: document.getElementById('input-unresolved-questions').value,
      next_step_action: document.getElementById('input-next-step').value,
      decision_maker: document.getElementById('input-decision-maker').value
    });

    const val = validateR4Decision(decisionData);
    if (!val.isValid) {
      alert(`Validation Errors:\n• ${val.errors.join('\n• ')}`);
      return;
    }

    onSave(decisionData);
    closeModal();
  };
}
