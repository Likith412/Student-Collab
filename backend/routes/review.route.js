const express = require("express");
const router = express.Router();

const {
  handleUpdateReview,
  handleDeleteReview,
  handleGetReview,
  handleGetAllReviews,
} = require("../controllers/review.controller");

const {
  authenticateUser,
  authorizeUserRoles,
} = require("../middlewares/auth.middleware");

router.get("/", authenticateUser, authorizeUserRoles("admin"), handleGetAllReviews);
router
  .route("/:reviewId")
  .get(authenticateUser, authorizeUserRoles("student", "admin"), handleGetReview)
  .put(authenticateUser, authorizeUserRoles("student"), handleUpdateReview)
  .delete(authenticateUser, authorizeUserRoles("student"), handleDeleteReview);

module.exports = router;
