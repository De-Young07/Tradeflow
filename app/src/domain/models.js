/**
 * Domain Models & Factory Functions for R1, R2, R3, R4, R5 Records
 */
import {
  RECORD_TYPES,
  ELIGIBILITY_STATUS,
  CONTACT_OUTCOMES,
  PARTICIPATION_STATUS,
  EXCLUSION_REASONS,
  EVIDENCE_STATUS,
  EVENT_TYPES,
  CHANNEL_TYPES,
  TARGET_SCOPE,
  CASE_TYPES,
  TRANSACTION_RESULTS,
  CONSEQUENCE_TYPES,
  JOB_TYPES,
  BENEFICIARY_PAYER_STATUS,
  DECISION_POINTS,
  STAGE_DECISIONS,
  CRITERIA_RESULTS
} from './constants.js';

/**
 * Creates a structured R1 Participant Record
 */
export function createR1Participant(data = {}) {
  const now = new Date().toISOString();
  return {
    participant_ref: data.participant_ref || '',
    record_type: data.record_type || RECORD_TYPES.FIELD,
    full_name: data.full_name?.trim() || '',
    phone_contact: data.phone_contact?.trim() || '',
    claimed_role: data.claimed_role || '',
    commodity: data.commodity || TARGET_SCOPE.COMMODITY,
    geography: {
      state: data.geography?.state || TARGET_SCOPE.STATE,
      lga: data.geography?.lga || TARGET_SCOPE.LGA,
      town: data.geography?.town || TARGET_SCOPE.TOWN,
      market: data.geography?.market || '',
      within_discovery_area: data.geography?.within_discovery_area ?? true
    },
    referral_source: data.referral_source?.trim() || '',
    referral_type: data.referral_type || 'DIRECT_FIELD',
    business_details: {
      business_label: data.business_details?.business_label || '',
      store_location: data.business_details?.store_location || '',
      scale: data.business_details?.scale || ''
    },
    authority_info: {
      stock_control: data.authority_info?.stock_control ?? false,
      purchase_approval: data.authority_info?.purchase_approval ?? false,
      spending_authority: data.authority_info?.spending_authority ?? false,
      verification_level: data.authority_info?.verification_level || 'NOT_VERIFIED'
    },
    eligibility_status: data.eligibility_status || ELIGIBILITY_STATUS.PENDING_VERIFICATION,
    contact_outcome: data.contact_outcome || CONTACT_OUTCOMES.NOT_CONTACTED,
    participation_status: data.participation_status || PARTICIPATION_STATUS.NOT_ENROLLED,
    exclusion_reason: data.exclusion_reason || EXCLUSION_REASONS.NONE,
    exclusion_notes: data.exclusion_notes || '',
    system_recommendation: data.system_recommendation || { status: ELIGIBILITY_STATUS.PENDING_VERIFICATION, failed_checks: [], explanation: '' },
    operator_override: data.operator_override || false,
    override_reason: data.override_reason || '',
    qualification_basis: data.qualification_basis || '',
    created_at: data.created_at || now,
    updated_at: data.updated_at || now
  };
}

/**
 * Creates a structured R2 Discovery Transaction Case Record (CD-02, CD-03)
 */
export function createR2Case(data = {}) {
  const now = new Date().toISOString();
  return {
    case_ref: data.case_ref || '',
    participant_ref: data.participant_ref || '',
    record_type: data.record_type || RECORD_TYPES.FIELD,
    case_type: data.case_type || CASE_TYPES.RECENT_TRANSACTION,
    transaction_period: data.transaction_period?.trim() || '',
    participant_role: data.participant_role || 'PRODUCER_SELLER',
    counterparty_desc: data.counterparty_desc?.trim() || '',
    product_grade: data.product_grade?.trim() || '',
    quantity_unit: data.quantity_unit?.trim() || '',
    timing_payment_terms: data.timing_payment_terms?.trim() || '',
    steps_sequence: data.steps_sequence?.trim() || '',
    decision_makers: data.decision_makers?.trim() || '',
    actual_result: data.actual_result || TRANSACTION_RESULTS.SUCCESSFUL_TRANSACTION,
    failure_point: data.failure_point?.trim() || (data.actual_result === TRANSACTION_RESULTS.SUCCESSFUL_TRANSACTION ? 'NO_RECALLED_FAILURE' : ''),
    current_workaround: data.current_workaround?.trim() || '',
    successful_alternative: data.successful_alternative?.trim() || '',
    consequence_type: data.consequence_type || CONSEQUENCE_TYPES.NONE,
    consequence_desc: data.consequence_desc?.trim() || '',
    consequence_amount: data.consequence_amount?.trim() || 'Unknown',
    estimate_basis: data.estimate_basis?.trim() || 'Reported by candidate',
    recurrence_basis: data.recurrence_basis?.trim() || '',
    refusal_reasons: data.refusal_reasons?.trim() || '',
    switching_conditions: data.switching_conditions?.trim() || '',
    evidence_status: data.evidence_status || EVIDENCE_STATUS.REPORTED,
    created_at: data.created_at || now
  };
}

/**
 * Creates a structured R3 Upcoming Job & Baseline Brief Record (CD-04)
 */
