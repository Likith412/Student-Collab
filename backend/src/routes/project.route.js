const express = require("express");
const router = express.Router();

const {
   authenticateUser,
   attachUserIfAuthenticated,
   authorizeUserRoles,
} = require("../middlewares/auth.middleware");

const {
   handleCreateProject,
   handleUpdateProject,
   handleUpdateProjectStatus,
   handleDeleteProject,
   handleGetProject,
   handleGetAllProjects,
   handleRemoveTeamMember,
} = require("../controllers/project.controller");

const {
   handleCreateApplication,
   handleGetProjectApplications,
} = require("../controllers/application.controller");

const { handleCreateReview } = require("../controllers/review.controller");

// === Project Routes ===

router
   .route("/")
   // Create project
   .post(authenticateUser, authorizeUserRoles("student"), handleCreateProject)
   // Get all projects (public; a token, when sent, enables sortBy=best_match)
   .get(attachUserIfAuthenticated, handleGetAllProjects);

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

// Remove team member
router.delete(
   "/:projectId/team/:memberId",
   authenticateUser,
   authorizeUserRoles("student"),
   handleRemoveTeamMember
);

// === Application Routes ===

router
   .route("/:projectId/applications")
   // Create Application
   .post(authenticateUser, authorizeUserRoles("student"), handleCreateApplication)
   // Get Project Applications
   .get(authenticateUser, authorizeUserRoles("student"), handleGetProjectApplications);

// == Review Routes ==

// Create Review
router.post(
   "/:projectId/reviews",
   authenticateUser,
   authorizeUserRoles("student"),
   handleCreateReview
);

module.exports = router;
