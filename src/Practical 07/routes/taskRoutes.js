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
// CREATE TASK
// ==========================

router.post("/", authenticate, (req, res) => {

    // Input validation
    if (!req.body.title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const newTask = {
        id: tasks.length + 1,
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

    if (!req.body.title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    task.title = req.body.title;
    task.completed = req.body.completed;

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

const cache = require("../cache/cache"); // adjust relative path
 
// Inside your existing GET-all-tasks route:
router.get("/", async (req, res) => {
  try {
    const cacheKey = "all_tasks";
 
    const cachedTasks = cache.get(cacheKey);
 
    if (cachedTasks !== undefined) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cachedTasks);
    }
 
    const tasks = await Task.find();
 
    cache.set(cacheKey, tasks);
    res.set("X-Cache", "MISS");
 
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve tasks",
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cacheKey = `task_${req.params.id}`;
    const cachedTask = cache.get(cacheKey);
 
    if (cachedTask !== undefined) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(cachedTask);
    }
 
    const task = await Task.findById(req.params.id);
 
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
 
    cache.set(cacheKey, task);
    res.set("X-Cache", "MISS");
 
    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve task",
      error: error.message
    });
  }
});

// Add near the imports:
const cache = require("../cache/cache");
 
// After a successful POST that creates a task:
cache.del("all_tasks");
 
// After a successful PUT/PATCH for a task with id:
cache.del("all_tasks");
cache.del(`task_${req.params.id}`);
 
// After a successful DELETE for a task with id:
cache.del("all_tasks");
cache.del(`task_${req.params.id}`);

const stats = require("../cache/cacheStats");
 
// When a cached value is found:
stats.hits++;
 
// When the cache has no value:
stats.misses++;

router.get("/debug/cache-stats", (req, res) => {
  res.json({
    hits: stats.hits,
    misses: stats.misses,
    total: stats.hits + stats.misses
  });
});

module.exports = router;