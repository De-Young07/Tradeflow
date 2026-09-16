/**
 * Seed Dataset for CD-01 to CD-05 Modules
 * NOTE: All seed records are explicitly tagged record_type: "TEST"
 */
import { createR1Participant, createR2Case, createR3Job, createR4Decision, createR5JournalEntry } from '../domain/models.js';
import {
  RECORD_TYPES,
  ELIGIBILITY_STATUS,
  CONTACT_OUTCOMES,
  PARTICIPATION_STATUS,
  EXCLUSION_REASONS,
  EVIDENCE_STATUS,
  EVENT_TYPES,
  CHANNEL_TYPES,
  CLAIMED_ROLES,
  CASE_TYPES,
  TRANSACTION_RESULTS,
  CONSEQUENCE_TYPES,
  JOB_TYPES,
  DECISION_POINTS,
  STAGE_DECISIONS,
  CRITERIA_RESULTS
} from '../domain/constants.js';

export function getSeedData() {
  const participants = [
    // 1. Qualified Dikko Tomato Farmer
    createR1Participant({
      participant_ref: 'TF-CD01-P001',
      record_type: RECORD_TYPES.TEST,
      full_name: 'Mallam Garba Dikko',
      phone_contact: '08031234501',
      claimed_role: CLAIMED_ROLES.PRODUCER,
      commodity: 'Tomatoes',
      geography: { state: 'Niger', lga: 'Gurara', town: 'Dikko', market: 'Dikko Central', within_discovery_area: true },
      referral_source: 'Direct Field Outreach',
      referral_type: 'DIRECT_FIELD',
      authority_info: { stock_control: true, purchase_approval: false, spending_authority: false, verification_level: 'VERIFIED' },
      eligibility_status: ELIGIBILITY_STATUS.ELIGIBLE,
      contact_outcome: CONTACT_OUTCOMES.AGREED,
      participation_status: PARTICIPATION_STATUS.DISCOVERY_PARTICIPANT,
      exclusion_reason: EXCLUSION_REASONS.NONE,
      qualification_basis: 'Confirmed 2.5 hectare active tomato farm in Dikko. Has full authority over harvest sales timing and lot pricing.',
      created_at: '2026-09-16T09:00:00.000Z',
      updated_at: '2026-09-16T10:15:00.000Z'
    }),

    // 2. Retail Bulk Buyer in Niger State (Agreed & Qualified)
    createR1Participant({
      participant_ref: 'TF-CD01-P002',
      record_type: RECORD_TYPES.TEST,
      full_name: 'Alhaji Ibrahim Suleja',
      phone_contact: '08029876543',
      claimed_role: CLAIMED_ROLES.RETAIL_PURCHASER,
      commodity: 'Tomatoes',
      geography: { state: 'Niger', lga: 'Suleja', town: 'Suleja/Dikko corridor', market: 'Old Market', within_discovery_area: true },
      referral_source: 'Direct Outreach',
      referral_type: 'DIRECT_FIELD',
      business_details: { business_label: 'Suleja Quality Retail Mart', store_location: 'Suleja Highway', scale: '50-100 baskets/week' },
      authority_info: { stock_control: true, purchase_approval: true, spending_authority: true, verification_level: 'VERIFIED' },
      eligibility_status: ELIGIBILITY_STATUS.ELIGIBLE,
      contact_outcome: CONTACT_OUTCOMES.AGREED,
      participation_status: PARTICIPATION_STATUS.DISCOVERY_PARTICIPANT,
      exclusion_reason: EXCLUSION_REASONS.NONE,
      qualification_basis: 'Controls produce procurement budget and approves weekly bulk tomato purchases for retail grocery store chain.',
      created_at: '2026-09-16T09:30:00.000Z',
      updated_at: '2026-09-16T10:45:00.000Z'
    }),

    // 3. Unverified Trader Referral (Rashsidat lead)
    createR1Participant({
      participant_ref: 'TF-CD01-P003',
      record_type: RECORD_TYPES.TEST,
      full_name: 'Usman Bako (Referred by Rashsidat)',
      phone_contact: '08055551234',
      claimed_role: CLAIMED_ROLES.RETAIL_PURCHASER,
      commodity: 'Tomatoes',
      geography: { state: 'Niger', lga: 'Gurara', town: 'Dikko', within_discovery_area: true },
      referral_source: 'Trader Rashsidat',
      referral_type: 'EXISTING_TRADER',
      business_details: { business_label: 'Bako Produce Outlet', store_location: 'Dikko Junction' },
      authority_info: { stock_control: false, purchase_approval: false, spending_authority: false, verification_level: 'NOT_VERIFIED' },
      eligibility_status: ELIGIBILITY_STATUS.PENDING_VERIFICATION,
      contact_outcome: CONTACT_OUTCOMES.NOT_CONTACTED,
      participation_status: PARTICIPATION_STATUS.NOT_ENROLLED,
      exclusion_reason: EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED,
      system_recommendation: { status: ELIGIBILITY_STATUS.PENDING_VERIFICATION, failed_checks: ['Trader referral role & authority unverified'], explanation: 'Pending direct phone verification.' },
      qualification_basis: 'Referred by existing trader Rashsidat. Requires direct phone call check to establish retail purchasing authority.',
      created_at: '2026-09-16T10:00:00.000Z',
      updated_at: '2026-09-16T10:00:00.000Z'
    }),

    // 4. Ineligible Non-Tomato Farmer (Maize)
    createR1Participant({
      participant_ref: 'TF-CD01-P004',
      record_type: RECORD_TYPES.TEST,
      full_name: 'Balarabe Dikko',
      phone_contact: '08077778899',
      claimed_role: CLAIMED_ROLES.PRODUCER,
      commodity: 'Maize',
      geography: { state: 'Niger', lga: 'Gurara', town: 'Dikko', within_discovery_area: true },
      referral_source: 'Local Farmers Association',
      referral_type: 'COMMUNITY_REFERRAL',
      authority_info: { stock_control: true, purchase_approval: false, spending_authority: false, verification_level: 'VERIFIED' },
      eligibility_status: ELIGIBILITY_STATUS.INELIGIBLE,
      contact_outcome: CONTACT_OUTCOMES.REACHED,
      participation_status: PARTICIPATION_STATUS.NOT_ENROLLED,
      exclusion_reason: EXCLUSION_REASONS.OUTSIDE_COMMODITY,
      qualification_basis: 'Grows Maize exclusively. Outside discovery scope (Tomatoes locked scope).',
      created_at: '2026-09-16T11:00:00.000Z',
      updated_at: '2026-09-16T11:20:00.000Z'
    }),

    // 5. Eligible Producer who Declined Participation
    createR1Participant({
      participant_ref: 'TF-CD01-P005',
      record_type: RECORD_TYPES.TEST,
      full_name: 'Mallam Haruna Kwamba',
      phone_contact: '08081112233',
      claimed_role: CLAIMED_ROLES.PRODUCER,
      commodity: 'Tomatoes',
      geography: { state: 'Niger', lga: 'Gurara', town: 'Dikko', within_discovery_area: true },
      referral_source: 'Direct Field',
      referral_type: 'DIRECT_FIELD',
      authority_info: { stock_control: true, purchase_approval: false, spending_authority: false, verification_level: 'VERIFIED' },
      eligibility_status: ELIGIBILITY_STATUS.ELIGIBLE,
      contact_outcome: CONTACT_OUTCOMES.DECLINED,
      participation_status: PARTICIPATION_STATUS.NOT_ENROLLED,
      exclusion_reason: EXCLUSION_REASONS.NONE,
      qualification_basis: 'Actual Dikko tomato producer. Reached via telephone call on 16 Sept but declined interview participation.',
      created_at: '2026-09-16T11:30:00.000Z',
      updated_at: '2026-09-16T11:45:00.000Z'
    })
  ];

  const cases = [
    createR2Case({
      case_ref: 'TF-CD02-C001',
      participant_ref: 'TF-CD01-P001',
      record_type: RECORD_TYPES.TEST,
      case_type: CASE_TYPES.DIFFICULT_INCIDENT,
      transaction_period: 'August 2026 Peak Harvest',
      participant_role: 'PRODUCER_SELLER',
      counterparty_desc: 'Wholesale buyer from Suleja market',
      product_grade: 'Grade A Red Tomatoes (Ripe)',
      quantity_unit: '40 Baskets',
      timing_payment_terms: 'Payment promised within 24 hours of delivery',
      steps_sequence: 'Farmer harvested 40 baskets on Monday. Buyer vehicle delayed by 2 days due to engine breakdown. Upon arrival, buyer claimed 15 baskets were soft/spoiled.',
      decision_makers: 'Farmer Mallam Garba and Buyer Agent',
      actual_result: TRANSACTION_RESULTS.FAILED_TRANSACTION,
      failure_point: 'Buyer vehicle delay caused produce spoilage; buyer forced a 40% price discount on remaining baskets.',
      current_workaround: 'Farmer accepted ₦2,500/basket instead of agreed ₦4,500 to avoid total loss.',
      successful_alternative: 'Direct sale to local village market traders in smaller 5-basket batches.',
      consequence_type: CONSEQUENCE_TYPES.PRICE_DISCOUNT,
      consequence_desc: 'Farmer lost ₦80,000 in potential revenue on 40 baskets due to transport delay and forced markdown.',
      consequence_amount: '₦80,000 lost revenue',
      estimate_basis: 'Farmer calculation based on original agreed price vs actual received cash',
      recurrence_basis: 'Happens 2-3 times every peak harvest season',
      refusal_reasons: 'Buyer refused full price citing degraded fruit firmness upon late arrival.',
      switching_conditions: 'Would switch to any buyer with guaranteed pickup vehicle within 12 hours of harvest.',
      evidence_status: EVIDENCE_STATUS.REPORTED,
      created_at: '2026-09-16T10:30:00.000Z'
    }),

    createR2Case({
      case_ref: 'TF-CD02-C002',
      participant_ref: 'TF-CD01-P002',
      record_type: RECORD_TYPES.TEST,
      case_type: CASE_TYPES.DIFFICULT_INCIDENT,
      transaction_period: 'July 2026 Procurement',
      participant_role: 'RETAIL_BUYER',
      counterparty_desc: 'Middleman supplier from Dikko aggregation point',
      product_grade: 'Grade B Mixed Size Tomatoes',
      quantity_unit: '80 Baskets',
      timing_payment_terms: '50% cash advance, 50% upon delivery inspection',
      steps_sequence: 'Retail store paid ₦150,000 advance for 80 baskets. Supplier delivered only 55 baskets claiming farm shortage, and delayed refunding the advance balance for 3 weeks.',
      decision_makers: 'Store Purchaser Alhaji Ibrahim',
      actual_result: TRANSACTION_RESULTS.FAILED_TRANSACTION,
      failure_point: 'Supplier short-delivered by 25 baskets and withheld cash advance for 3 weeks.',
      current_workaround: 'Store had to make emergency spot purchases at higher price from secondary market.',
      successful_alternative: 'Working with 2 backup suppliers on strict cash-on-delivery terms.',
      consequence_type: CONSEQUENCE_TYPES.PAYMENT_DELAY,
      consequence_desc: 'Retail store suffered empty shelf stock for 2 days and tied-up capital of ₦45,000 for 3 weeks.',
      consequence_amount: '₦45,000 tied capital (3 weeks)',
      estimate_basis: 'Store accounting receipt',
      recurrence_basis: 'Occurred twice during off-season supply dips',
      refusal_reasons: 'Middleman claimed farmers failed to deliver agreed quantity.',
      switching_conditions: 'Would switch to verified suppliers who confirm actual stock before taking advance payments.',
      evidence_status: EVIDENCE_STATUS.CHECKED,
      created_at: '2026-09-16T11:15:00.000Z'
    })
  ];

  const jobs = [
    createR3Job({
      job_ref: 'TF-CD04-J001',
      participant_ref: 'TF-CD01-P001',
      case_ref: 'TF-CD02-C001',
      record_type: RECORD_TYPES.TEST,
      job_type: JOB_TYPES.NEXT_SALE,
      job_requirements: 'Upcoming harvest of approx 60 baskets Grade A Red Tomatoes. Target price: ₦4,000/basket.',
      original_plan_fallback: 'Sell to existing Dikko roadside middleman at whatever spot price is offered on harvest morning if no buyer arrives.',
      last_actionable_datetime: '2026-09-24T18:00:00.000Z',
      stock_control_role: 'Mallam Garba (Farmer - Full authority)',
      purchase_approval_role: 'N/A (Seller side)',
      spending_authority_role: 'N/A (Seller side)',
      created_at: '2026-09-16T10:45:00.000Z'
    }),

    createR3Job({
      job_ref: 'TF-CD04-J002',
      participant_ref: 'TF-CD01-P002',
      case_ref: 'TF-CD02-C002',
      record_type: RECORD_TYPES.TEST,
      job_type: JOB_TYPES.NEXT_PURCHASE,
      job_requirements: 'Bulk procurement of 75 baskets Grade A/B Tomatoes for weekend retail stock. Delivery required by Friday 6:00 AM.',
      original_plan_fallback: 'Send store truck to Suleja central market on Thursday morning and purchase from spot traders.',
      last_actionable_datetime: '2026-09-25T12:00:00.000Z',
      stock_control_role: 'Alhaji Ibrahim (Retail Procurement Lead)',
      purchase_approval_role: 'Alhaji Ibrahim (Store Manager)',
      spending_authority_role: 'Alhaji Ibrahim (Controls procurement budget)',
      created_at: '2026-09-16T11:30:00.000Z'
    })
  ];

  const decisions = [
    // R4 Decision 1: Stage A Discovery Review (NARROW Scope)
    createR4Decision({
      decision_ref: 'TF-CD05-D001',
      record_type: RECORD_TYPES.TEST,
      discovery_scope: 'Tomatoes | Dikko/Niger State | Retail Businesses',
      decision_point: DECISION_POINTS.DISCOVERY_REVIEW,
      stage_decision: STAGE_DECISIONS.NARROW,
      supporting_case_refs: ['TF-CD01-P001', 'TF-CD01-P002', 'TF-CD02-C001'],
      contradictory_case_refs: ['TF-CD01-P004'],
      decision_rationale: 'Discovery evidence confirms repeated transport delay & forced price markdown losses for Dikko tomato producers. Target buyer scope narrowed to small/mid retail grocery stores with spending budget authority.',
      evidence_limits: 'Initial sample batch of 5 participants in Dikko/Suleja corridor. Broader Niger State validation remains unconfirmed.',
      unresolved_questions: 'Whether retail store budget owners will accept pre-checked grower supply without intermediary credit terms.',
      next_step_action: 'Complete direct authority verification calls with 2 remaining retail purchasers.',
      decision_maker: 'TradeFlow Experiment Lead',
      created_at: '2026-09-16T12:00:00.000Z'
    }),

    // R4 Decision 2: Stage B Entry Gate Evaluation (PAUSE - Pending Acceptance)
    createR4Decision({
      decision_ref: 'TF-CD05-D002',
      record_type: RECORD_TYPES.TEST,
      discovery_scope: 'Tomatoes | Dikko/Niger State | Retail Businesses',
      decision_point: DECISION_POINTS.STAGE_B_GATE,
      stage_decision: STAGE_DECISIONS.PAUSE,
      gate_assessment: {
        unresolved_problem: CRITERIA_RESULTS.MET,
        upcoming_job: CRITERIA_RESULTS.MET,
        actionable_deadline: CRITERIA_RESULTS.MET,
        active_acceptance: CRITERIA_RESULTS.UNKNOWN, // Active acceptance pending call
        feasible_responsibilities: CRITERIA_RESULTS.MET
      },
      supporting_case_refs: ['TF-CD01-P001', 'TF-CD04-J001'],
      decision_rationale: 'Unresolved transport delay problem and actionable harvest deadline established for Mallam Garba (25 Sept). Stage B entry PAUSED pending active acceptance of bounded introduction assistance.',
      evidence_limits: 'Candidate Mallam Garba expressed interest but explicit consent to contact sharing with buyer Alhaji Ibrahim is not yet logged.',
      unresolved_questions: 'Will both parties grant explicit permission to share phone contacts for manual introduction?',
      next_step_action: 'Log R5 permission check calls with both Mallam Garba and Alhaji Ibrahim.',
      decision_maker: 'TradeFlow Experiment Lead',
      created_at: '2026-09-16T12:30:00.000Z'
    })
  ];

  const journalEntries = [
    createR5JournalEntry({
      journal_id: 'TF-CD01-J001',
      participant_ref: 'TF-CD01-P001',
      timestamp: '2026-09-16T09:05:00.000Z',
      operator_id: 'Operator-A',
      channel: CHANNEL_TYPES.PHONE_CALL,
      event_type: EVENT_TYPES.CONTACT_ATTEMPT,
      action_performed: 'Initiated recruitment call to Mallam Garba Dikko',
      raw_response: 'Candidate answered phone and confirmed active tomato farming in Dikko.',
      evidence_status: EVIDENCE_STATUS.REPORTED
    }),
    createR5JournalEntry({
      journal_id: 'TF-CD01-J002',
      participant_ref: 'TF-CD01-P001',
      timestamp: '2026-09-16T10:15:00.000Z',
      operator_id: 'Operator-A',
      channel: CHANNEL_TYPES.PHYSICAL_VISIT,
      event_type: EVENT_TYPES.QUALIFICATION_CHECK,
      action_performed: 'Field visit to Dikko farm plot to verify crop production and reconstruct past incident (R2)',
      raw_response: 'Confirmed 2.5ha tomato field currently fruiting. Recorded past difficult transaction incident regarding vehicle delay and forced price markdown.',
      evidence_status: EVIDENCE_STATUS.CHECKED,
      previous_state: { eligibility: ELIGIBILITY_STATUS.PENDING_VERIFICATION, contact: CONTACT_OUTCOMES.REACHED, participation: PARTICIPATION_STATUS.NOT_ENROLLED },
      new_state: { eligibility: ELIGIBILITY_STATUS.ELIGIBLE, contact: CONTACT_OUTCOMES.AGREED, participation: PARTICIPATION_STATUS.DISCOVERY_PARTICIPANT }
    }),
    createR5JournalEntry({
      journal_id: 'TF-CD01-J003',
      participant_ref: 'TF-CD01-P005',
      timestamp: '2026-09-16T11:45:00.000Z',
      operator_id: 'Operator-B',
      channel: CHANNEL_TYPES.PHONE_CALL,
      event_type: EVENT_TYPES.REFUSAL_LOG,
      action_performed: 'Recruitment call for discovery interview',
      raw_response: 'Farmer confirmed role & location but stated he is busy with harvest and declined to participate.',
      evidence_status: EVIDENCE_STATUS.REPORTED,
      previous_state: { eligibility: ELIGIBILITY_STATUS.ELIGIBLE, contact: CONTACT_OUTCOMES.NOT_CONTACTED, participation: PARTICIPATION_STATUS.NOT_ENROLLED },
      new_state: { eligibility: ELIGIBILITY_STATUS.ELIGIBLE, contact: CONTACT_OUTCOMES.DECLINED, participation: PARTICIPATION_STATUS.NOT_ENROLLED }
    })
  ];

  return { participants, cases, jobs, decisions, journalEntries };
}
