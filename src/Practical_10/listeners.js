const taskEvents = require('./events');

// Keep an in-memory audit log of background events for inspection & UI verification
const eventLogs = [];

/**
 * 1. Listener for 'task-created'
 * Decoupled background notification handler with simulated slow worker (1.5s delay)
 */
taskEvents.on('task-created', (task) => {
  const handlerStartTime = new Date();
  console.log(`\n🔔 [Background Worker] Received 'task-created' event for: "${task.title}"`);
  console.log(`   Handler Started At: ${handlerStartTime.toISOString()}`);
  console.log(`   Simulating external notification dispatch (SMS/Email/Webhook)...`);

  // Artificial delay (1500ms) to clearly prove non-blocking asynchronous execution
  setTimeout(() => {
    const handlerFinishTime = new Date();
    const logEntry = {
      event: 'task-created',
      taskId: task.id || task._id,
      title: task.title,
      assignedUser: task.assignedUser || 'Student_D25CS123',
      apiResponseTimestamp: task.apiResponseTimestamp,
      handlerStartedAt: handlerStartTime.toISOString(),
      handlerFinishedAt: handlerFinishTime.toISOString(),
      latencyMs: handlerFinishTime.getTime() - new Date(task.apiResponseTimestamp).getTime(),
      status: 'Notification successfully delivered in background'
    };

    eventLogs.unshift(logEntry);
    if (eventLogs.length > 50) eventLogs.pop();

    console.log(`✅ [Notification Complete] Task "${task.title}" notification delivered!`);
    console.log(`   Finished At : ${handlerFinishTime.toISOString()}`);
    console.log(`   Delay Taken : ~1500 ms (API was NEVER blocked!)\n`);
  }, 1500);
});

/**
 * 2. Supplementary Problem 1: Listener for 'task-deleted'
 */
taskEvents.on('task-deleted', (payload) => {
  const timestamp = new Date().toISOString();
  console.log(`\n🗑️ [Audit Listener] Task #${payload.id} deleted by ${payload.deletedBy || 'System'}`);
  console.log(`   Audit Logged At: ${timestamp}`);

  eventLogs.unshift({
    event: 'task-deleted',
    taskId: payload.id,
    deletedBy: payload.deletedBy || 'System',
    timestamp,
    status: 'Audit trail recorded'
  });
});

/**
 * 3. Supplementary Problem 2: Error Event Listener
 * Catches and logs errors thrown inside event handlers, preventing process crash
 */
taskEvents.on('error', (err) => {
  const timestamp = new Date().toISOString();
  console.error(`\n🚨 [EventEmitter Error Listener] Handled error safely:`, err.message);
  console.error(`   Error Logged At: ${timestamp}`);

  eventLogs.unshift({
    event: 'error',
    error: err.message,
    timestamp,
    status: 'Caught safely without crashing Node.js server process'
  });
});

module.exports = {
  eventLogs
};
