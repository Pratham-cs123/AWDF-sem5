const express = require("../shared/node_modules/express");
const mongoose = require("../shared/node_modules/mongoose");
const cors = require("../shared/node_modules/cors");

const app = express();

const logger = require("../shared/middleware/logger");
const errorHandler = require("../shared/middleware/errorHandler");
const taskRoutes = require("../shared/routes/taskRoutes");
const Task = require("../shared/models/Task");

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(logger);

mongoose.connect("mongodb://127.0.0.1:27017/taskdb")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
    });

app.use((req, res, next) => {
    req.TaskModel = Task;
    next();
});

app.use("/tasks", taskRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
