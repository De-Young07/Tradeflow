/**
 * Automated Unit Tests — Feature #3: R4 Stage Decisions & Stage B Gate Evaluator
 */
import { validateR4Decision } from '../domain/validation.js';
import { createR4Decision } from '../domain/models.js';
import { DECISION_POINTS, STAGE_DECISIONS, CRITERIA_RESULTS } from '../domain/constants.js';

export function runStageDecisionsTests() {
  console.log('--- RUNNING FEATURE #3 (R4 STAGE DECISIONS & GATE) UNIT TESTS ---');
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

  // TEST 1: Valid R4 Decision Creation (NARROW / PAUSE)
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D001',
      decision_point: DECISION_POINTS.DISCOVERY_REVIEW,
      stage_decision: STAGE_DECISIONS.NARROW,
      decision_rationale: 'Evidence shows strong problem for producers in Dikko, but retail buyer scope needs narrowing to small grocery chains.'
    });
    const val = validateR4Decision(dec);
    assert(val.isValid, 'Test 1: Valid R4 NARROW decision passes validation');
  }

  // TEST 2: Stage B Gate Evaluation with 5/5 Criteria MET
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D002',
      decision_point: DECISION_POINTS.STAGE_B_GATE,
      stage_decision: STAGE_DECISIONS.PROCEED,
      gate_assessment: {
        unresolved_problem: CRITERIA_RESULTS.MET,
        upcoming_job: CRITERIA_RESULTS.MET,
        actionable_deadline: CRITERIA_RESULTS.MET,
        active_acceptance: CRITERIA_RESULTS.MET,
        feasible_responsibilities: CRITERIA_RESULTS.MET
      },
      decision_rationale: 'All 5 Stage B gate criteria satisfied. Producer and buyer have agreed to bounded manual introduction task.'
    });
    assert(dec.gate_assessment.gate_passed === true, 'Test 2: Gate passes when all 5 criteria are MET');
    const val = validateR4Decision(dec);
    assert(val.isValid, 'Test 2: PROCEED decision passes validation when 5/5 criteria are MET');
  }

  // TEST 3: Stage B Gate Evaluation with 1 Criteria UNMET
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D003',
      decision_point: DECISION_POINTS.STAGE_B_GATE,
      stage_decision: STAGE_DECISIONS.PROCEED,
      gate_assessment: {
        unresolved_problem: CRITERIA_RESULTS.MET,
        upcoming_job: CRITERIA_RESULTS.MET,
        actionable_deadline: CRITERIA_RESULTS.MET,
        active_acceptance: CRITERIA_RESULTS.UNMET, // UNMET
        feasible_responsibilities: CRITERIA_RESULTS.MET
      },
      decision_rationale: 'Attempting to proceed despite active acceptance being unmet.'
    });
    assert(dec.gate_assessment.gate_passed === false, 'Test 3: Gate fails when 1 criteria is UNMET');
    const val = validateR4Decision(dec);
    assert(!val.isValid, 'Test 3: PROCEED decision fails validation when gate criteria is UNMET');
  }

  // TEST 4: Stage B Gate Evaluation with 1 Criteria UNKNOWN
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D004',
      decision_point: DECISION_POINTS.STAGE_B_GATE,
      stage_decision: STAGE_DECISIONS.PROCEED,
      gate_assessment: {
        unresolved_problem: CRITERIA_RESULTS.MET,
        upcoming_job: CRITERIA_RESULTS.MET,
        actionable_deadline: CRITERIA_RESULTS.UNKNOWN, // UNKNOWN
        active_acceptance: CRITERIA_RESULTS.MET,
        feasible_responsibilities: CRITERIA_RESULTS.MET
      },
      decision_rationale: 'Attempting to proceed despite deadline being unknown.'
    });
    assert(dec.gate_assessment.gate_passed === false, 'Test 4: Gate fails when 1 criteria is UNKNOWN');
    const val = validateR4Decision(dec);
    assert(!val.isValid, 'Test 4: PROCEED decision fails validation when gate criteria is UNKNOWN');
  }

  // TEST 5: PAUSE Decision Allowed When Gate Fails
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D005',
      decision_point: DECISION_POINTS.STAGE_B_GATE,
      stage_decision: STAGE_DECISIONS.PAUSE,
      gate_assessment: {
        unresolved_problem: CRITERIA_RESULTS.MET,
        upcoming_job: CRITERIA_RESULTS.MET,
        actionable_deadline: CRITERIA_RESULTS.UNKNOWN,
        active_acceptance: CRITERIA_RESULTS.UNMET,
        feasible_responsibilities: CRITERIA_RESULTS.MET
      },
      decision_rationale: 'Pausing Stage B entry until candidate confirms active acceptance and exact actionable deadline date.'
    });
    const val = validateR4Decision(dec);
    assert(val.isValid, 'Test 5: PAUSE decision passes validation when gate criteria are unmet');
  }

  // TEST 6: REJECT Decision Preserves Contradictory Evidence Citations
  {
    const dec = createR4Decision({
      decision_ref: 'TF-CD05-D006',
      decision_point: DECISION_POINTS.FINAL_REVIEW,
      stage_decision: STAGE_DECISIONS.REJECT,
      contradictory_case_refs: ['TF-CD02-C002', 'TF-CD01-P004'],
      decision_rationale: 'Rejecting standalone intelligence proposition. Contradictory evidence shows traders rely on existing relationships and refuse to pay standalone fees.'
    });
    const val = validateR4Decision(dec);
    assert(val.isValid, 'Test 6: REJECT decision with contradictory case citations passes validation');
  }

  console.log(`Feature #3 Tests Summary: ${passed}/${total} PASSED.\n`);
  return { passed, total };
}
