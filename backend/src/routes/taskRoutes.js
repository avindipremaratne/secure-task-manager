const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

// Route to get all tasks
router.get("/", getTasks);
// Route to create a new task
router.post("/", createTask);
// Route to update an existing task
router.put("/:id", updateTask);
// Route to delete a task
router.delete("/:id", deleteTask);

module.exports = router;
