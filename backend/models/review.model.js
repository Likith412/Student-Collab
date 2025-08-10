const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true, strict: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
