import './ux.test.js';
/**
 * Node Test Runner for TradeFlow CD-01 to CD-05 Unit Test Suite & AI Intelligence Layer
 */
import { runQualificationTests } from './qualification.test.js';
import { runValidationTests } from './validation.test.js';
import { runCasesAndJobsTests } from './casesAndJobs.test.js';
import { runStageDecisionsTests } from './stageDecisions.test.js';
import { runAiIntegrationTests } from './aiIntegration.test.js';
import { runTranscriptionBenchmark } from '../../server/tests/benchmarkTranscription.js';

console.log('====================================================');
console.log(' TRADEFLOW DISCOVERY OPERATIONS — UNIT TEST SUITE');
console.log('====================================================\n');

async function main() {
  const res1 = runQualificationTests();
  const res2 = runValidationTests();
  const res3 = runCasesAndJobsTests();
  const res4 = runStageDecisionsTests();
  const aiPassed = await runAiIntegrationTests();
  const benchPassed = await runTranscriptionBenchmark();

  const totalPassed = res1.passed + res2.passed + res3.passed + res4.passed + (aiPassed ? 15 : 0) + (benchPassed ? 3 : 0);
  const totalTests = res1.total + res2.total + res3.total + res4.total + 15 + 3;

  console.log('====================================================');
  if (totalPassed === totalTests) {
    console.log(` ALL ${totalTests} UNIT & BENCHMARK TESTS PASSED SUCCESSFULLY! ✓`);
    console.log('====================================================');
    process.exit(0);
  } else {
    console.error(` TEST SUITE FAILED: ${totalTests - totalPassed} tests failed.`);
    console.log('====================================================');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
