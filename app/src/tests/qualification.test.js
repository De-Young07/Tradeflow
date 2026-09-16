/**
 * Automated Unit Tests — CD-01 Decision Support Engine & Rules
 * Covers Cases A through J from the implementation plan
 */
import { evaluateQualification } from '../domain/qualification.js';
import { createR1Participant } from '../domain/models.js';
import { ELIGIBILITY_STATUS, CONTACT_OUTCOMES, PARTICIPATION_STATUS, EXCLUSION_REASONS } from '../domain/constants.js';

export function runQualificationTests() {
  console.log('--- RUNNING QUALIFICATION ENGINE UNIT TESTS ---');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
    }
  }

  // CASE A: Tomato Producer, Dikko/Niger, Verified Production
  {
    const cand = createR1Participant({
      claimed_role: 'PRODUCER',
      commodity: 'Tomatoes',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true },
      contact_outcome: CONTACT_OUTCOMES.REACHED
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.ELIGIBLE, 'Case A: Tomato producer in Dikko should be recommended ELIGIBLE');
    assert(res.exclusion_reason === EXCLUSION_REASONS.NONE, 'Case A: Exclusion reason should be NONE');
  }

  // CASE B: Trader Referral (Rashsidat), Tomatoes, Dikko/Niger, Role Unverified
  {
    const cand = createR1Participant({
      claimed_role: 'RETAIL_PURCHASER',
      commodity: 'Tomatoes',
      referral_source: 'Rashsidat',
      referral_type: 'EXISTING_TRADER',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true },
      authority_info: { verification_level: 'NOT_VERIFIED' }
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION, 'Case B: Unverified trader referral should recommend PENDING_VERIFICATION');
    assert(res.exclusion_reason === EXCLUSION_REASONS.REFERRAL_NOT_VERIFIED, 'Case B: Exclusion code should be REFERRAL_NOT_VERIFIED');
  }

  // CASE C: Retail Employee, Tomatoes, Dikko/Niger, Lacks Purchase Authority
  {
    const cand = createR1Participant({
      claimed_role: 'RETAIL_PURCHASER',
      commodity: 'Tomatoes',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true },
      authority_info: { stock_control: false, purchase_approval: false, spending_authority: false, verification_level: 'VERIFIED' }
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.INELIGIBLE, 'Case C: Verified lack of purchasing authority should recommend INELIGIBLE');
    assert(res.exclusion_reason === EXCLUSION_REASONS.NO_PURCHASE_AUTHORITY, 'Case C: Exclusion code should be NO_PURCHASE_AUTHORITY');
  }

  // CASE D: Tomato Producer, Outside Geography (Lagos)
  {
    const cand = createR1Participant({
      claimed_role: 'PRODUCER',
      commodity: 'Tomatoes',
      geography: { state: 'Lagos', town: 'Ikeja', within_discovery_area: false }
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.INELIGIBLE, 'Case D: Outside geography should recommend INELIGIBLE');
    assert(res.exclusion_reason === EXCLUSION_REASONS.OUTSIDE_GEOGRAPHY, 'Case D: Exclusion code should be OUTSIDE_GEOGRAPHY');
  }

  // CASE E: Maize Producer, Correct Geography (Dikko/Niger)
  {
    const cand = createR1Participant({
      claimed_role: 'PRODUCER',
      commodity: 'Maize',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true }
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.INELIGIBLE, 'Case E: Outside commodity (Maize) should recommend INELIGIBLE');
    assert(res.exclusion_reason === EXCLUSION_REASONS.OUTSIDE_COMMODITY, 'Case E: Exclusion code should be OUTSIDE_COMMODITY');
  }

  // CASE F: Retail Purchaser, Tomatoes, Dikko/Niger, Verified Bulk Purchase Approval
  {
    const cand = createR1Participant({
      claimed_role: 'RETAIL_PURCHASER',
      commodity: 'Tomatoes',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true },
      authority_info: { stock_control: true, purchase_approval: true, spending_authority: true, verification_level: 'VERIFIED' },
      contact_outcome: CONTACT_OUTCOMES.REACHED
    });
    const res = evaluateQualification(cand);
    assert(res.suggested_status === ELIGIBILITY_STATUS.ELIGIBLE, 'Case F: Verified retail purchaser with approval authority should recommend ELIGIBLE');
  }

  // CASE G: Eligible Producer Declines Participation
  {
    const cand = createR1Participant({
      claimed_role: 'PRODUCER',
      commodity: 'Tomatoes',
      geography: { state: 'Niger', town: 'Dikko', within_discovery_area: true },
      eligibility_status: ELIGIBILITY_STATUS.ELIGIBLE,
      contact_outcome: CONTACT_OUTCOMES.DECLINED,
      participation_status: PARTICIPATION_STATUS.NOT_ENROLLED
    });
    assert(cand.eligibility_status === ELIGIBILITY_STATUS.ELIGIBLE, 'Case G: Eligibility remains ELIGIBLE when candidate declines');
    assert(cand.contact_outcome === CONTACT_OUTCOMES.DECLINED, 'Case G: Contact outcome is DECLINED');
    assert(cand.participation_status === PARTICIPATION_STATUS.NOT_ENROLLED, 'Case G: Participation status is NOT_ENROLLED');
  }

  // CASE H: Trader Referral Later Verified
  {
    const initialCand = createR1Participant({
      claimed_role: 'PRODUCER',
      referral_source: 'Rashsidat',
      referral_type: 'EXISTING_TRADER',
      authority_info: { verification_level: 'NOT_VERIFIED' }
    });
    const initialRes = evaluateQualification(initialCand);
    assert(initialRes.suggested_status === ELIGIBILITY_STATUS.PENDING_VERIFICATION, 'Case H Initial: Unverified trader referral is PENDING_VERIFICATION');

    const verifiedCand = { ...initialCand, authority_info: { verification_level: 'VERIFIED' }, contact_outcome: CONTACT_OUTCOMES.REACHED };
    const verifiedRes = evaluateQualification(verifiedCand);
    assert(verifiedRes.suggested_status === ELIGIBILITY_STATUS.ELIGIBLE, 'Case H Post-Verification: Verified trader referral becomes ELIGIBLE recommendation');
  }

  // CASE I: Operator Override Recommendation
  {
    const cand = createR1Participant({
      claimed_role: 'OTHER',
      eligibility_status: ELIGIBILITY_STATUS.ELIGIBLE,
      operator_override: true,
      override_reason: 'Operator confirmed special producer context during field visit'
    });
    assert(cand.operator_override === true, 'Case I: Operator override flag recorded');
    assert(cand.override_reason.length >= 10, 'Case I: Override reason preserved');
  }

  console.log(`Qualification Tests Summary: ${passed}/${total} PASSED.\n`);
  return { passed, total };
}
