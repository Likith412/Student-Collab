const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    profilePic: String,
    bio: {
      type: String,
      required: function () {
        return this.role === "student";
      }, // Only required for students
    },
    skills: {
      type: [String],
      required: function () {
        return this.role === "student";
      }, // Only required for students
    },
    isBlocked: {
      type: Boolean,
      required: function () {
        return this.role === "student";
      }, // Only required for students
    },
  },
  { timestamps: true, strict: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
