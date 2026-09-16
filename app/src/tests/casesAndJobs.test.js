/**
 * Automated Unit Tests — Feature #2: R2 Transaction Cases & R3 Upcoming Jobs
 */
import { validateR2Case, validateR3Job } from '../domain/validation.js';
import { createR2Case, createR3Job } from '../domain/models.js';
import { CASE_TYPES, TRANSACTION_RESULTS, CONSEQUENCE_TYPES, JOB_TYPES, BENEFICIARY_PAYER_STATUS } from '../domain/constants.js';

export function runCasesAndJobsTests() {
  console.log('--- RUNNING FEATURE #2 (R2 CASES & R3 JOBS) UNIT TESTS ---');
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

  // TEST 1: Valid R2 Transaction Case Creation
  {
    const caseRec = createR2Case({
      case_ref: 'TF-CD02-C001',
      participant_ref: 'TF-CD01-P001',
      case_type: CASE_TYPES.RECENT_TRANSACTION,
      transaction_period: 'August 2026 Harvest',
      product_grade: 'Grade A Tomatoes (Red Ripe)',
      quantity_unit: '50 Baskets',
      timing_payment_terms: 'Immediate cash on collection',
      actual_result: TRANSACTION_RESULTS.SUCCESSFUL_TRANSACTION
    });
    const val = validateR2Case(caseRec);
    assert(val.isValid, 'Test 1: Valid R2 transaction case passes validation');
  }

  // TEST 2: Failed Transaction Case Requires Failure Point
  {
    const caseRec = createR2Case({
      case_ref: 'TF-CD02-C002',
      participant_ref: 'TF-CD01-P001',
      case_type: CASE_TYPES.DIFFICULT_INCIDENT,
      transaction_period: 'July 2026',
      actual_result: TRANSACTION_RESULTS.FAILED_TRANSACTION,
      failure_point: '' // Missing failure point
    });
    const val = validateR2Case(caseRec);
    assert(!val.isValid, 'Test 2: Failed transaction case without failure point fails validation');
  }

  // TEST 3: Difficult Incident with Spoilage Consequence
  {
    const caseRec = createR2Case({
      case_ref: 'TF-CD02-C003',
      participant_ref: 'TF-CD01-P002',
      case_type: CASE_TYPES.DIFFICULT_INCIDENT,
      transaction_period: 'Peak Harvest 2026',
      actual_result: TRANSACTION_RESULTS.FAILED_TRANSACTION,
      failure_point: 'Buyer cancelled truck arrival at last minute due to road closure',
      consequence_type: CONSEQUENCE_TYPES.PRODUCE_SPOILAGE,
      consequence_amount: '30 baskets spoiled (₦120,000 loss)'
    });
    const val = validateR2Case(caseRec);
    assert(val.isValid, 'Test 3: Difficult incident with spoilage consequence passes validation');
  }

  // TEST 4: Valid R3 Upcoming Job Creation
  {
    const jobRec = createR3Job({
      job_ref: 'TF-CD04-J001',
      participant_ref: 'TF-CD01-P001',
      case_ref: 'TF-CD02-C001',
      job_type: JOB_TYPES.NEXT_SALE,
      job_requirements: 'Harvest of 80 baskets expected 25 Sept',
      original_plan_fallback: 'Sell to local Dikko village market trader at discounted price if no bulk buyer',
      last_actionable_datetime: '2026-09-24T18:00:00Z'
    });
    const val = validateR3Job(jobRec);
    assert(val.isValid, 'Test 4: Valid R3 upcoming job with original fallback plan passes validation');
  }

  // TEST 5: Upcoming Job Missing Fallback Baseline
  {
    const jobRec = createR3Job({
      job_ref: 'TF-CD04-J002',
      participant_ref: 'TF-CD01-P001',
      job_type: JOB_TYPES.NEXT_SALE,
      original_plan_fallback: '' // Missing fallback
    });
    const val = validateR3Job(jobRec);
    assert(!val.isValid, 'Test 5: R3 upcoming job missing fallback baseline fails validation');
  }

  // TEST 6: Beneficiary Payer Status Must Be UNKNOWN in Stage A
  {
    const jobRec = createR3Job({
      job_ref: 'TF-CD04-J003',
      participant_ref: 'TF-CD01-P002',
      original_plan_fallback: 'Current supplier fallback',
      beneficiary_payer_status: BENEFICIARY_PAYER_STATUS.UNKNOWN
    });
    assert(jobRec.beneficiary_payer_status === BENEFICIARY_PAYER_STATUS.UNKNOWN, 'Test 6: Beneficiary/payer status is UNKNOWN in Stage A discovery');
  }

  console.log(`Feature #2 Tests Summary: ${passed}/${total} PASSED.\n`);
  return { passed, total };
}
