const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Register route
router.post("/register", register);
// Login route
router.post("/login", login);
// Logout route
router.post("/logout", authMiddleware, logout);

module.exports = router;
