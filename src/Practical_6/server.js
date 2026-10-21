const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb_pr6';

// Task model
let Task;
try {
  Task = require('./models/Task');
} catch (e) {
  const Schema = mongoose.Schema;
  Task = mongoose.model('Task', new Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false }
  }, { timestamps: true }));
}

// In-memory fallback if MongoDB is not available
let isMongoConnected = false;
let memoryTasks = [
  { _id: '1', title: 'Complete Practical 6', description: 'Integrate React frontend with Express backend', completed: true, createdAt: new Date() },
  { _id: '2', title: 'Test CRUD APIs with Postman', description: 'Validate GET, POST, PUT, DELETE endpoints', completed: false, createdAt: new Date() }
];

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('MongoDB connected successfully for Practical 06');
  })
  .catch((err) => {
    isMongoConnected = false;
    console.warn('MongoDB connection failed. Using in-memory store for Practical 06:', err.message);
  });

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[Practical 06 API] [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Health
app.get('/', (req, res) => {
  res.json({
    practical: 'Practical 06: Full-Stack Task Manager Backend',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'In-Memory Fallback',
    endpoints: {
      getTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id'
    }
  });
});

// GET /tasks - Get all tasks
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

// GET /tasks/:id - Get task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const task = await Task.findById(id);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(task);
    }
    const task = memoryTasks.find((t) => t._id === id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks - Create task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (isMongoConnected) {
      const newTask = await Task.create({ title: title.trim(), description: description || '', completed: !!completed });
      return res.status(201).json(newTask);
    }
    const newTask = {
      _id: Date.now().toString(),
      title: title.trim(),
      description: description || '',
      completed: !!completed,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryTasks.push(newTask);
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    if (isMongoConnected) {
      const updated = await Task.findByIdAndUpdate(
        id,
        { ...(title && { title: title.trim() }), ...(description !== undefined && { description }), ...(completed !== undefined && { completed }) },
        { new: true, runValidators: true }
      );
      if (!updated) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json(updated);
    }
    const index = memoryTasks.findIndex((t) => t._id === id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    memoryTasks[index] = {
      ...memoryTasks[index],
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed }),
      updatedAt: new Date()
    };
    res.status(200).json(memoryTasks[index]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /tasks/:id - Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Task not found' });
      return res.status(200).json({ message: 'Task deleted successfully', task: deleted });
    }
    const index = memoryTasks.findIndex((t) => t._id === id);
    if (index === -1) return res.status(404).json({ error: 'Task not found' });
    const deleted = memoryTasks.splice(index, 1)[0];
    res.status(200).json({ message: 'Task deleted successfully', task: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Practical 06 Server running at http://localhost:${PORT}`);
});

module.exports = app;
