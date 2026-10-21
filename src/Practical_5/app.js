const express = require("express");
const app = express();
const logger = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const taskRoutes = require("./routes/taskRoutes")
const mongoose = require("mongoose");
app.use(express.json());
app.use(logger);
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/taskdb").then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB");
});


app.use("/tasks",taskRoutes);
app.use(errorHandler);


// Middleware
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

