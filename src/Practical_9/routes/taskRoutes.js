const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Task = require("../models/Task");
const cache = require("../cache/cache");
const stats = require("../cache/cacheStats");

// ==========================
// GET ALL TASKS (Cached)
// ==========================
router.get("/", async (req, res) => {
  try {
    const cacheKey = "all_tasks";
    const bypassCache = req.query.nocache === "true" || req.headers["x-no-cache"] === "true";

    if (!bypassCache) {
      const cachedTasks = cache.get(cacheKey);

      if (cachedTasks !== undefined) {
        stats.hits++;
        res.set("X-Cache", "HIT");
        return res.status(200).json(cachedTasks);
      }
      stats.misses++;
    } else {
      res.set("X-Cache", "BYPASS");
    }

    const tasks = await Task.find().sort({ createdAt: -1 });

    if (!bypassCache) {
      cache.set(cacheKey, tasks);
      res.set("X-Cache", "MISS");
    }

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve tasks",
      error: error.message
    });
  }
});

// ==========================
// CACHE STATS (Before :id to avoid route collision)
// ==========================
router.get("/debug/cache-stats", (req, res) => {
  return res.status(200).json({
    hits: stats.hits,
    misses: stats.misses,
    total: stats.hits + stats.misses
  });
});

// Clear cache endpoint for testing
router.post("/debug/cache-clear", (req, res) => {
  cache.flushAll();
  stats.hits = 0;
  stats.misses = 0;
  return res.status(200).json({
    message: "Cache cleared and statistics reset",
    stats: { hits: 0, misses: 0, total: 0 }
  });
});

// ==========================
// GET TASK BY ID (Cached)
// ==========================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `task_${id}`;
    const bypassCache = req.query.nocache === "true" || req.headers["x-no-cache"] === "true";

    if (!bypassCache) {
      const cachedTask = cache.get(cacheKey);

      if (cachedTask !== undefined) {
        stats.hits++;
        res.set("X-Cache", "HIT");
        return res.status(200).json(cachedTask);
      }
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    if (!bypassCache) {
      stats.misses++;
    } else {
      res.set("X-Cache", "BYPASS");
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!bypassCache) {
      cache.set(cacheKey, task);
      res.set("X-Cache", "MISS");
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve task",
      error: error.message
    });
  }
});

// ==========================
// CREATE TASK (Invalidates all_tasks)
// ==========================
router.post("/", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      completed: completed === true
    });

    // Cache Invalidation: Invalidate all_tasks list cache
    cache.del("all_tasks");

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create task",
      error: error.message
    });
  }
});

// ==========================
// UPDATE TASK (Invalidates all_tasks & task_:id)
// ==========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const { title, description, completed } = req.body;
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty" });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Cache Invalidation: Invalidate all_tasks list and this specific task
    cache.del("all_tasks");
    cache.del(`task_${id}`);

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update task",
      error: error.message
    });
  }
});

// ==========================
// DELETE TASK (Invalidates all_tasks & task_:id)
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Cache Invalidation: Invalidate all_tasks list and this specific task
    cache.del("all_tasks");
    cache.del(`task_${id}`);

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete task",
      error: error.message
    });
  }
});

module.exports = router;
