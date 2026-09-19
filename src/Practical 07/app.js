require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const logger = require("./middleware/logger");

const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");


// ==========================
// Middleware
// ==========================

app.use(express.json());

app.use(logger);


// ==========================
// MongoDB Connection
// ==========================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// ==========================
// Routes
// ==========================

app.use("/auth", authRoutes);

app.use("/tasks", taskRoutes);


// ==========================
// Server
// ==========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running at http://localhost:${PORT}`
    );
});