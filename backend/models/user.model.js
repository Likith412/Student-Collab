const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    bio: {
      type: String,
      required: function () {
        return this.role === "student";
      }, // Only required for students
      default: undefined, // Allow undefined for non-students
    },
    skills: {
      type: [String],
      required: function () {
        return this.role === "student";
      }, // Only required for students
      default: undefined, // Allow undefined for non-students
    },
    githubLink: {
      type: String,
      default: undefined, // Allow undefined for non-students
    },
    linkedinLink: {
      type: String,
      default: undefined, // Allow undefined for non-students
    },
    emailLink: {
      type: String,
      default: undefined, // Allow undefined for non-students
    },
    isBlocked: {
      type: Boolean,
      required: function () {
        return this.role === "student";
      }, // Only required for students
      default: undefined, // Allow undefined for non-students
    },
  },
  { timestamps: true, strict: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
