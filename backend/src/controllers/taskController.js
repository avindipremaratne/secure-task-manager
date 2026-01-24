const Task = require("../models/Task");

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    userId: req.user.id,
  });
  res.status(201).json(task);
};
// Update a task
exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { ...req.body, updatedAt: new Date() },
    { new: true },
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
};
// Delete a task
exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json({ message: "Task deleted successfully" });
};
