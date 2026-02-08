const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");

const router = express.Router();

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user._id });
  res.status(201).json(task);
});

// Update a task
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true },
  );
  res.json(task);
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Task deleted" });
});
module.exports = router;
