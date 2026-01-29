const Task = require("../models/Task");

// Get all tasks for the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const { status, priority, sort, order } = req.query;

    // Build filter dynamically
    const filter = { userId: req.user.id };
    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    // Build sort dynamically
    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === "asc" ? -1 : 1;
    }
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: new Date() },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};
// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
