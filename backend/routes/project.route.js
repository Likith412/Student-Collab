const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  authorizeUserRoles,
} = require("../middlewares/auth.middleware");

const {
  handleCreateProject,
  handleUpdateProject,
  handleUpdateProjectStatus,
  handleDeleteProject,
  handleGetProject,
  handleGetAllProjects,
} = require("../controllers/project.controller");

const { handleCreateApplication } = require("../controllers/application.controller");

const { handleCreateReview } = require("../controllers/review.controller");

// === Project Routes ===

router
  .route("/")
  // Create project
  .post(authenticateUser, authorizeUserRoles("student"), handleCreateProject)
  // Get all projects
  .get(handleGetAllProjects);

router
  .route("/:projectId")
  // Get project
  .get(handleGetProject)
  // Update project
  .put(authenticateUser, authorizeUserRoles("student"), handleUpdateProject)
  // Delete project
  .delete(authenticateUser, authorizeUserRoles("student"), handleDeleteProject);

// Update project status
router.patch(
  "/:projectId/status",
  authenticateUser,
  authorizeUserRoles("student"),
  handleUpdateProjectStatus
);

// === Application Routes ===

// Create Application
router.post(
  "/:projectId/applications",
  authenticateUser,
  authorizeUserRoles("student"),
  handleCreateApplication
);

// == Review Routes ==

// Create Review
router.post(
  "/:projectId/reviews",
  authenticateUser,
  authorizeUserRoles("student"),
  handleCreateReview
);

module.exports = router;
