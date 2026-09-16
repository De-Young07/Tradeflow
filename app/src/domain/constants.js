/**
 * CD-01 to CD-05 Domain Constants & Schema Definitions
 */

export const RECORD_TYPES = {
  FIELD: 'FIELD',
  TEST: 'TEST'
};

export const TARGET_SCOPE = {
  COMMODITY: 'Tomatoes',
  STATE: 'Niger',
  LGA: 'Gurara',
  TOWN: 'Dikko'
};

export const CLAIMED_ROLES = {
  PRODUCER: 'PRODUCER',
  RETAIL_PURCHASER: 'RETAIL_PURCHASER',
  RETAIL_APPROVER: 'RETAIL_APPROVER',
  TRADER_REFERRAL: 'TRADER_REFERRAL',
  OTHER: 'OTHER'
};

export const CLAIMED_ROLE_LABELS = {
  PRODUCER: 'Actual Tomato Producer',
  RETAIL_PURCHASER: 'Retail Bulk Tomato Purchaser',
  RETAIL_APPROVER: 'Retail Purchase Approver / Budget Owner',
  TRADER_REFERRAL: 'Existing Trader / Referral Contact',
  OTHER: 'Other Non-Qualifying Contact'
};

export const REFERRAL_TYPES = {
  EXISTING_TRADER: 'EXISTING_TRADER',
  DIRECT_FIELD: 'DIRECT_FIELD',
  COMMUNITY_REFERRAL: 'COMMUNITY_REFERRAL',
  OTHER: 'OTHER'
};

export const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'ELIGIBLE',
  INELIGIBLE: 'INELIGIBLE',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION'
};

export const CONTACT_OUTCOMES = {
  NOT_CONTACTED: 'NOT_CONTACTED',
  NO_RESPONSE: 'NO_RESPONSE',
  REACHED: 'REACHED',
  DECLINED: 'DECLINED',
  AGREED: 'AGREED'
};

export const PARTICIPATION_STATUS = {
  NOT_ENROLLED: 'NOT_ENROLLED',
  DISCOVERY_PARTICIPANT: 'DISCOVERY_PARTICIPANT',
  WITHDRAWN: 'WITHDRAWN'
};

export const EXCLUSION_REASONS = {
  OUTSIDE_COMMODITY: 'OUTSIDE_COMMODITY',
  OUTSIDE_GEOGRAPHY: 'OUTSIDE_GEOGRAPHY',
  WRONG_ROLE: 'WRONG_ROLE',
  NO_PURCHASE_AUTHORITY: 'NO_PURCHASE_AUTHORITY',
  TRADER_ONLY: 'TRADER_ONLY',
  REFERRAL_NOT_VERIFIED: 'REFERRAL_NOT_VERIFIED',
  DUPLICATE: 'DUPLICATE',
  OTHER: 'OTHER',
  NONE: 'NONE'
};

export const EXCLUSION_REASON_LABELS = {
  OUTSIDE_COMMODITY: 'Outside Scope: Not a Tomato producer/buyer',
  OUTSIDE_GEOGRAPHY: 'Outside Scope: Outside Dikko / Niger State area',
  WRONG_ROLE: 'Wrong Role: Not a producer or retail bulk purchaser',
  NO_PURCHASE_AUTHORITY: 'No Authority: Lacks bulk purchasing/approval authority',
  TRADER_ONLY: 'Trader Only: Intermediary/Trader view only',
  REFERRAL_NOT_VERIFIED: 'Unverified Referral: Trader lead pending direct check',
  DUPLICATE: 'Duplicate Candidate Record',
  OTHER: 'Other Exclusion Reason',
  NONE: 'None (Candidate Eligible)'
};

export const EVIDENCE_STATUS = {
  REPORTED: 'REPORTED',
  ESTIMATED: 'ESTIMATED',
  CHECKED: 'CHECKED',
  UNKNOWN: 'UNKNOWN'
};

