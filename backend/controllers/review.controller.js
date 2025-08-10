const mongoose = require("mongoose");

const Review = require("../models/review.model");
const Project = require("../models/project.model");

async function handleCreateReview(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = ["userId", "rating", "comment"];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const { projectId } = req.params;
    const { userId: reviewedUserId, rating, comment } = req.body;
    const { userId: reviewerId } = req.user;

    // Validate required fields
    if (!projectId || !reviewedUserId || rating === undefined || !comment) {
      return res.status(400).json({
        message: "All fields are required: projectId, userId, rating, and comment",
      });
    }

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Validate reviewed user ID
    if (!mongoose.Types.ObjectId.isValid(reviewedUserId)) {
      return res.status(400).json({ message: "Invalid reviewed user ID" });
    }

    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be a number between 0 and 5",
      });
    }

    // Validate comment
    if (typeof comment !== "string" || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment must be a non-empty string" });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if reviewer is the project creator
    if (project.createdBy.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        message: "Only the project creator can create reviews",
      });
    }

    // Check if project is closed
    if (project.status !== "closed") {
      return res.status(400).json({
        message: "Reviews can only be created for closed projects",
      });
    }

    // Check if reviewed user is a team member
    if (!project.teamMembers.includes(reviewedUserId)) {
      return res.status(400).json({
        message: "Can only review team members of the project",
      });
    }

    // Check if reviewer is trying to review themselves
    if (reviewedUserId === reviewerId) {
      return res.status(400).json({
        message: "Cannot review yourself",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      userId: reviewedUserId,
      projectId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "Review for this user and project already exists",
      });
    }

    // Create new review
    const newReview = await Review.create({
      userId: reviewedUserId,
      projectId,
      rating,
      comment: comment.trim(),
    });

    // Populate user and project details
    const populatedReview = await Review.findById(newReview._id)
      .populate("userId", "username email")
      .populate("projectId", "title domain")
      .lean();

    return res.status(201).json({
      message: "Review created successfully",
      review: {
        _id: populatedReview._id,
        userId: populatedReview.userId,
        projectId: populatedReview.projectId,
        rating: populatedReview.rating,
        comment: populatedReview.comment,
        createdAt: populatedReview.createdAt,
        updatedAt: populatedReview.updatedAt,
      },
    });
  } catch (error) {
    console.error("Review creation error:", error);
    return res.status(500).json({
      message: "Internal server error during review creation",
    });
  }
}

async function handleUpdateReview(req, res) {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const { userId: reviewerId } = req.user;

    // Check if review exists
    const review = await Review.findById(reviewId).populate("projectId").lean();

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check authorization (only project creator can update reviews)
    if (review.projectId.createdBy.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this review",
      });
    }

    // Check if project is still closed
    if (review.projectId.status !== "closed") {
      return res.status(400).json({
        message: "Cannot update review. Project is not closed.",
      });
    }

    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = ["rating", "comment"];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const { rating, comment } = req.body;

    // Validate required fields
    if (rating === undefined || !comment) {
      return res.status(400).json({
        message: "All fields are required: rating and comment",
      });
    }

    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be a number between 0 and 5",
      });
    }

    // Validate comment
    if (typeof comment !== "string" || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment must be a non-empty string" });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment: comment.trim(),
      },
      { new: true }
    )
      .populate("userId", "username email")
      .populate("projectId", "title domain")
      .lean();

    return res.status(200).json({
      message: "Review updated successfully",
      review: {
        _id: updatedReview._id,
        userId: updatedReview.userId,
        projectId: updatedReview.projectId,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        createdAt: updatedReview.createdAt,
        updatedAt: updatedReview.updatedAt,
      },
    });
  } catch (error) {
    console.error("Review update error:", error);
    return res.status(500).json({
      message: "Internal server error during review update",
    });
  }
}

async function handleDeleteReview(req, res) {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const { userId: reviewerId } = req.user;

    // Check if review exists
    const review = await Review.findById(reviewId).populate("projectId").lean();

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check authorization (only project creator can delete reviews)
    if (review.projectId.createdBy.toString() !== reviewerId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this review",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Review deletion error:", error);
    return res.status(500).json({
      message: "Internal server error during review deletion",
    });
  }
}

async function handleGetReview(req, res) {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const { userId, role } = req.user;

    const review = await Review.findById(reviewId)
      .populate("userId", "username email")
      .populate("projectId", "title domain status createdBy")
      .lean();

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Authorization: Users can only see reviews for projects they created or reviews about themselves
    const isProjectCreator = review.projectId.createdBy.toString() === userId.toString();
    const isReviewedUser = review.userId._id.toString() === userId.toString();
    const isAdmin = role === "admin";

    if (!isProjectCreator && !isReviewedUser && !isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view this review",
      });
    }

    return res.status(200).json({
      message: "Review retrieved successfully",
      review: {
        _id: review._id,
        userId: review.userId,
        projectId: review.projectId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetAllReviews(req, res) {
  try {
    const reviews = await Review.find()
      .populate("userId", "username email")
      .populate("projectId", "title domain createdBy.username createdBy.email")
      .lean();

    return res.status(200).json({
      message: "All reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleCreateReview,
  handleUpdateReview,
  handleDeleteReview,
  handleGetReview,
  handleGetAllReviews,
};
