const mongoose = require("mongoose");
const { DOMAINS_LIST, SKILLS_LIST } = require("../constants");

const projectSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String, required: true },
      domain: {
         type: String,
         enum: DOMAINS_LIST,
         required: true,
      },
      difficulty: {
         type: String,
         enum: ["beginner", "intermediate", "advanced"],
         required: true,
      },
      requiredSkills: { type: [String], enum: SKILLS_LIST, required: true },
      teamSize: { type: Number, min: 2, max: 8, required: true },
      teamMembers: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
      groupLink: String, // whatsapp group link
      status: {
         type: String,
         enum: ["open", "in_progress", "closed", "cancelled"],
         default: "open",
      },
      deadline: { type: Date, required: true },
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   { timestamps: true, strict: true }
);

// Weighted text index backing the `search` query param on GET /api/projects.
// Title matches outrank description matches when results are sorted by relevance.
projectSchema.index(
   { title: "text", description: "text" },
   { weights: { title: 5, description: 1 }, name: "project_text_search" }
);

// Supporting indexes for the common filter + sort combinations on the list route.
projectSchema.index({ status: 1, deadline: 1 });
projectSchema.index({ domain: 1, status: 1 });
projectSchema.index({ requiredSkills: 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
