const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one task
router.get('/:id', getTask, (req, res) => {
  res.json(res.task);
});

// Create task
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task
router.put('/:id', getTask, async (req, res) => {
  if (req.body.title != null) res.task.title = req.body.title;
  if (req.body.description != null) res.task.description = req.body.description;
  if (req.body.dueDate != null) res.task.dueDate = req.body.dueDate;

  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete task
// router.delete('/:id', getTask, async (req, res) => {
//   try {
//     await res.task.remove();
//     res.json({ message: 'Task deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Middleware to get task by ID
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) return res.status(404).json({ message: 'Task not found' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.task = task;
  next();
}

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
