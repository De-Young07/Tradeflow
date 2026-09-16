/**
 * R2 Transaction Case Intake Form Modal (CD-02, CD-03)
 */
import { createR2Case } from '../domain/models.js';
import { validateR2Case } from '../domain/validation.js';
import { CASE_TYPES, TRANSACTION_RESULTS, CONSEQUENCE_TYPES, EVIDENCE_STATUS, RECORD_TYPES } from '../domain/constants.js';

export function renderCaseModal(onSave, participants = [], defaultParticipantRef = '', existingCasesCount = 0) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const defaultRef = `TF-CD02-C${String(existingCasesCount + 1).padStart(3, '0')}`;

  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Reconstruct Transaction Case (CD-02 / R2)</h2>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body">
        <form id="form-case" onsubmit="return false;">
          <div class="form-grid">
            <div class="form-group">
              <label for="input-case-ref">Case Reference *</label>
              <input type="text" id="input-case-ref" class="form-control" value="${defaultRef}" required>
            </div>

            <div class="form-group">
              <label for="input-case-participant">Participant *</label>
              <select id="input-case-participant" class="form-control">
                ${participants.map(p => `
                  <option value="${p.participant_ref}" ${p.participant_ref === defaultParticipantRef ? 'selected' : ''}>
                    ${p.full_name} (${p.participant_ref})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="form-group">
              <label for="input-case-type">Case Classification *</label>
              <select id="input-case-type" class="form-control">
                <option value="${CASE_TYPES.RECENT_TRANSACTION}">Recent Transaction (Working Method)</option>
                <option value="${CASE_TYPES.DIFFICULT_INCIDENT}">Difficult Transaction Incident</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-transaction-period">Transaction Date / Period *</label>
              <input type="text" id="input-transaction-period" class="form-control" placeholder="e.g. August 2026 Peak Harvest" required>
            </div>

            <div class="form-group">
              <label for="input-product-grade">Product & Grade *</label>
              <input type="text" id="input-product-grade" class="form-control" placeholder="e.g. Grade A Red Ripe Tomatoes" required>
            </div>

            <div class="form-group">
              <label for="input-quantity-unit">Quantity & Unit *</label>
              <input type="text" id="input-quantity-unit" class="form-control" placeholder="e.g. 50 Baskets, 2 Tons" required>
            </div>

            <div class="form-group">
              <label for="input-counterparty-desc">Counterparty Description</label>
              <input type="text" id="input-counterparty-desc" class="form-control" placeholder="e.g. Wholesale buyer from Suleja market">
            </div>

            <div class="form-group">
              <label for="input-payment-terms">Timing & Payment Terms</label>
              <input type="text" id="input-payment-terms" class="form-control" placeholder="e.g. Immediate cash on collection, 3-day credit">
            </div>

            <div class="form-group">
              <label for="input-actual-result">Transaction Outcome *</label>
              <select id="input-actual-result" class="form-control">
                <option value="${TRANSACTION_RESULTS.SUCCESSFUL_TRANSACTION}">SUCCESSFUL_TRANSACTION</option>
                <option value="${TRANSACTION_RESULTS.FAILED_TRANSACTION}">FAILED_TRANSACTION</option>
                <option value="${TRANSACTION_RESULTS.PARTIAL_SUCCESS}">PARTIAL_SUCCESS</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-consequence-type">Consequence Type (CD-03) *</label>
              <select id="input-consequence-type" class="form-control">
                <option value="${CONSEQUENCE_TYPES.NONE}">NONE (Working Method)</option>
                <option value="${CONSEQUENCE_TYPES.PRICE_DISCOUNT}">PRICE_DISCOUNT (Forced Markdown)</option>
                <option value="${CONSEQUENCE_TYPES.PRODUCE_SPOILAGE}">PRODUCE_SPOILAGE (Rejected/Spoiled batch)</option>
                <option value="${CONSEQUENCE_TYPES.PAYMENT_DELAY}">PAYMENT_DELAY (Unpaid/Delayed debt)</option>
                <option value="${CONSEQUENCE_TYPES.CUSTOMER_LOSS}">CUSTOMER_LOSS (Lost customer)</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="input-failure-point">Failure Point Description</label>
              <textarea id="input-failure-point" class="form-control" rows="2" placeholder="Record precise step where failure occurred (or 'NO_RECALLED_FAILURE')..."></textarea>
            </div>

            <div class="form-group full-width">
              <label for="input-steps-sequence">Sequence of Steps & Decision-Makers</label>
              <textarea id="input-steps-sequence" class="form-control" rows="2" placeholder="Describe workflow from harvest/order commitment to payment..."></textarea>
            </div>

            <div class="form-group">
              <label for="input-current-workaround">Current Workaround</label>
              <input type="text" id="input-current-workaround" class="form-control" placeholder="What candidate did to manage the failure...">
            </div>

            <div class="form-group">
              <label for="input-consequence-amount">Consequence Amount & Currency</label>
              <input type="text" id="input-consequence-amount" class="form-control" placeholder="e.g. ₦40,000 lost revenue, Unknown">
            </div>

            <div class="form-group">
              <label for="input-evidence-status">Claim Evidence Status *</label>
              <select id="input-evidence-status" class="form-control">
                <option value="${EVIDENCE_STATUS.REPORTED}">REPORTED (Stated by candidate)</option>
                <option value="${EVIDENCE_STATUS.ESTIMATED}">ESTIMATED (Calculated approx)</option>
                <option value="${EVIDENCE_STATUS.CHECKED}">CHECKED (Verified against receipt/source)</option>
                <option value="${EVIDENCE_STATUS.UNKNOWN}">UNKNOWN (Missing/unconfirmed)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-case-record-type">Record Classification *</label>
              <select id="input-case-record-type" class="form-control">
                <option value="${RECORD_TYPES.FIELD}">FIELD (Real Discovery Data)</option>
                <option value="${RECORD_TYPES.TEST}">TEST (Synthetic Test Case)</option>
              </select>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button id="btn-cancel-modal" class="btn btn-ghost">Cancel</button>
        <button id="btn-save-case" class="btn btn-primary">Save Transaction Case (R2)</button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('btn-cancel-modal').onclick = closeModal;

  document.getElementById('btn-save-case').onclick = () => {
    const caseData = createR2Case({
      case_ref: document.getElementById('input-case-ref').value,
      participant_ref: document.getElementById('input-case-participant').value,
      case_type: document.getElementById('input-case-type').value,
      transaction_period: document.getElementById('input-transaction-period').value,
      product_grade: document.getElementById('input-product-grade').value,
      quantity_unit: document.getElementById('input-quantity-unit').value,
      counterparty_desc: document.getElementById('input-counterparty-desc').value,
      timing_payment_terms: document.getElementById('input-payment-terms').value,
      actual_result: document.getElementById('input-actual-result').value,
      consequence_type: document.getElementById('input-consequence-type').value,
      failure_point: document.getElementById('input-failure-point').value,
      steps_sequence: document.getElementById('input-steps-sequence').value,
      current_workaround: document.getElementById('input-current-workaround').value,
      consequence_amount: document.getElementById('input-consequence-amount').value,
      evidence_status: document.getElementById('input-evidence-status').value,
      record_type: document.getElementById('input-case-record-type').value
    });

    const val = validateR2Case(caseData);
    if (!val.isValid) {
      alert(`Validation Errors:\n• ${val.errors.join('\n• ')}`);
      return;
    }

    onSave(caseData);
    closeModal();
  };
}
