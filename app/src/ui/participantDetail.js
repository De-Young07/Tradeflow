import {nextAction, label, escapeHtml} from './workflow.js';
import {showErrors, toast} from './ux.js';
/**
 * Participant Detail Drawer with 360° Discovery View (R1, R2, R3, R5)
 */
import { createR5JournalEntry } from '../domain/models.js';
import { validateR5JournalEntry } from '../domain/validation.js';
import { CHANNEL_TYPES, EVENT_TYPES, EVIDENCE_STATUS, CLAIMED_ROLE_LABELS, CONSEQUENCE_LABELS } from '../domain/constants.js';

export function renderParticipantDrawer(participant, journalEntries = [], cases = [], jobs = [], decisions = [], onSaveJournalEntry, onAddCaseClick, onAddJobClick, onProcessAiAudio, onClose) {
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
              ${label(participant.eligibility_status)}
              ${participant.operator_override ? '⚡' : ''}
            </div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Contact Outcome</div>
            <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">${label(participant.contact_outcome)}</div>
          </div>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Participation Status</div>
            <div style="font-weight: 600; color: ${participant.participation_status === 'DISCOVERY_PARTICIPANT' ? 'var(--success)' : 'var(--text-muted)'}; margin-top: 2px;">
              ${label(participant.participation_status)}
            </div>
          </div>
        </div>

        <!-- R1 Profile Details -->
        <div style="background-color: var(--bg-input); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; font-size: 12px;">
          <strong style="color: var(--primary);">Overview and discovery fit</strong>
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
            <strong style="color: var(--primary);">Past transaction evidence (${participantCases.length})</strong>
            <button id="btn-drawer-add-case" class="btn btn-secondary btn-sm" style="font-size: 11px;">Log transaction interview</button>
          </div>
          ${participantCases.length === 0 ? '<div style="color: var(--text-muted);">No transaction interview recorded. Ask about a recent sale or purchase, then choose Log transaction interview.</div>' : ''}
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
            <strong style="color: var(--primary);">Next sale or purchase (${participantJobs.length})</strong>
            <button id="btn-drawer-add-job" class="btn btn-secondary btn-sm" style="font-size: 11px;">Add next sale / purchase</button>
          </div>
          ${participantJobs.length === 0 ? '<div style="color: var(--text-muted);">No next sale or purchase recorded. Ask what they plan to do next and when they can still change it.</div>' : ''}
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
            <strong style="color: var(--primary);">Decisions using this evidence (${participantDecisions.length})</strong>
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

        <!-- AI Audio Upload & Interview Processing Intake Form (Phase AI-2) -->
        <div style="background-color: var(--bg-card); border: 1px solid var(--primary); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 14px; font-weight: 700; color: var(--primary);">🎙️ Upload an interview</h3>
            <span class="badge badge-info">Review required</span>
          </div>
          <p style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
            Upload consented audio recordings for transcription, translation, and structured evidence extraction. Review the transcript and claims before saving evidence. AI drafts do not change qualification.
          </p>
          ${!import.meta.env.VITE_API_BASE_URL ? `
          <div style="background: rgba(251,191,36,0.12); border: 1px solid #f59e0b; border-radius: var(--radius-sm); padding: 8px 12px; margin-bottom: 12px; font-size: 11px; color: #f59e0b;">
            <strong>⚠️ Demo mode:</strong> Transcription and AI analysis will return simulated example output. No real audio is processed. To enable live transcription, connect the backend service.
          </div>` : ''}

          <form id="form-ai-audio" onsubmit="return false;">
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 12px;">
              <div style="background-color: var(--bg-input); padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <label style="display: flex; gap: 8px; align-items: center; font-weight: 600; cursor: pointer;">
                  <input type="checkbox" id="ai-recording-consent" style="width: 16px; height: 16px;">
                  <span>Participant explicit recording & research data consent granted *</span>
                </label>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div class="form-group">
                  <label for="ai-language-select">Interview Language</label>
                  <select id="ai-language-select" class="form-control">
                    <option value="AUTO_DETECT">Auto-detect (default)</option>
                    <option value="ha-NG">Hausa</option>
                    <option value="en-NG">English</option>
                    <option value="pcm-NG">Nigerian Pidgin</option>
                    <option value="MIXED">Mixed / Code-Switched</option>
                    <option value="OTHER">Other Language</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="ai-audio-file">Select Audio File (.wav, .mp3, .m4a, .ogg) *</label>
                  <input type="file" id="ai-audio-file" class="form-control" accept="audio/*">
                </div>
              </div>

              <button id="btn-process-ai-audio" class="btn btn-primary btn-sm" style="margin-top: 4px;">Transcribe and review</button>
            </div>
          </form>
        </div>

        <!-- Log New R5 Event Form -->
        <div style="background-color: var(--bg-input); border: 1px dashed var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
          <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--primary);">Log contact or interview notes</h3>
          
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
                <label for="r5-event-type">What are you recording? *</label>
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
                <label for="r5-evidence-status">How do we know this? *</label>
                <select id="r5-evidence-status" class="form-control">
                  <option value="${EVIDENCE_STATUS.REPORTED}">Reported by participant</option>
                  <option value="${EVIDENCE_STATUS.ESTIMATED}">Estimate</option>
                  <option value="${EVIDENCE_STATUS.CHECKED}">Checked against a named source</option>
                  <option value="${EVIDENCE_STATUS.UNKNOWN}">Unknown / not confirmed</option>
                </select>
              </div>

              <div class="form-group">
                <label for="r5-operator">Operator Name / Initials *</label>
                <input type="text" id="r5-operator" class="form-control" value="Operator-A" required>
              </div>

              <div class="form-group full-width">
                <label for="r5-action">What did you do or ask? *</label>
                <input type="text" id="r5-action" class="form-control" placeholder="e.g. Called candidate to verify weekly bulk purchasing authority" required>
              </div>

              <div class="form-group full-width">
                <label for="r5-response">What happened or what did they say? *</label>
                <textarea id="r5-response" class="form-control" rows="2" placeholder="Record actual wording, stated refusal reasons, or verified authority evidence..." required></textarea>
              </div>
            </div>

            <button id="btn-save-r5" class="btn btn-primary btn-sm" style="margin-top: 10px;">Save contact / evidence entry</button>
          </form>
        </div>

        <!-- Chronological R5 Timeline -->
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Contact & evidence history</h3>
        
        <div class="timeline">
          ${participantJournal.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No contact history yet. Use Log contact to record a call, what you asked and what they said.</div>' : ''}
          ${participantJournal.slice().sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)).map(j => `
            <div class="timeline-item">
              <div class="timeline-date">${new Date(j.timestamp).toLocaleString()} | Logged by <strong>${j.operator_id}</strong> via ${label(j.channel)}</div>
              <div class="timeline-content">
                <div style="display: flex; justify-content: space-between; font-weight: 600;">
                  <span>${label(j.event_type)}: ${j.action_performed}</span>
                  <span class="badge badge-pending">${j.ai_provenance?.human_review ? 'Human-reviewed · ' : ''}${label(j.evidence_status)}</span>
                </div>
                <div style="margin-top: 6px; color: var(--text-secondary);">${j.raw_response}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  const body=drawerContainer.querySelector('.drawer-body');
  const action=nextAction(participant,journalEntries);
  const intro=document.createElement('section');intro.className='participant-next';
  intro.innerHTML=`<p>${escapeHtml(CLAIMED_ROLE_LABELS[participant.claimed_role])} · ${escapeHtml(participant.geography?.town)}, ${escapeHtml(participant.geography?.state)}</p><p><strong>Next:</strong> ${escapeHtml(action.text)}</p><button class="btn btn-primary" id="participant-next-action">${escapeHtml(action.action)}</button><p class="muted">Find person → Check fit → Contact → Interview → Review evidence</p>`;
  body.prepend(intro);
  const sections=[...body.children].filter(x=>x!==intro);
  const overview=document.createElement('details');overview.className='form-section';overview.innerHTML='<summary>Overview and linked decisions</summary>';
  const interview=document.createElement('details');interview.className='form-section';interview.id='participant-interview';interview.innerHTML='<summary>Interview & evidence</summary>';
  const history=document.createElement('details');history.className='form-section';history.id='participant-history';history.innerHTML='<summary>Log contact & view history</summary>';
  sections.forEach(el=>{if(el.querySelector('#form-log-r5')||el.classList.contains('timeline')||el.tagName==='H3')history.append(el);else if(el.querySelector('#form-ai-audio')||el.querySelector('#btn-drawer-add-case'))interview.append(el);else overview.append(el);});
  body.append(overview,history,interview);
  const openSection=()=>{const target=['interview','evidence'].includes(action.key)?interview:history;target.open=true;target.scrollIntoView({block:'start'});target.querySelector('input,select,button')?.focus();};
  document.getElementById('participant-next-action').onclick=openSection;
  const explanation=document.createElement('p');explanation.className='muted';explanation.textContent=participant.system_recommendation?.explanation||'Open Edit details in Participants to see the current fit check and reasons.';overview.prepend(explanation);
  const logHelp=document.createElement('p');logHelp.textContent='Record the conversation here. If their contact outcome or qualification changed, use Edit fit / contact outcome above too. Checked means checked against a named source; it is not a guarantee.';history.insertBefore(logHelp,history.children[1]);
  const aiForm=document.getElementById('form-ai-audio');
  const fileBox=document.getElementById('ai-audio-file').closest('.form-group');aiForm.prepend(fileBox);
  const steps=document.createElement('p');steps.className='muted';steps.textContent='1. Choose audio → 2. Confirm consent → 3. Confirm language → 4. Transcribe → 5. Review transcript → 6. Review claims → 7. Approve';aiForm.prepend(steps);
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

  const btnProcessAi = document.getElementById('btn-process-ai-audio');
  if (btnProcessAi) {
    btnProcessAi.onclick = async () => {
      const consent = document.getElementById('ai-recording-consent').checked;
      if (!consent) {
        showErrors(document.getElementById('form-ai-audio'), ['Confirm the participant consented to recording and research processing before uploading.']);
        return;
      }
      const lang = document.getElementById('ai-language-select').value;
      const fileInput = document.getElementById('ai-audio-file');
      const audioFile = fileInput.files[0];
      if (onProcessAiAudio) {
        if (!audioFile) { showErrors(document.getElementById('form-ai-audio'), ['Choose an interview audio file first.']); return; }
        btnProcessAi.disabled=true;btnProcessAi.textContent='Transcribing… please keep this page open';
        try { await onProcessAiAudio(pRef, consent, lang, audioFile); }
        catch (error) { console.error(error);showErrors(document.getElementById('form-ai-audio'), ['Audio processing is currently unavailable. This feature requires the backend service to be connected. Your file selection is retained — try again shortly or contact your administrator.']); }
        finally { btnProcessAi.disabled=false;btnProcessAi.textContent='Transcribe and review'; }
      }
    };
  }

  // Save R5 Entry Handler
  document.getElementById('btn-save-r5').onclick = async () => {
    if (!document.getElementById('form-log-r5').reportValidity()) return;
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
      showErrors(document.getElementById('form-log-r5'),val.errors);
      return;
    }

    try { await onSaveJournalEntry(newEntry); } catch { showErrors(document.getElementById('form-log-r5'),['Could not save the contact. Your notes are still here; try again.']); }
  };
}
