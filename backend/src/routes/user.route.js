const express = require("express");

const {
   handleRegister,
   handleLogin,
   handleGetMyProfile,
   handleGetStudentProfile,
   handleUpdateMyProfile,
   handleChangePassword,
   handleGetAllUsers,
   handleUpdateUserBlockStatus,
} = require("../controllers/user.controller");

const {
   authenticateUser,
   authorizeUserRoles,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Get all users
router.get("/", authenticateUser, authorizeUserRoles("admin"), handleGetAllUsers);

// Register and login
router.post("/register", handleRegister);
router.post("/login", handleLogin);

router
   .route("/my-profile")
   // Get my profile
   .get(authenticateUser, authorizeUserRoles("student"), handleGetMyProfile)
   // Update my profile
   .put(authenticateUser, authorizeUserRoles("student"), handleUpdateMyProfile);

// Change my password
router.patch("/my-password", authenticateUser, handleChangePassword);

// Update user block status
router.patch(
   "/:userId/block",
   authenticateUser,
   authorizeUserRoles("admin"),
   handleUpdateUserBlockStatus
);

// Get student profile
router.get("/:userId", authenticateUser, handleGetStudentProfile);

module.exports = router;
