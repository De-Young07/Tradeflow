/**
 * Participant Detail Drawer with 360° Discovery View (R1, R2, R3, R5)
 */
import { createR5JournalEntry } from '../domain/models.js';
import { validateR5JournalEntry } from '../domain/validation.js';
import { CHANNEL_TYPES, EVENT_TYPES, EVIDENCE_STATUS, CLAIMED_ROLE_LABELS, CONSEQUENCE_LABELS } from '../domain/constants.js';

export function renderParticipantDrawer(participant, journalEntries = [], cases = [], jobs = [], decisions = [], onSaveJournalEntry, onAddCaseClick, onAddJobClick, onClose) {
  const drawerContainer = document.getElementById('drawer-container');
  if (!drawerContainer || !participant) return;

  const pRef = participant.participant_ref;
  const participantJournal = journalEntries.filter(j => j.participant_ref === pRef);
  const participantCases = cases.filter(c => c.participant_ref === pRef);
  const participantJobs = jobs.filter(j => j.participant_ref === pRef);
  const pCaseRefs = participantCases.map(c => c.case_ref);
  const participantDecisions = decisions.filter(d => 
    (d.supporting_case_refs || []).includes(pRef) ||
    (d.supporting_case_refs || []).some(ref => pCaseRefs.includes(ref)) ||
    (d.contradictory_case_refs || []).some(ref => pCaseRefs.includes(ref))
  );

  drawerContainer.innerHTML = `
    <div class="drawer-content">
      <div class="drawer-header">
        <div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <h2 style="font-size: 18px; font-weight: 700;">${participant.full_name}</h2>
            <span class="badge ${participant.record_type === 'TEST' ? 'badge-test' : 'badge-field'}">${participant.record_type}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 2px;">
            Ref: <strong>${pRef}</strong> | Phone: ${participant.phone_contact}
          </div>
        </div>
        <button id="drawer-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="drawer-body">
        <!-- 3 Dimension Status Summary Bar -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background-color: var(--bg-input); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 20px;">
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Eligibility Status</div>
            <div style="font-weight: 700; color: ${participant.eligibility_status === 'ELIGIBLE' ? 'var(--success)' : participant.eligibility_status === 'INELIGIBLE' ? 'var(--danger)' : 'var(--warning)'}; margin-top: 2px;">
              ${participant.eligibility_status}
              ${participant.operator_override ? '⚡' : ''}
            </div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Contact Outcome</div>
            <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">${participant.contact_outcome}</div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Participation Status</div>
            <div style="font-weight: 600; color: ${participant.participation_status === 'DISCOVERY_PARTICIPANT' ? 'var(--success)' : 'var(--text-muted)'}; margin-top: 2px;">
              ${participant.participation_status}
            </div>
          </div>
        </div>

        <!-- R1 Profile Details -->
        <div style="background-color: var(--bg-input); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 12px;">
          <strong style="color: var(--primary);">R1 Registry Profile & Scope Summary</strong>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
            <div><strong>Claimed Role:</strong> ${CLAIMED_ROLE_LABELS[participant.claimed_role] || participant.claimed_role}</div>
            <div><strong>Commodity:</strong> ${participant.commodity}</div>
            <div><strong>Geography:</strong> ${participant.geography?.town}, ${participant.geography?.state}</div>
            <div><strong>Referral Source:</strong> ${participant.referral_source || 'Direct Outreach'}</div>
            <div><strong>Exclusion Code:</strong> ${participant.exclusion_reason}</div>
            <div><strong>Stock Control:</strong> ${participant.authority_info?.stock_control ? 'Yes' : 'No'}</div>
            <div><strong>Purchase Approval:</strong> ${participant.authority_info?.purchase_approval ? 'Yes' : 'No'}</div>
            <div><strong>Spending Authority:</strong> ${participant.authority_info?.spending_authority ? 'Yes' : 'No'}</div>
          </div>
          ${participant.qualification_basis ? `<div style="margin-top: 8px; color: var(--text-secondary);"><strong>Qualification Basis:</strong> ${participant.qualification_basis}</div>` : ''}
          ${participant.operator_override ? `<div style="margin-top: 8px; color: #f87171;"><strong>Override Justification:</strong> ${participant.override_reason}</div>` : ''}
        </div>

        <!-- Linked R2 Transaction Cases -->
        <div style="background-color: var(--bg-input); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: var(--primary);">R2 Reconstructed Transaction Cases (${participantCases.length})</strong>
            <button id="btn-drawer-add-case" class="btn btn-secondary btn-sm" style="font-size: 11px;">+ Add Case (R2)</button>
          </div>
          ${participantCases.length === 0 ? '<div style="color: var(--text-muted);">No transaction cases recorded yet for this participant.</div>' : ''}
          ${participantCases.map(c => `
            <div style="border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <strong>${c.case_ref}: ${c.product_grade} (${c.quantity_unit})</strong>
                <span class="badge ${c.actual_result === 'SUCCESSFUL_TRANSACTION' ? 'badge-eligible' : 'badge-ineligible'}">${c.actual_result}</span>
              </div>
              <div style="color: var(--text-secondary); margin-top: 4px;">${c.steps_sequence || 'No steps sequence narrative recorded.'}</div>
              ${c.failure_point ? `<div style="color: #f87171; margin-top: 4px;"><strong>Failure Point:</strong> ${c.failure_point}</div>` : ''}
              ${c.consequence_type !== 'NONE' ? `<div style="color: var(--warning); margin-top: 2px;"><strong>Consequence:</strong> ${CONSEQUENCE_LABELS[c.consequence_type] || c.consequence_type} (${c.consequence_amount})</div>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Linked R3 Upcoming Jobs -->
        <div style="background-color: var(--bg-input); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: var(--primary);">R3 Upcoming Jobs & Fallback Baselines (${participantJobs.length})</strong>
            <button id="btn-drawer-add-job" class="btn btn-secondary btn-sm" style="font-size: 11px;">+ Add Job Brief (R3)</button>
          </div>
          ${participantJobs.length === 0 ? '<div style="color: var(--text-muted);">No upcoming job briefs recorded yet for this participant.</div>' : ''}
          ${participantJobs.map(j => `
            <div style="border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <strong>${j.job_ref}: ${j.job_type}</strong>
                <span class="badge badge-eligible">${j.last_actionable_datetime ? new Date(j.last_actionable_datetime).toLocaleDateString() : 'No Deadline'}</span>
              </div>
              <div style="color: var(--text-secondary); margin-top: 4px;"><strong>Requirements:</strong> ${j.job_requirements}</div>
              <div style="color: var(--primary); margin-top: 4px;"><strong>Original Fallback Plan:</strong> ${j.original_plan_fallback}</div>
            </div>
          `).join('')}
        </div>

        <!-- Linked R4 Stage Decisions -->
        <div style="background-color: var(--bg-input); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: var(--primary);">R4 Stage Decisions Citing Participant (${participantDecisions.length})</strong>
          </div>
          ${participantDecisions.length === 0 ? '<div style="color: var(--text-muted);">No stage decisions currently cite this participant or their transaction cases.</div>' : ''}
          ${participantDecisions.map(d => `
            <div style="border-top: 1px solid var(--border-color); padding-top: 8px; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <strong>${d.decision_ref}: ${d.decision_point}</strong>
                <span class="badge ${d.stage_decision === 'PROCEED' ? 'badge-eligible' : d.stage_decision === 'NARROW' ? 'badge-info' : d.stage_decision === 'REJECT' ? 'badge-ineligible' : 'badge-pending'}">${d.stage_decision}</span>
              </div>
              <div style="color: var(--text-secondary); margin-top: 4px;">${d.decision_rationale}</div>
            </div>
          `).join('')}
        </div>

        <!-- Log New R5 Event Form -->
        <div style="background-color: var(--bg-input); border: 1px dashed var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
          <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--primary);">+ Log Dated Evidence Journal Entry (R5)</h3>
          
          <form id="form-log-r5" onsubmit="return false;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="form-group">
                <label for="r5-channel">Channel *</label>
                <select id="r5-channel" class="form-control">
                  <option value="${CHANNEL_TYPES.PHONE_CALL}">PHONE_CALL</option>
                  <option value="${CHANNEL_TYPES.DIRECT_CONVERSATION}">DIRECT_CONVERSATION</option>
                  <option value="${CHANNEL_TYPES.PHYSICAL_VISIT}">PHYSICAL_VISIT</option>
                  <option value="${CHANNEL_TYPES.THIRD_PARTY_VERIFICATION}">THIRD_PARTY_VERIFICATION</option>
                </select>
              </div>

              <div class="form-group">
                <label for="r5-event-type">Event Type *</label>
                <select id="r5-event-type" class="form-control">
                  <option value="${EVENT_TYPES.CONTACT_ATTEMPT}">CONTACT_ATTEMPT</option>
                  <option value="${EVENT_TYPES.QUALIFICATION_CHECK}">QUALIFICATION_CHECK</option>
                  <option value="${EVENT_TYPES.AUTHORITY_CHECK}">AUTHORITY_CHECK</option>
                  <option value="${EVENT_TYPES.PERMISSION_REQUEST}">PERMISSION_REQUEST</option>
                  <option value="${EVENT_TYPES.REFUSAL_LOG}">REFUSAL_LOG</option>
                  <option value="${EVENT_TYPES.FOLLOW_UP}">FOLLOW_UP</option>
                </select>
              </div>

              <div class="form-group">
                <label for="r5-evidence-status">Claim Evidence Status *</label>
                <select id="r5-evidence-status" class="form-control">
                  <option value="${EVIDENCE_STATUS.REPORTED}">REPORTED (Stated during call)</option>
                  <option value="${EVIDENCE_STATUS.ESTIMATED}">ESTIMATED (Calculated approx)</option>
                  <option value="${EVIDENCE_STATUS.CHECKED}">CHECKED (Verified against source)</option>
                  <option value="${EVIDENCE_STATUS.UNKNOWN}">UNKNOWN (Missing/unconfirmed)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="r5-operator">Operator Name / Initials *</label>
                <input type="text" id="r5-operator" class="form-control" value="Operator-A" required>
              </div>

              <div class="form-group full-width">
                <label for="r5-action">Action / Question Executed *</label>
                <input type="text" id="r5-action" class="form-control" placeholder="e.g. Called candidate to verify weekly bulk purchasing authority" required>
              </div>

              <div class="form-group full-width">
                <label for="r5-response">Raw Response / Candidate Notes *</label>
                <textarea id="r5-response" class="form-control" rows="2" placeholder="Record actual wording, stated refusal reasons, or verified authority evidence..." required></textarea>
              </div>
            </div>

            <button id="btn-save-r5" class="btn btn-primary btn-sm" style="margin-top: 10px;">Log Journal Entry (R5)</button>
          </form>
        </div>

        <!-- Chronological R5 Timeline -->
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Evidence & Contact History Timeline (R5)</h3>
        
        <div class="timeline">
          ${participantJournal.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No dated R5 journal entries recorded yet for this participant.</div>' : ''}
          ${participantJournal.slice().reverse().map(j => `
            <div class="timeline-item">
              <div class="timeline-date">${new Date(j.timestamp).toLocaleString()} | Logged by <strong>${j.operator_id}</strong> via ${j.channel}</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                  <span>${j.event_type}: ${j.action_performed}</span>
                  <span class="badge badge-pending">${j.evidence_status}</span>
                </div>
                <div style="margin-top: 6px; color: var(--text-secondary);">${j.raw_response}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  drawerContainer.classList.remove('hidden');

  const closeDrawer = () => {
    drawerContainer.classList.add('hidden');
    onClose();
  };

  document.getElementById('drawer-close').onclick = closeDrawer;

  const btnAddCase = document.getElementById('btn-drawer-add-case');
  if (btnAddCase) btnAddCase.onclick = () => onAddCaseClick(pRef);

  const btnAddJob = document.getElementById('btn-drawer-add-job');
  if (btnAddJob) btnAddJob.onclick = () => onAddJobClick(pRef);

  // Save R5 Entry Handler
  document.getElementById('btn-save-r5').onclick = () => {
    const nextJId = `TF-CD01-J${String(journalEntries.length + 1).padStart(3, '0')}`;
    const newEntry = createR5JournalEntry({
      journal_id: nextJId,
      participant_ref: pRef,
      channel: document.getElementById('r5-channel').value,
      event_type: document.getElementById('r5-event-type').value,
      evidence_status: document.getElementById('r5-evidence-status').value,
      operator_id: document.getElementById('r5-operator').value,
      action_performed: document.getElementById('r5-action').value,
      raw_response: document.getElementById('r5-response').value
    });

    const val = validateR5JournalEntry(newEntry);
    if (!val.isValid) {
      alert(`Validation Error:\n• ${val.errors.join('\n• ')}`);
      return;
    }

    onSaveJournalEntry(newEntry);
  };
}
