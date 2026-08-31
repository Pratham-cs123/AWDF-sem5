const express = require("express");
const app = express();
const logger = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const taskRoutes = require("./routes/taskRoutes")


app.use(express.json());
app.use(logger);
app.use("/tasks",taskRoutes);
app.use(errorHandler);


// Middleware
app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

