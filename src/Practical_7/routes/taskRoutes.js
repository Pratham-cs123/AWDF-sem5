const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

let tasks = [
  {
    id: 1,
    title: "Learn Node.js",
    completed: false
  }
];

// ==========================
// GET ALL TASKS
// ==========================
router.get("/", authenticate, (req, res) => {
  res.status(200).json(tasks);
});

// ==========================
// GET TASK BY ID
// ==========================
router.get("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.status(200).json(task);
});

// ==========================
// CREATE TASK
// ==========================
router.post("/", authenticate, (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = {
    id: nextId,
    title: req.body.title,
    completed: req.body.completed || false
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task created successfully",
    task: newTask
  });
});

// ==========================
// UPDATE TASK
// ==========================
router.put("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  if (req.body.title !== undefined) {
    if (!req.body.title.trim()) {
      return res.status(400).json({
        message: "Task title cannot be empty"
      });
    }
    task.title = req.body.title;
  }

  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  res.status(200).json({
    message: "Task updated successfully",
    task: task
  });
});

// ==========================
// DELETE TASK
// ==========================
router.delete("/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks.splice(index, 1);

  res.status(200).json({
    message: "Task deleted successfully"
  });
});

module.exports = router;