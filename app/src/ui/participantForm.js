import { label } from './workflow.js';
import { showErrors } from './ux.js';
/**
 * Candidate Intake Form & Decision Support System UI
 */
import { evaluateQualification } from '../domain/qualification.js';
import { validateR1Participant, detectDuplicateCandidates } from '../domain/validation.js';
import { createR1Participant } from '../domain/models.js';
import {
  CLAIMED_ROLES,
  REFERRAL_TYPES,
  ELIGIBILITY_STATUS,
  CONTACT_OUTCOMES,
  EXCLUSION_REASONS,
  RECORD_TYPES,
  TARGET_SCOPE
} from '../domain/constants.js';

export function renderParticipantModal(onSave, existingParticipants = [], editParticipant = null) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const isEdit = !!editParticipant;
  const initialData = editParticipant || createR1Participant({
    participant_ref: `TF-CD01-P${String(existingParticipants.length + 1).padStart(3, '0')}`,
    record_type: RECORD_TYPES.FIELD
  });

  modalContainer.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>${isEdit ? 'Edit participant details' : 'Add Potential Participant'}</h2>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body">
        <form id="form-candidate" onsubmit="return false;">
          <div class="form-grid">
            <!-- Basic Info -->
            <div class="form-group">
              <label for="input-ref">Participant Ref ID *</label>
              <input type="text" id="input-ref" class="form-control" value="${initialData.participant_ref}" ${isEdit ? 'readonly' : ''} required>
            </div>

            <div class="form-group">
              <label for="input-record-type">Record Classification *</label>
              <select id="input-record-type" class="form-control">
                <option value="${RECORD_TYPES.FIELD}" ${initialData.record_type === RECORD_TYPES.FIELD ? 'selected' : ''}>FIELD (Real Discovery Data)</option>
                <option value="${RECORD_TYPES.TEST}" ${initialData.record_type === RECORD_TYPES.TEST ? 'selected' : ''}>TEST (Synthetic Test Record)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-name">Name / participant label *</label>
              <input type="text" id="input-name" class="form-control" value="${initialData.full_name}" placeholder="e.g. Mallam Garba Dikko" required>
            </div>

            <div class="form-group">
              <label for="input-phone">Phone / Reach Contact *</label>
              <input type="text" id="input-phone" class="form-control" value="${initialData.phone_contact}" placeholder="e.g. 08031234567" required>
            </div>

            <!-- Role & Scope -->
            <div class="form-group">
              <label for="input-role">What do they do? *</label>
              <select id="input-role" class="form-control">
                <option value="${CLAIMED_ROLES.PRODUCER}" ${initialData.claimed_role === CLAIMED_ROLES.PRODUCER ? 'selected' : ''}>Actual Tomato Producer</option>
                <option value="${CLAIMED_ROLES.RETAIL_PURCHASER}" ${initialData.claimed_role === CLAIMED_ROLES.RETAIL_PURCHASER ? 'selected' : ''}>Retail Bulk Tomato Purchaser</option>
                <option value="${CLAIMED_ROLES.RETAIL_APPROVER}" ${initialData.claimed_role === CLAIMED_ROLES.RETAIL_APPROVER ? 'selected' : ''}>Retail Purchase Approver / Budget Owner</option>
                <option value="${CLAIMED_ROLES.TRADER_REFERRAL}" ${initialData.claimed_role === CLAIMED_ROLES.TRADER_REFERRAL ? 'selected' : ''}>Existing Trader / Referral Contact</option>
                <option value="${CLAIMED_ROLES.OTHER}" ${initialData.claimed_role === CLAIMED_ROLES.OTHER ? 'selected' : ''}>Other Non-Qualifying Contact</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-commodity">Commodity *</label>
              <input type="text" id="input-commodity" class="form-control" value="${initialData.commodity || TARGET_SCOPE.COMMODITY}" required>
            </div>

            <!-- Structured Geography -->
            <div class="form-group">
              <label for="input-state">State *</label>
              <input type="text" id="input-state" class="form-control" value="${initialData.geography?.state || TARGET_SCOPE.STATE}" required>
            </div>

            <div class="form-group">
              <label for="input-town">Town / Market Area *</label>
              <input type="text" id="input-town" class="form-control" value="${initialData.geography?.town || TARGET_SCOPE.TOWN}" placeholder="e.g. Dikko" required>
            </div>

            <!-- Referral -->
            <div class="form-group">
              <label for="input-referral-type">Referral Type *</label>
              <select id="input-referral-type" class="form-control">
                <option value="${REFERRAL_TYPES.DIRECT_FIELD}" ${initialData.referral_type === REFERRAL_TYPES.DIRECT_FIELD ? 'selected' : ''}>Direct Field Outreach</option>
                <option value="${REFERRAL_TYPES.EXISTING_TRADER}" ${initialData.referral_type === REFERRAL_TYPES.EXISTING_TRADER ? 'selected' : ''}>Existing Trader Referral (e.g. Rashsidat)</option>
                <option value="${REFERRAL_TYPES.COMMUNITY_REFERRAL}" ${initialData.referral_type === REFERRAL_TYPES.COMMUNITY_REFERRAL ? 'selected' : ''}>Community Referral</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-referral-source">Referral Source Name</label>
              <input type="text" id="input-referral-source" class="form-control" value="${initialData.referral_source}" placeholder="e.g. Rashsidat">
            </div>

            <!-- Retail & Authority Checks -->
            <div class="form-group full-width" style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 4px;">
              <label style="font-size: 13px; font-weight: 700; color: var(--text-primary);">Can they make the relevant decision?</label>
            </div>

            <div class="form-group full-width" style="display: flex; gap: 20px;">
              <label><input type="checkbox" id="chk-stock" ${initialData.authority_info?.stock_control ? 'checked' : ''}> Do they control tomato stock?</label>
              <label><input type="checkbox" id="chk-approval" ${initialData.authority_info?.purchase_approval ? 'checked' : ''}> Can they approve bulk purchases?</label>
              <label><input type="checkbox" id="chk-spending" ${initialData.authority_info?.spending_authority ? 'checked' : ''}> Can they authorize spending?</label>
            </div>

            <div class="form-group">
              <label for="input-verification-level">How did you check their role and authority? *</label>
              <select id="input-verification-level" class="form-control">
                <option value="NOT_VERIFIED" ${initialData.authority_info?.verification_level === 'NOT_VERIFIED' ? 'selected' : ''}>Not checked yet</option>
                <option value="CHECKED" ${initialData.authority_info?.verification_level === 'CHECKED' ? 'selected' : ''}>Checked directly by phone</option>
                <option value="VERIFIED" ${initialData.authority_info?.verification_level === 'VERIFIED' ? 'selected' : ''}>Checked in person / against a document</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-contact-outcome">Latest contact outcome *</label>
              <select id="input-contact-outcome" class="form-control">
                <option value="${CONTACT_OUTCOMES.NOT_CONTACTED}" ${initialData.contact_outcome === CONTACT_OUTCOMES.NOT_CONTACTED ? 'selected' : ''}>NOT_CONTACTED</option>
                <option value="${CONTACT_OUTCOMES.NO_RESPONSE}" ${initialData.contact_outcome === CONTACT_OUTCOMES.NO_RESPONSE ? 'selected' : ''}>NO_RESPONSE</option>
                <option value="${CONTACT_OUTCOMES.REACHED}" ${initialData.contact_outcome === CONTACT_OUTCOMES.REACHED ? 'selected' : ''}>REACHED</option>
                <option value="${CONTACT_OUTCOMES.AGREED}" ${initialData.contact_outcome === CONTACT_OUTCOMES.AGREED ? 'selected' : ''}>AGREED</option>
                <option value="${CONTACT_OUTCOMES.DECLINED}" ${initialData.contact_outcome === CONTACT_OUTCOMES.DECLINED ? 'selected' : ''}>DECLINED</option>
              </select>
            </div>
          </div>

          <!-- Duplicate Candidate Warning Box -->
          <div id="duplicate-warning-box" style="display: none; background-color: var(--warning-bg); border: 1px solid var(--warning); padding: 10px; border-radius: var(--radius-md); margin-top: 12px; font-size: 12px; color: #fbbf24;">
            <strong>⚠️ Potential Duplicate Candidate Detected!</strong>
            <div id="duplicate-reasons-list" style="margin-top: 4px;"></div>
          </div>

          <!-- Real-Time Decision Support Panel -->
          <div id="decision-support-panel" class="recommendation-box status-PENDING_VERIFICATION">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <strong>Do they fit our discovery group?</strong>
              <span id="rec-status-badge" class="badge badge-pending">PENDING_VERIFICATION</span>
            </div>
            <div id="rec-explanation" style="font-size: 12px; margin-top: 6px; color: var(--text-secondary);">
              Evaluating qualification criteria against CD-01 locked discovery rules...
            </div>
            <ul id="rec-failed-list" style="margin-top: 6px; padding-left: 18px; font-size: 12px; color: #f87171;"></ul>
          </div>

          <!-- Operator Final Eligibility Decision -->
          <div class="form-grid" style="margin-top: 16px;">
            <div class="form-group">
              <label for="input-operator-eligibility">Your qualification decision *</label>
              <select id="input-operator-eligibility" class="form-control">
                <option value="${ELIGIBILITY_STATUS.ELIGIBLE}" ${initialData.eligibility_status === ELIGIBILITY_STATUS.ELIGIBLE ? 'selected' : ''}>ELIGIBLE</option>
                <option value="${ELIGIBILITY_STATUS.PENDING_VERIFICATION}" ${initialData.eligibility_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION ? 'selected' : ''}>PENDING_VERIFICATION</option>
                <option value="${ELIGIBILITY_STATUS.INELIGIBLE}" ${initialData.eligibility_status === ELIGIBILITY_STATUS.INELIGIBLE ? 'selected' : ''}>INELIGIBLE</option>
              </select>
            </div>

            <div class="form-group">
              <label for="input-exclusion-reason">Reason they are outside the group</label>
              <select id="input-exclusion-reason" class="form-control">
                <option value="${EXCLUSION_REASONS.NONE}">NONE (Candidate Eligible)</option>
                <option value="${EXCLUSION_REASONS.OUTSIDE_COMMODITY}">OUTSIDE_COMMODITY</option>
                <option value="${EXCLUSION_REASONS.OUTSIDE_GEOGRAPHY}">OUTSIDE_GEOGRAPHY</option>
                <option value="${EXCLUSION_REASONS.WRONG_ROLE}">WRONG_ROLE</option>
                <option value="${EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY}">NO_PURCHASE_AUTHORITY</option>
                <option value="${EXCLUSION_REASONS.TRADER_ONLY}">TRADER_ONLY</option>
                <option value="${EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED}">REFERRAL_NOT_VERIFIED</option>
                <option value="${EXCLUSION_REASONS.DUPLICATE}">DUPLICATE</option>
                <option value="${EXCLUSION_REASONS.OTHER}">OTHER</option>
              </select>
            </div>

            <div class="form-group full-width" id="group-override-reason" style="display: none;">
              <label for="input-override-reason" style="color: #f87171;">Why does your decision differ from the fit check? *</label>
              <textarea id="input-override-reason" class="form-control" rows="2" placeholder="Provide mandatory justification for overriding system recommendation...">${initialData.override_reason}</textarea>
            </div>

            <div class="form-group full-width">
              <label for="input-qualification-basis">What supports this decision?</label>
              <textarea id="input-qualification-basis" class="form-control" rows="2" placeholder="Enter supporting notes summarizing qualification evidence...">${initialData.qualification_basis}</textarea>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button id="btn-cancel-modal" class="btn btn-ghost">Cancel</button>
        <button id="btn-save-candidate" class="btn btn-primary">Save participant</button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');

  const form=document.getElementById('form-candidate'), grid=form.querySelector('.form-grid');
  const group=(title,ids,open=true)=>{const section=document.createElement('details');section.open=open;section.className='form-section';const summary=document.createElement('summary');summary.textContent=title;section.append(summary);const inner=document.createElement('div');inner.className='form-grid';section.append(inner);ids.forEach(id=>{const box=document.getElementById(id)?.closest('.form-group');if(box)inner.append(box);});grid.before(section);return section;};
  group('1. Who are they?', ['input-name','input-phone']);
  group('2. What do they do?', ['input-role']);
  group('3. Where do they operate?', ['input-town','input-state','input-commodity']);
  const referral=group('4. How did we find them?', ['input-referral-type','input-referral-source','input-contact-outcome']);
  const hint=document.createElement('p');hint.textContent='A trader referral does not automatically qualify. Confirm their actual role and authority.';referral.append(hint);
  group('5. Can they make the relevant decision?', ['chk-stock','input-verification-level']);
  group('Record details (reference and practice data)', ['input-ref','input-record-type'],false);
  const disclosure=()=>{const retail=['RETAIL_PURCHASER','RETAIL_APPROVER'].includes(document.getElementById('input-role').value);document.getElementById('chk-approval').closest('label').hidden=!retail;document.getElementById('chk-spending').closest('label').hidden=!retail;hint.hidden=document.getElementById('input-referral-type').value!=='EXISTING_TRADER';};
  document.getElementById('input-role').addEventListener('change',disclosure);document.getElementById('input-referral-type').addEventListener('change',disclosure);disclosure();
  document.getElementById('input-exclusion-reason').value=initialData.exclusion_reason||'NONE';
  const extra=document.createElement('div');extra.className='form-group full-width';extra.innerHTML='<label for="exclusion-notes">Explain another exclusion reason (at least 10 characters)</label><textarea id="exclusion-notes" class="form-control"></textarea>';form.append(extra);document.getElementById('exclusion-notes').value=initialData.exclusion_notes||'';
  const toggleExtra=()=>extra.hidden=document.getElementById('input-exclusion-reason').value!=='OTHER';document.getElementById('input-exclusion-reason').addEventListener('change',toggleExtra);toggleExtra();

  // Real-Time Recommendation Update Helper
  const updateRecommendation = () => {
    const candidateData = {
      commodity: document.getElementById('input-commodity').value,
      claimed_role: document.getElementById('input-role').value,
      geography: {
        state: document.getElementById('input-state').value,
        town: document.getElementById('input-town').value,
        within_discovery_area: true
      },
      referral_type: document.getElementById('input-referral-type').value,
      authority_info: {
        stock_control: document.getElementById('chk-stock').checked,
        purchase_approval: document.getElementById('chk-approval').checked,
        spending_authority: document.getElementById('chk-spending').checked,
        verification_level: document.getElementById('input-verification-level').value
      },
      contact_outcome: document.getElementById('input-contact-outcome').value
    };

    const evalResult = evaluateQualification(candidateData);

    const recBox = document.getElementById('decision-support-panel');
    const badge = document.getElementById('rec-status-badge');
    const explanation = document.getElementById('rec-explanation');
    const failedList = document.getElementById('rec-failed-list');

    recBox.className = `recommendation-box status-${evalResult.suggested_status}`;
    badge.textContent = label(evalResult.suggested_status);
    badge.className = `badge badge-${evalResult.suggested_status.toLowerCase().replace('_verification', '')}`;
    explanation.textContent = evalResult.suggested_status === 'ELIGIBLE' ? 'Fits the tomato, Dikko/Niger and role checks under the current rules. Qualification does not establish demand.' : evalResult.suggested_status === 'PENDING_VERIFICATION' ? 'Contact this person and confirm the missing details before enrolling them.' : 'This person is outside the selected group. See the reasons below.';

    failedList.innerHTML = evalResult.failed_checks.map(f => `<li>${f.message}</li>`).join('');

    // Check Override
    const opStatus = document.getElementById('input-operator-eligibility').value;
    const overrideGroup = document.getElementById('group-override-reason');
    if (opStatus !== evalResult.suggested_status) {
      overrideGroup.style.display = 'block';
    } else {
      overrideGroup.style.display = 'none';
    }

    // Auto-set exclusion reason if ineligible
    const exclSelect = document.getElementById('input-exclusion-reason');
    if (opStatus === ELIGIBILITY_STATUS.INELIGIBLE && evalResult.exclusion_reason !== EXCLUSION_REASONS.NONE) {
      exclSelect.value = evalResult.exclusion_reason;
    }

    // Check Duplicates
    const newPhone = document.getElementById('input-phone').value;
    const newName = document.getElementById('input-name').value;
    const dupResult = detectDuplicateCandidates({ participant_ref: initialData.participant_ref, phone_contact: newPhone, full_name: newName }, existingParticipants);

    const dupBox = document.getElementById('duplicate-warning-box');
    const dupList = document.getElementById('duplicate-reasons-list');
    if (dupResult.hasDuplicates) {
      dupBox.style.display = 'block';
      dupList.innerHTML = dupResult.duplicates.map(d => `• ${d.existing_participant.full_name} (${d.existing_participant.participant_ref}): ${d.match_reasons.join(', ')}`).join('<br>');
    } else {
      dupBox.style.display = 'none';
    }

    return evalResult;
  };

  // Attach Input Event Listeners for Live Evaluation
  const inputsToListen = ['input-commodity', 'input-role', 'input-state', 'input-town', 'input-referral-type', 'chk-stock', 'chk-approval', 'chk-spending', 'input-verification-level', 'input-contact-outcome', 'input-operator-eligibility', 'input-phone', 'input-name'];
  inputsToListen.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', updateRecommendation);
      el.addEventListener('input', updateRecommendation);
    }
  });

  // Explicit adoption keeps the operator in control of the stored decision.
  const apply=document.createElement('button');apply.type='button';apply.className='btn btn-secondary';apply.textContent='Use this fit result';
  document.getElementById('decision-support-panel').append(apply);
  apply.onclick=()=>{const result=updateRecommendation();document.getElementById('input-operator-eligibility').value=result.suggested_status;document.getElementById('input-exclusion-reason').value=result.exclusion_reason;updateRecommendation();toggleExtra();};
  grid.querySelector('.full-width')?.remove();
  const initialEval = updateRecommendation();

  // Close handlers
  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('btn-cancel-modal').onclick = closeModal;

  // Save Handler
  document.getElementById('btn-save-candidate').onclick = async () => {
    if (!document.getElementById('form-candidate').reportValidity()) return;
    const evalResult = updateRecommendation();

    const opEligibility = document.getElementById('input-operator-eligibility').value;
    const isOverride = opEligibility !== evalResult.suggested_status;
    const overrideReason = isOverride ? document.getElementById('input-override-reason').value : '';

    const newParticipantData = {
      participant_ref: document.getElementById('input-ref').value,
      record_type: document.getElementById('input-record-type').value,
      full_name: document.getElementById('input-name').value,
      phone_contact: document.getElementById('input-phone').value,
      claimed_role: document.getElementById('input-role').value,
      commodity: document.getElementById('input-commodity').value,
      geography: {
        state: document.getElementById('input-state').value,
        town: document.getElementById('input-town').value,
        within_discovery_area: true
      },
      referral_source: document.getElementById('input-referral-source').value,
      referral_type: document.getElementById('input-referral-type').value,
      authority_info: {
        stock_control: document.getElementById('chk-stock').checked,
        purchase_approval: document.getElementById('chk-approval').checked,
        spending_authority: document.getElementById('chk-spending').checked,
        verification_level: document.getElementById('input-verification-level').value
      },
      eligibility_status: opEligibility,
      contact_outcome: document.getElementById('input-contact-outcome').value,
      participation_status: (opEligibility === ELIGIBILITY_STATUS.ELIGIBLE && document.getElementById('input-contact-outcome').value === CONTACT_OUTCOMES.AGREED) ? 'DISCOVERY_PARTICIPANT' : 'NOT_ENROLLED',
      exclusion_reason: document.getElementById('input-exclusion-reason').value,
      system_recommendation: { status: evalResult.suggested_status, failed_checks: evalResult.failed_checks.map(f => f.message), explanation: evalResult.explanation },
      operator_override: isOverride,
      override_reason: overrideReason,
      exclusion_notes: document.getElementById('exclusion-notes').value,
      qualification_basis: document.getElementById('input-qualification-basis').value
    };

    const finalParticipant = createR1Participant({ ...initialData, ...newParticipantData });
    const valResult = validateR1Participant(finalParticipant);

    if (!valResult.isValid) {
      showErrors(document.getElementById("form-candidate"), valResult.errors);
      return;
    }

    try { await onSave(finalParticipant); closeModal(); } catch { showErrors(document.getElementById("form-candidate"), ["Could not save. Your entries are still here. Try again."]); }
  };
}
