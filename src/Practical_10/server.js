const express = require('express');
const cors = require('cors');
const taskEvents = require('./events');
const { eventLogs } = require('./listeners'); // Ensure listeners are registered at server startup

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// In-memory Task collection for demonstration
let tasks = [
  {
    id: 1,
    title: 'Setup EventEmitter for background processing',
    description: 'Decouple side-effects from HTTP response cycle',
    assignedUser: 'Pratham (d25cs123)',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Configure Docker Compose multi-container stack',
    description: 'Prepare Practical 11 Docker orchestration',
    assignedUser: 'Jayraj (d25cs117)',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// Service Information Endpoint
app.get('/', (req, res) => {
  res.json({
    practical: 'Practical 10: Asynchronous Processing with Event-Driven Architecture',
    pattern: 'Node.js native EventEmitter (Decoupled background processing)',
    endpoints: {
      getTasks: 'GET /tasks',
      createTask: 'POST /tasks (Emits task-created event asynchronously)',
      deleteTask: 'DELETE /tasks/:id (Emits task-deleted event)',
      simulateError: 'POST /tasks/simulate-error (Emits error event)',
      eventLogs: 'GET /debug/event-logs (Compare API vs Background timestamps)'
    }
  });
});

// GET /tasks - Return all tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

/**
 * POST /tasks
 * Step 3 from Lab Manual:
 * Emit the event right after creating the task, and respond IMMEDIATELY.
 * Notice: res.status(201).json(...) executes BEFORE the slow notification listener finishes!
 */
app.post('/tasks', (req, res) => {
  const { title, description, assignedUser } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const responseTimestamp = new Date().toISOString();
  console.log(`\n========================================================`);
  console.log(`⚡ [API GATEWAY] Received POST /tasks at: ${responseTimestamp}`);

  const newTask = {
    id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title: title.trim(),
    description: description || '',
    assignedUser: assignedUser || 'Student_D25CS123',
    completed: false,
    createdAt: responseTimestamp,
    apiResponseTimestamp: responseTimestamp
  };

  tasks.push(newTask);

  // 1. Respond to HTTP client immediately with status 201
  console.log(`🚀 [API GATEWAY] Sending 201 Created HTTP response to client at: ${responseTimestamp}`);
  res.status(201).json({
    message: 'Task created successfully. Notification dispatched in background.',
    task: newTask,
    apiTimestamp: responseTimestamp,
    note: 'Observe terminal: Notification handler finishes ~1500ms AFTER this response!'
  });

  // 2. Emit event asynchronously - doesn't block the HTTP response!
  taskEvents.emit('task-created', newTask);
  console.log(`📡 [API GATEWAY] Emitted 'task-created' event to event loop`);
  console.log(`========================================================\n`);
});

/**
 * DELETE /tasks/:id
 * Supplementary Problem 1: task-deleted event
 */
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deleted = tasks.splice(index, 1)[0];
  const responseTimestamp = new Date().toISOString();

  // Send response first
  res.status(200).json({
    message: `Task #${id} deleted`,
    deletedTask: deleted,
    apiTimestamp: responseTimestamp
  });

  // Emit task-deleted event
  taskEvents.emit('task-deleted', {
    id,
    title: deleted.title,
    deletedBy: req.body.user || 'Admin'
  });
});

/**
 * POST /tasks/simulate-error
 * Supplementary Problem 2: error event listener test
 */
app.post('/tasks/simulate-error', (req, res) => {
  const responseTimestamp = new Date().toISOString();

  res.status(200).json({
    message: 'Simulated error triggered. Server caught it safely without crashing!',
    apiTimestamp: responseTimestamp
  });

  // Emit an error event
  taskEvents.emit('error', new Error('Simulated external notification service timeout (504)'));
});

/**
 * GET /debug/event-logs
 * Inspection route to verify timestamps of API response vs Worker completion
 */
app.get('/debug/event-logs', (req, res) => {
  res.status(200).json({
    totalEventsLogged: eventLogs.length,
    events: eventLogs
  });
});

app.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(` Practical 10: Event-Driven Background Processing Server`);
  console.log(` Running at : http://localhost:${PORT}`);
  console.log(` EventEmitter ready. Listeners registered in listeners.js`);
  console.log(`============================================================`);
});

module.exports = app;
