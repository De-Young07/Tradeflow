/**
 * Node Test Runner for TradeFlow CD-01 to CD-05 Unit Test Suite
 */
import { runQualificationTests } from './qualification.test.js';
import { runValidationTests } from './validation.test.js';
import { runCasesAndJobsTests } from './casesAndJobs.test.js';
import { runStageDecisionsTests } from './stageDecisions.test.js';

console.log('====================================================');
console.log(' TRADEFLOW DISCOVERY OPERATIONS — UNIT TEST SUITE');
console.log('====================================================\n');

const res1 = runQualificationTests();
const res2 = runValidationTests();
const res3 = runCasesAndJobsTests();
const res4 = runStageDecisionsTests();

const totalPassed = res1.passed + res2.passed + res3.passed + res4.passed;
const totalTests = res1.total + res2.total + res3.total + res4.total;

console.log('====================================================');
if (totalPassed === totalTests) {
  console.log(` ALL ${totalTests} UNIT TESTS PASSED SUCCESSFULLY! ✓`);
  console.log('====================================================');
  process.exit(0);
} else {
  console.error(` TEST SUITE FAILED: ${totalTests - totalPassed} tests failed.`);
  console.log('====================================================');
  process.exit(1);
}
