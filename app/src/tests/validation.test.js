/**
 * Automated Unit Tests — Validation Rules & Duplicate Detection
 */
import { validateR1Participant, validateR5JournalEntry, detectDuplicateCandidates } from '../domain/validation.js';
import { createR1Participant, createR5JournalEntry } from '../domain/models.js';
import { ELIGIBILITY_STATUS, EXCLUSION_REASONS } from '../domain/constants.js';

export function runValidationTests() {
  console.log('--- RUNNING VALIDATION & DUPLICATE DETECTOR UNIT TESTS ---');
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

  // TEST 1: Valid R1 Participant Pass
  {
    const cand = createR1Participant({
      participant_ref: 'TF-CD01-P001',
      full_name: 'Mallam Garba Dikko',
      claimed_role: 'PRODUCER'
    });
    const val = validateR1Participant(cand);
    assert(val.isValid, 'Test 1: Valid R1 candidate passes validation');
  }

  // TEST 2: Ineligible Candidate Requires Structured Exclusion Reason
  {
    const cand = createR1Participant({
      participant_ref: 'TF-CD01-P002',
      full_name: 'Invalid Candidate',
      claimed_role: 'OTHER',
      eligibility_status: ELIGIBILITY_STATUS.INELIGIBLE,
      exclusion_reason: EXCLUSION_REASONS.NONE
    });
    const val = validateR1Participant(cand);
    assert(!val.isValid, 'Test 2: Ineligible candidate without exclusion reason fails validation');
  }

  // TEST 3: Operator Override Requires Justification
  {
    const cand = createR1Participant({
      participant_ref: 'TF-CD01-P003',
      full_name: 'Override Candidate',
      claimed_role: 'PRODUCER',
      operator_override: true,
      override_reason: 'Short' // less than 10 chars
    });
    const val = validateR1Participant(cand);
    assert(!val.isValid, 'Test 3: Operator override with short reason fails validation');
  }

  // TEST 4: Valid R5 Journal Entry
  {
    const entry = createR5JournalEntry({
      journal_id: 'TF-CD01-J001',
      participant_ref: 'TF-CD01-P001',
      action_performed: 'Telephone interview to reconstruct past sales'
    });
    const val = validateR5JournalEntry(entry);
    assert(val.isValid, 'Test 4: Valid R5 journal entry passes validation');
  }

  // TEST 5: Duplicate Candidate Detection (Case J)
  {
    const existing = [
      createR1Participant({ participant_ref: 'TF-CD01-P001', full_name: 'Alhaji Ibrahim', phone_contact: '08031234567', business_details: { business_label: 'Ibrahim Retail Store' } })
    ];

    const duplicateCand = createR1Participant({
      participant_ref: 'TF-CD01-P005',
      full_name: 'Alhaji Ibrahim',
      phone_contact: '08031234567',
      business_details: { business_label: 'Ibrahim Retail Store' }
    });

    const dupCheck = detectDuplicateCandidates(duplicateCand, existing);
    assert(dupCheck.hasDuplicates, 'Test 5: Duplicate phone/name candidate triggers warning');
    assert(dupCheck.duplicates.length === 1, 'Test 5: Exactly 1 duplicate match returned');
  }

  console.log(`Validation Tests Summary: ${passed}/${total} PASSED.\n`);
  return { passed, total };
}