export const EVENT_TYPES = {
  CONTACT_ATTEMPT: 'CONTACT_ATTEMPT',
  QUALIFICATION_CHECK: 'QUALIFICATION_CHECK',
  AUTHORITY_CHECK: 'AUTHORITY_CHECK',
  PERMISSION_REQUEST: 'PERMISSION_REQUEST',
  REFUSAL_LOG: 'REFUSAL_LOG',
  STATUS_CHANGE: 'STATUS_CHANGE',
  FOLLOW_UP: 'FOLLOW_UP'
};

export const CHANNEL_TYPES = {
  PHONE_CALL: 'PHONE_CALL',
  DIRECT_CONVERSATION: 'DIRECT_CONVERSATION',
  PHYSICAL_VISIT: 'PHYSICAL_VISIT',
  THIRD_PARTY_VERIFICATION: 'THIRD_PARTY_VERIFICATION'
};

/* --- FEATURE #2 ENUMS (CD-02, CD-03, CD-04) --- */

export const CASE_TYPES = {
  RECENT_TRANSACTION: 'RECENT_TRANSACTION',
  DIFFICULT_INCIDENT: 'DIFFICULT_INCIDENT'
};

export const TRANSACTION_RESULTS = {
  SUCCESSFUL_TRANSACTION: 'SUCCESSFUL_TRANSACTION',
  FAILED_TRANSACTION: 'FAILED_TRANSACTION',
  PARTIAL_SUCCESS: 'PARTIAL_SUCCESS'
};

export const CONSEQUENCE_TYPES = {
  PRICE_DISCOUNT: 'PRICE_DISCOUNT',
  PRODUCE_SPOILAGE: 'PRODUCE_SPOILAGE',
  PAYMENT_DELAY: 'PAYMENT_DELAY',
  CUSTOMER_LOSS: 'CUSTOMER_LOSS',
  NONE: 'NONE'
};

export const CONSEQUENCE_LABELS = {
  PRICE_DISCOUNT: 'Forced Price Discount / Markdown',
  PRODUCE_SPOILAGE: 'Produce Spoilage / Rejected Batch',
  PAYMENT_DELAY: 'Delayed Payment / Unpaid Debt',
  CUSTOMER_LOSS: 'Lost Customer / Buyer Relationship Breakdown',
  NONE: 'None (Successful Working Transaction)'
};

export const JOB_TYPES = {
  NEXT_SALE: 'NEXT_SALE',
  NEXT_PURCHASE: 'NEXT_PURCHASE',
  NO_UPCOMING_JOB: 'NO_UPCOMING_JOB'
};

export const BENEFICIARY_PAYER_STATUS = {
  UNKNOWN: 'UNKNOWN'
};

/* --- FEATURE #3 ENUMS (CD-05 / R4 RECORD) --- */

export const DECISION_POINTS = {
  DISCOVERY_REVIEW: 'DISCOVERY_REVIEW',
  STAGE_B_GATE: 'STAGE_B_GATE',
  FINAL_REVIEW: 'FINAL_REVIEW'
};

export const STAGE_DECISIONS = {
  PROCEED: 'PROCEED',
  NARROW: 'NARROW',
  PAUSE: 'PAUSE',
  REJECT: 'REJECT'
};

export const CRITERIA_RESULTS = {
  MET: 'MET',
  UNMET: 'UNMET',
  UNKNOWN: 'UNKNOWN'
};

export const STAGE_DECISION_LABELS = {
  PROCEED: 'PROCEED (Gate Passed — Ready for Stage B)',
  NARROW: 'NARROW (Scope Narrowed to Segment)',
  PAUSE: 'PAUSE (Paused Pending Evidence)',
  REJECT: 'REJECT (Hypothesis Rejected)'
};

export const GATE_CRITERIA_LABELS = {
  unresolved_problem: '1. Real, documented, unresolved transaction failure (CD-02/03)',
  upcoming_job: '2. Concrete upcoming sale or purchase job identified (CD-04)',
  actionable_deadline: '3. Actionable deadline established before commitment (CD-04)',
  active_acceptance: '4. Participant actively requested/accepted specific bounded help (R5)',
  feasible_responsibilities: '5. Required task responsibilities are within team capability (CD-05)'
};

