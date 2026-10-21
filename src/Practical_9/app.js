require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const logger = require("./middleware/logger");
const taskRoutes = require("./routes/taskRoutes");
const stats = require("./cache/cacheStats");

const app = express();

// ==========================
// Middleware
// ==========================
app.use(express.json());
app.use(logger);

// ==========================
// MongoDB Connection
// ==========================
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskdb";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected for Practical 09");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// ==========================
// Routes
// ==========================
app.use("/tasks", taskRoutes);

// Cache stats route
app.get("/debug/cache-stats", (req, res) => {
  res.status(200).json({
    hits: stats.hits,
    misses: stats.misses,
    total: stats.hits + stats.misses
  });
});

// Welcome / info route
app.get("/", (req, res) => {
  res.json({
    practical: "Practical 09: Caching using Node-Cache",
    status: "online",
    endpoints: {
      get_all_tasks: "GET /tasks (Cached, sends X-Cache: HIT or MISS)",
      get_task_by_id: "GET /tasks/:id (Cached, sends X-Cache: HIT or MISS)",
      create_task: "POST /tasks (Invalidates all_tasks cache)",
      update_task: "PUT /tasks/:id (Invalidates all_tasks and task_:id cache)",
      delete_task: "DELETE /tasks/:id (Invalidates all_tasks and task_:id cache)",
      cache_stats: "GET /debug/cache-stats"
    }
  });
});

// ==========================
// Server
// ==========================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Practical 09 Server running at http://localhost:${PORT}`);
});

module.exports = app;
