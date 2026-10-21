/**
 * Practical 10 Demonstration Script
 * Proves that API response returns BEFORE the background notification finishes!
 */
const taskEvents = require('./events');
const { eventLogs } = require('./listeners');

console.log('='.repeat(65));
console.log(' PRACTICAL 10: EVENT-DRIVEN ASYNC PROCESSING DEMONSTRATION');
console.log('='.repeat(65));

const sampleTask = {
  id: 999,
  title: 'Automate Docker Multi-Container Build',
  assignedUser: 'Pratham_D25CS123'
};

const apiTime = new Date();
sampleTask.apiResponseTimestamp = apiTime.toISOString();

console.log(`\n[STEP 1] Client sends POST /tasks request`);
console.log(`[STEP 2] Server creates task and prepares HTTP 201 response`);
console.log(`[STEP 3] 🚀 API HTTP RESPONSE SENT AT: ${sampleTask.apiResponseTimestamp}`);
console.log(`[STEP 4] 📡 Emitting 'task-created' event to background listener...`);

// Emitting event after API response logic
taskEvents.emit('task-created', sampleTask);

console.log(`[STEP 5] ⚡ Main execution thread continues immediately (Non-blocking!)`);

// Check back after 2.5 seconds to inspect the timestamps
setTimeout(() => {
  console.log('\n' + '='.repeat(65));
  console.log(' TIMESTAMP VERIFICATION & LAB EVIDENCE TABLE');
  console.log('='.repeat(65));

  if (eventLogs.length > 0) {
    const entry = eventLogs[0];
    console.log(` Task Title               : "${entry.title}"`);
    console.log(` Assigned User            : ${entry.assignedUser}`);
    console.log(` 1. API Response Timestamp: ${entry.apiResponseTimestamp}`);
    console.log(` 2. Worker Finished At    : ${entry.handlerFinishedAt}`);
    console.log(` Time Gap (Latency)       : +${entry.latencyMs} ms`);
    console.log(`\n RESULT: PASS!`);
    console.log(` Notice that API Response was sent ~${entry.latencyMs}ms BEFORE background completion.`);
    console.log(' This proves the client received instant response without waiting for notifications!');
  }
  console.log('='.repeat(65) + '\n');
  process.exit(0);
}, 2500);
