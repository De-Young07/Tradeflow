import {label} from './workflow.js';
import {showErrors} from './ux.js';
/**
 * Human Operator Review UI Component for AI-Assisted Discovery Intelligence
 * Enforces single-action manual review, per-claim correction/rejection, and approved R5 entry promotion.
 */
import { createR5JournalEntry } from '../domain/models.js';

export function renderAiReviewModal(aiDraftResult, participant, onApprove, onReject) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  const provenance = aiDraftResult.transcription || {};
  const analysis = aiDraftResult.ai_draft_analysis || {};
  const claims = analysis.explicit_claims || [];
  const storageKey = aiDraftResult.audio_storage_key || '';

  let editedClaims = JSON.parse(JSON.stringify(claims));
  let correctionsMade = false;

  modalContainer.innerHTML = `
    <div class="modal-content" style="max-width: 900px;">
      <div class="modal-header">
        <div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <h2 style="font-size: 16px; font-weight: 700;">Review interview</h2>
            <span class="badge badge-warning" id="review-status-badge">AI Draft — Review Required</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
            Participant: <strong>${participant?.full_name} (${participant?.participant_ref})</strong>
          </div>
        </div>
        <button id="modal-close" class="btn btn-ghost" style="padding: 4px 8px;">✕</button>
      </div>

      <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
        <!-- Audio Stream Player -->
        ${storageKey ? `
          <div style="background-color: var(--bg-input); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 14px; border: 1px solid var(--border-color);">
            <div style="font-size: 11px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">Original Consented Audio Stream</div>
            <audio controls style="width: 100%; height: 32px;" src="/api/audio/stream?storageKey=${encodeURIComponent(storageKey)}"></audio>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Storage Key: <code>${storageKey}</code></div>
          </div>
        ` : ''}

        <!-- Language Metadata Bar -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background-color: var(--bg-card); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 16px; font-size: 11px;">
          <div>
            <span style="color: var(--text-muted);">Operator Selection:</span>
            <strong>${label(provenance.operator_selected_language || 'AUTO_DETECT')}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Provider Detected:</span>
            <strong style="color: var(--primary);">${label(provenance.provider_detected_language || 'UNKNOWN')}</strong>
          </div>
          <div>
            <span style="color: var(--text-muted);">Code Switching:</span>
            <strong>${provenance.code_switching_detected ? 'Detected ✓' : 'None'}</strong>
          </div>
        </div>

        <!-- Transcripts Comparison Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-primary);">1. Review the original transcript</label>
            <textarea id="review-original-transcript" class="form-control" rows="5" style="font-size: 11px; margin-top: 4px;">${provenance.original_transcript || ''}</textarea>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--text-primary);">English Translation / Normalization</label>
            <textarea id="review-english-translation" class="form-control" rows="5" style="font-size: 11px; margin-top: 4px;">${provenance.english_translation || ''}</textarea>
          </div>
        </div>

        <!-- Extracted Claims & Fact Inspection -->
        <div style="background-color: var(--bg-card); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 16px;">
          <h3 style="font-size: 13px; font-weight: 700; color: var(--primary); margin-bottom: 10px;">2. Review extracted claims — keep reports separate from checked facts</h3>
          
          <div id="claims-container" style="display: flex; flex-direction: column; gap: 10px;">
            ${claims.length === 0 ? '<div style="font-size: 12px; color: var(--text-muted);">No explicit claims extracted by AI.</div>' : ''}
            ${claims.map((c, idx) => `
              <div class="claim-item-card" data-idx="${idx}" style="background-color: var(--bg-input); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div style="flex: 1;">
                    <div style="font-size: 12px; font-weight: 600;">${c.claim}</div>
                    <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">Quote: <em>"${c.verbatim_quote}"</em> [Ref: ${c.timestamp_ref || 'N/A'}]</div>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <select class="claim-status-select form-control" aria-label="Evidence status for claim ${idx + 1}" data-idx="${idx}" style="font-size: 10px; padding: 2px 4px; width: 95px;">
                      <option value="REPORTED" ${c.evidence_status === 'REPORTED' ? 'selected' : ''}>REPORTED</option>
                      <option value="ESTIMATED" ${c.evidence_status === 'ESTIMATED' ? 'selected' : ''}>ESTIMATED</option>
                      <option value="CHECKED" ${c.evidence_status === 'CHECKED' ? 'selected' : ''}>CHECKED</option>
                      <option value="UNKNOWN" ${c.evidence_status === 'UNKNOWN' ? 'selected' : ''}>UNKNOWN</option>
                    </select>
                    <button class="btn btn-ghost btn-reject-claim" data-idx="${idx}" style="padding: 2px 6px; font-size: 10px; color: var(--danger);" title="Reject Claim">✕ Reject</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Problems & Suggested Followups -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 11px;">
          <div style="background-color: var(--bg-card); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <strong style="color: var(--warning);">Explicitly Mentioned Problems:</strong>
            <ul style="margin-top: 4px; padding-left: 16px;">
              ${(analysis.explicit_problems || []).map(p => `<li>${p.problem_statement} (<em>"${p.verbatim_quote}"</em>)</li>`).join('') || '<li>None explicitly stated</li>'}
            </ul>
          </div>

          <div style="background-color: var(--bg-card); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <strong style="color: var(--primary);">Suggested Follow-up Questions:</strong>
            <ul style="margin-top: 4px; padding-left: 16px;">
              ${(analysis.suggested_followups || []).map(f => `<li>${f}</li>`).join('') || '<li>None required</li>'}
            </ul>
          </div>
        </div>

        <!-- Reviewer Notes & Signature -->
        <div class="form-group" style="margin-top: 14px;">
          <label for="input-reviewer-id" style="font-size: 11px; font-weight: 700;">Your name / initials *</label>
          <input type="text" id="input-reviewer-id" class="form-control" value="Operator-Lead" required style="font-size: 11px;">
        </div>
      </div>

      <div class="modal-footer">
        <button id="btn-reject-ai-draft" class="btn btn-ghost" style="color: var(--danger);">Reject AI Draft</button>
        <button id="btn-approve-ai-draft" class="btn btn-primary">Approve reviewed evidence</button>
      </div>
    </div>
  `;

  const body=modalContainer.querySelector('.modal-body');
  const audit=document.createElement('details');audit.className='form-section';audit.innerHTML='<summary>Processing details / audit information</summary>';
  const text=document.createElement('p');text.textContent=`Provider: ${provenance.provider_name||'Unknown'} · Model: ${provenance.model_version||'Unknown'} · Audio reference: ${storageKey||'None'}`;audit.append(text);body.append(audit);
  const note=document.createElement('p');note.className='draft-notice';note.textContent='AI Draft — Review Required. Check the transcript, then review each claim. Human approval does not automatically make a reported claim verified.';body.prepend(note);
  document.getElementById('review-original-transcript').previousElementSibling?.setAttribute('for','review-original-transcript');
  document.getElementById('review-english-translation').previousElementSibling?.setAttribute('for','review-english-translation');
  const confirmation=document.createElement('label');confirmation.className='review-confirm';confirmation.innerHTML='<input id="review-confirmed" type="checkbox"> I have reviewed the transcript and the extracted claims.';body.append(confirmation);
  document.getElementById('btn-approve-ai-draft').disabled=true;
  document.getElementById('review-confirmed').onchange=e=>document.getElementById('btn-approve-ai-draft').disabled=!e.target.checked;
  modalContainer.classList.remove('hidden');

  // Handle claim rejection/edits
  document.querySelectorAll('.btn-reject-claim').forEach(btn => {
    btn.onclick = (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      editedClaims[idx].rejected = true;
      correctionsMade = true;
      const card = document.querySelector(`.claim-item-card[data-idx="${idx}"]`);
      if (card) {
        card.style.opacity = '0.4';
        card.style.textDecoration = 'line-through';
      }
    };
  });

  document.querySelectorAll('.claim-status-select').forEach(sel => {
    sel.onchange = (e) => {
      const idx = parseInt(e.target.getAttribute('data-idx'));
      editedClaims[idx].evidence_status = e.target.value;
      correctionsMade = true;
    };
  });

  const closeModal = () => modalContainer.classList.add('hidden');
  document.getElementById('modal-close').onclick = closeModal;

  document.getElementById('btn-reject-ai-draft').onclick = () => {
    if (confirm('Are you sure you want to reject this AI draft? It will not enter the discovery evidence base.')) {
      onReject();
      closeModal();
    }
  };

  document.getElementById('btn-approve-ai-draft').onclick = async () => {
    if (!document.getElementById('review-confirmed').checked) return;
    if (!document.getElementById('input-reviewer-id').reportValidity()) return;
    const reviewerId = document.getElementById('input-reviewer-id').value || 'Operator-Lead';
    const approvedClaims = editedClaims.filter(c => !c.rejected);
    const updatedOriginal = document.getElementById('review-original-transcript').value;
    const updatedEnglish = document.getElementById('review-english-translation').value;

    const approvedR5Entry = createR5JournalEntry({
      journal_id: `TF-CD01-J${Date.now().toString().slice(-4)}`,
      participant_ref: participant.participant_ref,
      timestamp: new Date().toISOString(),
      operator_id: reviewerId,
      channel: 'PHONE_CALL',
      event_type: 'QUALIFICATION_CHECK',
      action_performed: 'AI Transcribed & Human Approved Interview Journal Entry',
      raw_response: updatedEnglish || updatedOriginal,
      evidence_status: approvedClaims[0]?.evidence_status || 'REPORTED',
      ai_provenance: {
        recording_consent_granted: true,
        consent_timestamp: new Date().toISOString(),
        audio_storage_key: storageKey,
        operator_selected_language: provenance.operator_selected_language || 'AUTO_DETECT',
        provider_detected_language: provenance.provider_detected_language || 'ha-NG',
        code_switching_detected: provenance.code_switching_detected || false,
        transcription_provider: provenance.provider_name || 'MockTranscriptionAdapter',
        transcription_model_version: provenance.model_version || 'v1.0',
        original_transcript: updatedOriginal,
        english_translation: updatedEnglish,
        ai_draft_analysis: analysis,
        human_review: {
          review_state: correctionsMade ? 'CORRECTED' : 'APPROVED',
          reviewer_id: reviewerId,
          review_timestamp: new Date().toISOString(),
          corrections_made: correctionsMade,
          approved_claims: approvedClaims
        }
      }
    });

    try { await onApprove(approvedR5Entry); closeModal(); } catch { showErrors(modalContainer.querySelector('.modal-body'),['Could not save the reviewed interview. Your review is still here; try again.']); }
  };
}