export function createR3Job(data = {}) {
  const now = new Date().toISOString();
  return {
    job_ref: data.job_ref || '',
    participant_ref: data.participant_ref || '',
    case_ref: data.case_ref || '',
    record_type: data.record_type || RECORD_TYPES.FIELD,
    job_type: data.job_type || JOB_TYPES.NEXT_SALE,
    job_requirements: data.job_requirements?.trim() || '',
    original_plan_fallback: data.original_plan_fallback?.trim() || '',
    last_actionable_datetime: data.last_actionable_datetime || '',
    stock_control_role: data.stock_control_role?.trim() || '',
    purchase_approval_role: data.purchase_approval_role?.trim() || '',
    spending_authority_role: data.spending_authority_role?.trim() || '',
    beneficiary_payer_status: BENEFICIARY_PAYER_STATUS.UNKNOWN,
    created_at: data.created_at || now
  };
}

/**
 * Creates a structured R4 Experiment Scope & Decision Record (CD-05)
 */
export function createR4Decision(data = {}) {
  const now = new Date().toISOString();

  const gate = data.gate_assessment || {};
  const unresolved = gate.unresolved_problem || CRITERIA_RESULTS.UNKNOWN;
  const upcoming = gate.upcoming_job || CRITERIA_RESULTS.UNKNOWN;
  const deadline = gate.actionable_deadline || CRITERIA_RESULTS.UNKNOWN;
  const acceptance = gate.active_acceptance || CRITERIA_RESULTS.UNKNOWN;
  const feasible = gate.feasible_responsibilities || CRITERIA_RESULTS.UNKNOWN;

  const gatePassed = (unresolved === CRITERIA_RESULTS.MET && upcoming === CRITERIA_RESULTS.MET && deadline === CRITERIA_RESULTS.MET && acceptance === CRITERIA_RESULTS.MET && feasible === CRITERIA_RESULTS.MET);

  return {
    decision_ref: data.decision_ref || '',
    record_type: data.record_type || RECORD_TYPES.FIELD,
    discovery_scope: data.discovery_scope || 'Tomatoes | Dikko/Niger State | Retail Businesses',
    decision_point: data.decision_point || DECISION_POINTS.DISCOVERY_REVIEW,
    stage_decision: data.stage_decision || STAGE_DECISIONS.PAUSE,
    gate_assessment: {
      unresolved_problem: unresolved,
      upcoming_job: upcoming,
      actionable_deadline: deadline,
      active_acceptance: acceptance,
      feasible_responsibilities: feasible,
      gate_passed: gatePassed
    },
    supporting_case_refs: data.supporting_case_refs || [],
    contradictory_case_refs: data.contradictory_case_refs || [],
    decision_rationale: data.decision_rationale?.trim() || '',
    evidence_limits: data.evidence_limits?.trim() || '',
    unresolved_questions: data.unresolved_questions?.trim() || '',
    next_step_action: data.next_step_action?.trim() || '',
    decision_maker: data.decision_maker?.trim() || 'Operator Lead',
    created_at: data.created_at || now
  };
}

/**
 * Creates a structured R5 Journal Record
 */
export function createR5JournalEntry(data = {}) {
  const now = new Date().toISOString();
  return {
    journal_id: data.journal_id || '',
    participant_ref: data.participant_ref || '',
    timestamp: data.timestamp || now,
    operator_id: data.operator_id?.trim() || 'Operator',
    channel: data.channel || CHANNEL_TYPES.PHONE_CALL,
    event_type: data.event_type || EVENT_TYPES.CONTACT_ATTEMPT,
    action_performed: data.action_performed?.trim() || '',
    raw_response: data.raw_response?.trim() || '',
    evidence_status: data.evidence_status || EVIDENCE_STATUS.REPORTED,
    previous_state: data.previous_state || null,
    new_state: data.new_state || null,
    mismatch_details: data.mismatch_details?.trim() || '',
    ai_provenance: data.ai_provenance ? {
      recording_consent_granted: Boolean(data.ai_provenance.recording_consent_granted),
      consent_timestamp: data.ai_provenance.consent_timestamp || now,
      audio_storage_key: data.ai_provenance.audio_storage_key || '',
      operator_selected_language: data.ai_provenance.operator_selected_language || 'AUTO_DETECT',
      provider_detected_language: data.ai_provenance.provider_detected_language || '',
      code_switching_detected: Boolean(data.ai_provenance.code_switching_detected),
      transcription_provider: data.ai_provenance.transcription_provider || '',
      transcription_model_version: data.ai_provenance.transcription_model_version || '',
      original_transcript: data.ai_provenance.original_transcript || '',
      english_translation: data.ai_provenance.english_translation || '',
      ai_draft_analysis: data.ai_provenance.ai_draft_analysis || null,
      human_review: {
        review_state: data.ai_provenance.human_review?.review_state || 'AI_DRAFT',
        reviewer_id: data.ai_provenance.human_review?.reviewer_id || '',
        review_timestamp: data.ai_provenance.human_review?.review_timestamp || '',
        corrections_made: Boolean(data.ai_provenance.human_review?.corrections_made),
        approved_claims: data.ai_provenance.human_review?.approved_claims || []
      }
    } : null
  };
}
