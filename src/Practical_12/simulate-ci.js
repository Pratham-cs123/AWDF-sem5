/**
 * Practical 12: Local CI/CD Pipeline Simulator
 * Simulates GitHub Actions runner output in terminal for lab journals & viva!
 */
const { execSync } = require('child_process');

console.log('='.repeat(65));
console.log(' GITHUB ACTIONS RUNNER SIMULATOR — CI PIPELINE');
console.log(' Workflow : .github/workflows/ci.yml');
console.log(' Trigger  : push (branch: refs/heads/main)');
console.log(' OS Image : ubuntu-latest (Node.js v18.x)');
console.log('='.repeat(65));

const runStep = (stepNumber, stepName, command) => {
  console.log(`\n▶ [Step ${stepNumber}] ${stepName}...`);
  const start = Date.now();
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`  ✓ Completed in ${duration}s`);
    return { success: true, output };
  } catch (err) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.error(`  ✗ Failed after ${duration}s:`);
    console.error(`    ${err.message.trim()}`);
    return { success: false, error: err };
  }
};

const main = () => {
  // Step 1: Simulated Checkout
  console.log('\n[Step 1] actions/checkout@v4 (Fetching repo at HEAD)...');
  console.log('  ✓ Repository successfully checked out into /home/runner/work/awdf');

  // Step 2: Simulated Node.js setup
  console.log('\n[Step 2] actions/setup-node@v4 (Configuring Node.js 18)...');
  console.log(`  ✓ Node.js active version: ${process.version}`);

  // Step 3: npm test
  console.log('\n[Step 3] Run automated tests via npm test...');
  try {
    const testOutput = execSync('npx jest --testPathPattern="tests/task.test.js"', {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: 'pipe'
    });
    console.log(testOutput);
    console.log('='.repeat(65));
    console.log(' 🎉 PIPELINE STATUS: PASSED (GREEN CHECKMARK)');
    console.log(' All 5 automated unit tests passed successfully!');
    console.log(' Ready for automatic production deployment.');
    console.log('='.repeat(65));
  } catch (err) {
    console.log(err.stdout || '');
    console.error(err.stderr || '');
    console.log('='.repeat(65));
    console.log(' ❌ PIPELINE STATUS: FAILED (RED X)');
    console.log(' One or more automated tests failed!');
    console.log(' Pull Request merge is blocked until tests are fixed.');
    console.log('='.repeat(65));
  }
};

main();
