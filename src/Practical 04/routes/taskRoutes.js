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


router.post('/:id', (req,res) => {
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

module.exports = router;