const express = require('express');
const router = express.Router();
let tasks = [
    {
        id: 1,
        title: "Learning express",
        completed: false
    }
];

router.get('/', (req,res) => {
    res.status(200).json(tasks)
})

router.post('/', (req,res) => {
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
})


router.put('/:id', (req,res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if(!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.title = req.body.title || task.title;
    task.completed = req.body.completed;
    res.status(200).json({
        message: "Task updated successfully",
        task: task
    });
})

router.delete('/:id', (req,res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if(taskIndex === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json({
        message: "Task deleted successfully"
    });
});

const Task = require("../model/task");
router.get("/", async (req, res, next) => {

    try {

        const tasks = await Task.find();

        res.status(200).json(tasks);

    } catch (error) {

        next(error);

    }

});

router.post("/", async (req, res, next) => {

    try {

        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            completed: req.body.completed
        });

        const savedTask = await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task: savedTask
        });

    } catch (error) {

        next(error);

    }

});

router.put("/:id", async (req, res, next) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task: task
        });

    } catch (error) {

        next(error);

    }

});

router.delete("/:id", async (req, res, next) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        next(error);

    }

});

// PUT - Update task
router.put("/:id", async (req, res, next) => {

    try {

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task: task
        });

    } catch (error) {

        next(error);

    }

});

// DELETE - Delete task
router.delete("/:id", async (req, res, next) => {

    try {

        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        next(error);

    }

});

module.exports = router;

