/**
 * R3 Upcoming Job & Baseline Brief Intake Form Modal (CD-04)
 */
import { createR3Job } from '../domain/models.js';
import { validateR3Job } from '../domain/validation.js';
import { JOB_TYPES, BENEFICIARY_PAYER_STATUS, RECORD_TYPES } from '../domain/constants.js';

export function renderJobModal(onSave, participants = [], cases = [], defaultParticipantRef = '', existingJobsCount = 0) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const defaultRef = `TF-CD04-J${String(existingJobsCount + 1).padStart(3, '0')}`;

  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Record Next Actionable Job & Fallback Baseline (CD-04 / R3)</h2>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body">
        <form id="form-job" onsubmit="return false;">
          <div class="form-grid">
            <div class="form-group">
              <label for="input-job-ref">Job Reference *</label>
              <input type="text" id="input-job-ref" class="form-control" value="${defaultRef}" required>
            </div>

            <div class="form-group">
              <label for="input-job-participant">Participant *</label>
              <select id="input-job-participant" class="form-control">
                ${participants.map(p => `
                  <option value="${p.participant_ref}" ${p.participant_ref === defaultParticipantRef ? 'selected' : ''}>
                    ${p.full_name} (${p.participant_ref})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="input-job-case">Linked Discovery Case (R2)</label>
              <select id="input-job-case" class="form-control">
                <option value="">None (Standalone Job Discovery)</option>
                ${cases.map(c => `
                  <option value="${c.case_ref}">${c.case_ref}: ${c.product_grade} (${c.transaction_period})</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="input-job-type">Job Classification *</label>
              <select id="input-job-type" class="form-control">
                <option value="${JOB_TYPES.NEXT_SALE}">Upcoming Sale (Producer Side)</option>
                <option value="${JOB_TYPES.NEXT_PURCHASE}">Upcoming Purchase (Retail Buyer Side)</option>
                <option value="${JOB_TYPES.NO_UPCOMING_JOB}">No Upcoming Job / Unknown</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="input-job-requirements">Job Requirements (Grade, Quantity, Target Price, Timing) *</label>
              <textarea id="input-job-requirements" class="form-control" rows="2" placeholder="Describe exact requirements e.g. Harvest of 70 baskets Grade A Red Ripe Tomatoes, target ₦4,000/basket..." required></textarea>
            </div>

            <div class="form-group full-width" style="background-color: rgba(59, 130, 246, 0.1); padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--primary);">
              <label for="input-original-plan-fallback" style="color: var(--primary); font-weight: 700;">Original Plan / Fallback Baseline * (Required for MT-01 Baseline)</label>
              <textarea id="input-original-plan-fallback" class="form-control" rows="2" placeholder="Record what candidate will do if TradeFlow does NOT intervene (e.g. sell to roadside middleman at spot discount)..." required></textarea>
            </div>

            <div class="form-group">
              <label for="input-last-actionable">Last Actionable Date / Time (Deadline) *</label>
              <input type="datetime-local" id="input-last-actionable" class="form-control" required>
            </div>

            <div class="form-group">
              <label for="input-stock-control-role">Stock Control Role</label>
              <input type="text" id="input-stock-control-role" class="form-control" placeholder="Who controls harvest/stock decisions...">
            </div>

            <div class="form-group">
              <label for="input-purchase-approval-role">Purchase Approval Role</label>
              <input type="text" id="input-purchase-approval-role" class="form-control" placeholder="Who approves bulk purchasing...">
            </div>

            <div class="form-group">
              <label for="input-spending-authority-role">Spending Authority Role</label>
              <input type="text" id="input-spending-authority-role" class="form-control" placeholder="Who controls procurement budget...">
            </div>

            <div class="form-group">
              <label for="input-payer-status">Beneficiary / Payer Status</label>
              <input type="text" id="input-payer-status" class="form-control" value="${BENEFICIARY_PAYER_STATUS.UNKNOWN}" readonly style="opacity: 0.7;">
              <small style="font-size: 11px; color: var(--text-muted);">Payer status remains explicitly UNKNOWN in Stage A discovery.</small>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button id="btn-cancel-modal" class="btn btn-ghost">Cancel</button>
        <button id="btn-save-job" class="btn btn-primary">Save Upcoming Job Brief (R3)</button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('btn-cancel-modal').onclick = closeModal;

  document.getElementById('btn-save-job').onclick = () => {
    const rawDate = document.getElementById('input-last-actionable').value;
    const isoDate = rawDate ? new Date(rawDate).toISOString() : '';

    const jobData = createR3Job({
      job_ref: document.getElementById('input-job-ref').value,
      participant_ref: document.getElementById('input-job-participant').value,
      case_ref: document.getElementById('input-job-case').value,
      job_type: document.getElementById('input-job-type').value,
      job_requirements: document.getElementById('input-job-requirements').value,
      original_plan_fallback: document.getElementById('input-original-plan-fallback').value,
      last_actionable_datetime: isoDate,
      stock_control_role: document.getElementById('input-stock-control-role').value,
      purchase_approval_role: document.getElementById('input-purchase-approval-role').value,
      spending_authority_role: document.getElementById('input-spending-authority-role').value
    });

    const val = validateR3Job(jobData);
    if (!val.isValid) {
      alert(`Validation Errors:\n• ${val.errors.join('\n• ')}`);
      return;
    }

    onSave(jobData);
    closeModal();
  };
}
