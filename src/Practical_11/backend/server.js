const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
// Connect via Docker service name "mongodb" defined in docker-compose.yml
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';

let Task = require('./models/Task');
let isMongoConnected = false;
let memoryTasks = [
  { _id: '1', title: 'Containerize backend service', description: 'Run Node 18 Express inside Docker container', completed: true },
  { _id: '2', title: 'Containerize frontend service', description: 'Build Vite/React using multi-stage build', completed: true },
  { _id: '3', title: 'Verify bridge network communication', description: 'Ensure frontend talks to backend, backend talks to mongodb', completed: false }
];

console.log(`[Docker Backend] Attempting connection to MongoDB at: ${MONGO_URI}`);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✅ [Docker Backend] Successfully connected to containerized MongoDB!');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('⚠️ [Docker Backend] MongoDB container not reachable, running with in-memory store:', err.message);
  });

app.use(cors());
app.use(express.json());

// Request logging with container timestamp
app.use((req, res, next) => {
  console.log(`[Docker Container: task_backend] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Health endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'task_backend',
    status: 'running',
    container: 'Docker Container (Node 18)',
    database: isMongoConnected ? 'MongoDB Container (task_mongodb)' : 'In-Memory Store',
    mongoUri: MONGO_URI,
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// GET /tasks
app.get('/tasks', async (req, res) => {
  try {
    if (isMongoConnected) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    }
    res.status(200).json(memoryTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });

    if (isMongoConnected) {
      const created = await Task.create({ title: title.trim(), description: description || '' });
      return res.status(201).json(created);
    }

    const newTask = {
      _id: Date.now().toString(),
      title: title.trim(),
      description: description || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    memoryTasks.unshift(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const removed = await Task.findByIdAndDelete(id);
      if (!removed) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json({ message: 'Deleted from MongoDB container' });
    }
    const idx = memoryTasks.findIndex((t) => t._id === id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    memoryTasks.splice(idx, 1);
    res.status(200).json({ message: 'Deleted from container memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [Docker Backend] Listening on port ${PORT}`);
});
