const express = require("express");

const {
  handleRegister,
  handleLogin,
  handleGetMyProfile,
  handleGetStudentProfile,
} = require("../controllers/user.controller");

const {
  authenticateUser,
  authorizeUserRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Register and login
router.post("/register", handleRegister);
router.post("/login", handleLogin);

// Get my profile
router.get(
  "/my-profile",
  authenticateUser,
  authorizeUserRoles("student"),
  handleGetMyProfile
);

// Get student profile
router.get("/:userId", authenticateUser, handleGetStudentProfile);

module.exports = router;
