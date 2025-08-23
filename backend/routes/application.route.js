const express = require("express");
const router = express.Router();

const {
  handleUpdateApplicationStatus,
  handleGetAllApplications,
} = require("../controllers/application.controller");

const {
  authenticateUser,
  authorizeUserRoles,
} = require("../middlewares/auth.middleware");

// Get All Applications
router.get("/", authenticateUser, authorizeUserRoles("admin"), handleGetAllApplications);

// Update Application Status
router.patch(
  "/:applicationId/status",
  authenticateUser,
  authorizeUserRoles("student"),
  handleUpdateApplicationStatus
);

module.exports = router;
