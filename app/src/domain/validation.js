/**
 * CD-01 to CD-05 Validation Rules & Duplicate Candidate Detection
 */
import { ELIGIBILITY_STATUS, EXCLUSION_REASONS, TRANSACTION_RESULTS, BENEFICIARY_PAYER_STATUS, STAGE_DECISIONS, CRITERIA_RESULTS } from './constants.js';

/**
 * Validates R1 Participant Record before saving
 */
export function validateR1Participant(participant, isUpdate = false) {
  const errors = [];

  if (!participant.participant_ref || !/^TF-CD01-P\d{3,}$/.test(participant.participant_ref)) {
    errors.push('Participant reference must be in format TF-CD01-Pxxx.');
  }

  if (!participant.full_name || participant.full_name.trim().length < 2) {
    errors.push('Full name or pseudonym is required (at least 2 characters).');
  }

  if (!participant.claimed_role) {
    errors.push('Claimed role is required.');
  }

  if (participant.eligibility_status === ELIGIBILITY_STATUS.INELIGIBLE) {
    if (participant.exclusion_reason === EXCLUSION_REASONS.NONE) {
      errors.push('Ineligible participants require a structured exclusion reason code.');
    }
    if (participant.exclusion_reason === EXCLUSION_REASONS.OTHER && (!participant.exclusion_notes || participant.exclusion_notes.trim().length < 10)) {
      errors.push('Mandatory explanation (at least 10 characters) is required when Exclusion Reason is OTHER.');
    }
  }

  if (participant.operator_override) {
    if (!participant.override_reason || participant.override_reason.trim().length < 10) {
      errors.push('Mandatory operator justification (at least 10 characters) is required when overriding system recommendation.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates R2 Discovery Transaction Case Record (CD-02, CD-03)
 */
export function validateR2Case(caseRecord) {
  const errors = [];

  if (!caseRecord.case_ref || !/^TF-CD02-C\d{3,}$/.test(caseRecord.case_ref)) {
    errors.push('Case reference must be in format TF-CD02-Cxxx.');
  }

  if (!caseRecord.participant_ref || !/^TF-CD01-P\d{3,}$/.test(caseRecord.participant_ref)) {
    errors.push('Case must reference a valid participant ref (TF-CD01-Pxxx).');
  }

  if (!caseRecord.transaction_period || caseRecord.transaction_period.trim().length < 2) {
    errors.push('Transaction date or period is required.');
  }

  if (caseRecord.actual_result === TRANSACTION_RESULTS.FAILED_TRANSACTION && (!caseRecord.failure_point || caseRecord.failure_point.trim().length < 3)) {
    errors.push('Failed transaction cases require a specific failure point description.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates R3 Upcoming Job & Baseline Brief Record (CD-04)
 */
export function validateR3Job(jobRecord) {
  const errors = [];

  if (!jobRecord.job_ref || !/^TF-CD04-J\d{3,}$/.test(jobRecord.job_ref)) {
    errors.push('Job reference must be in format TF-CD04-Jxxx.');
  }

  if (!jobRecord.participant_ref || !/^TF-CD01-P\d{3,}$/.test(jobRecord.participant_ref)) {
    errors.push('Upcoming job must reference a valid participant ref (TF-CD01-Pxxx).');
  }

  if (!jobRecord.original_plan_fallback || jobRecord.original_plan_fallback.trim().length < 5) {
    errors.push('Original plan/fallback description (at least 5 characters) is required as the baseline for MT-01.');
  }

  if (jobRecord.beneficiary_payer_status !== BENEFICIARY_PAYER_STATUS.UNKNOWN) {
    errors.push('Beneficiary/payer status must remain UNKNOWN in Stage A discovery.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates R4 Experiment Scope & Decision Record (CD-05)
 */
export function validateR4Decision(decisionRecord) {
  const errors = [];

  if (!decisionRecord.decision_ref || !/^TF-CD05-D\d{3,}$/.test(decisionRecord.decision_ref)) {
    errors.push('Decision reference must be in format TF-CD05-Dxxx.');
  }

  if (!decisionRecord.decision_rationale || decisionRecord.decision_rationale.trim().length < 10) {
    errors.push('Detailed decision rationale (at least 10 characters) is required.');
  }

  // Strict Stage B Gate Enforcer
  const gate = decisionRecord.gate_assessment || {};
  const gatePassed = gate.gate_passed === true;

  if (decisionRecord.stage_decision === STAGE_DECISIONS.PROCEED && !gatePassed) {
    errors.push('PROCEED to Stage B is strictly blocked when Stage B entry gate criteria are unmet or unknown (All 5 gate criteria must be MET).');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates R5 Journal Entry before saving
 */
export function validateR5JournalEntry(entry) {
  const errors = [];

  if (!entry.journal_id || !/^TF-CD01-J\d{3,}$/.test(entry.journal_id)) {
    errors.push('Journal ID must be in format TF-CD01-Jxxx.');
  }

  if (!entry.participant_ref || !/^TF-CD01-P\d{3,}$/.test(entry.participant_ref)) {
    errors.push('Journal entry must reference a valid participant ref (TF-CD01-Pxxx).');
  }

  if (!entry.action_performed || entry.action_performed.trim().length < 3) {
    errors.push('Action or check performed description is required.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Scans existing participants for potential duplicate records
 * Checks phone number, name similarity, and business label
 */
export function detectDuplicateCandidates(newCandidate, existingParticipants = []) {
  const duplicates = [];

  const newPhone = (newCandidate.phone_contact || '').replace(/\D/g, '');
  const newName = (newCandidate.full_name || '').toLowerCase().trim();
  const newBusiness = (newCandidate.business_details?.business_label || '').toLowerCase().trim();

  existingParticipants.forEach(existing => {
    // Ignore self when updating
    if (existing.participant_ref === newCandidate.participant_ref) return;

    const existingPhone = (existing.phone_contact || '').replace(/\D/g, '');
    const existingName = (existing.full_name || '').toLowerCase().trim();
    const existingBusiness = (existing.business_details?.business_label || '').toLowerCase().trim();

    let matchReason = [];

    // Check Phone match
    if (newPhone && existingPhone && newPhone === existingPhone) {
      matchReason.push(`Exact phone match (${existing.phone_contact})`);
    }

    // Check Exact Name match
    if (newName && existingName && newName === existingName) {
      matchReason.push(`Identical candidate name ('${existing.full_name}')`);
    }

    // Check Business Name match for retail buyers
    if (newBusiness && existingBusiness && newBusiness === existingBusiness && newBusiness.length > 3) {
      matchReason.push(`Identical business label ('${existing.business_details.business_label}')`);
    }

    if (matchReason.length > 0) {
      duplicates.push({
        existing_participant: existing,
        match_reasons: matchReason
      });
    }
  });

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates
  };
}
