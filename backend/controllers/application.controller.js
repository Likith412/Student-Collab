const mongoose = require("mongoose");

const Application = require("../models/application.model");
const Project = require("../models/project.model");

async function handleCreateApplication(req, res) {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { userId } = req.user;

    // Check if user is the project creator
    if (project.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Cannot apply to your own project",
      });
    }

    // Check if user is already a team member
    if (project.teamMembers.includes(userId)) {
      return res.status(400).json({
        message: "You are already a team member of this project",
      });
    }

    // Check if user has already applied to this project
    const existingApplication = await Application.findOne({
      userId,
      projectId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this project",
      });
    }

    // Check if project is open for applications
    if (project.status !== "open") {
      return res.status(400).json({
        message: "Cannot apply to this project. Project is not open for applications.",
      });
    }

    // Check if project team is full
    if (project.teamMembers.length >= project.teamSize) {
      return res.status(400).json({
        message: "Project team is already full",
      });
    }

    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = ["message"];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const { message } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Validate message
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ message: "Message must be a non-empty string" });
    }

    // Create new application
    const newApplication = await Application.create({
      userId,
      projectId,
      message: message.trim(),
      status: "pending",
    });

    // Populate user and project details
    const populatedApplication = await Application.findById(newApplication._id)
      .populate("userId", "username email")
      .populate("projectId", "title domain difficulty")
      .lean();

    return res.status(201).json({
      message: "Application submitted successfully",
      application: {
        _id: populatedApplication._id,
        userId: populatedApplication.userId,
        projectId: populatedApplication.projectId,
        status: populatedApplication.status,
        message: populatedApplication.message,
        createdAt: populatedApplication.createdAt,
        updatedAt: populatedApplication.updatedAt,
      },
    });
  } catch (error) {
    console.error("Application creation error:", error);
    return res.status(500).json({
      message: "Internal server error during application creation",
    });
  }
}

async function handleUpdateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const { userId, role } = req.user;

    // Check if application exists
    const application = await Application.findById(applicationId)
      .populate("projectId")
      .lean();

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check Authorization
    if (application.projectId.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this application status",
      });
    }

    // Check if application can be updated
    if (application.status !== "pending") {
      return res.status(400).json({
        message:
          "Cannot update application status. Application is not in pending status.",
      });
    }

    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = ["status"];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const { status } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    // Validate status
    const validStatuses =
      role === "student" ? ["pending", "accepted", "rejected"] : ["cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // If accepting application, check if project team is full
    if (status === "accepted") {
      const project = await Project.findById(application.projectId._id);
      if (project.teamMembers.length >= project.teamSize) {
        return res.status(400).json({
          message: "Cannot accept application. Project team is already full.",
        });
      }

      // Add user to project team
      await Project.findByIdAndUpdate(application.projectId._id, {
        $addToSet: { teamMembers: application.userId },
      });
    }

    // Update application status
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    )
      .populate("userId", "username email")
      .populate("projectId", "title domain difficulty")
      .lean();

    return res.status(200).json({
      message: "Application status updated successfully",
      application: {
        _id: updatedApplication._id,
        userId: updatedApplication.userId,
        projectId: updatedApplication.projectId,
        status: updatedApplication.status,
        message: updatedApplication.message,
        createdAt: updatedApplication.createdAt,
        updatedAt: updatedApplication.updatedAt,
      },
    });
  } catch (error) {
    console.error("Application status update error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during application status update" });
  }
}

async function handleGetAllApplications(req, res) {
  try {
    const applications = await Application.find()
      .populate("userId", "username email")
      .populate("projectId", "title domain createdBy.username createdBy.email")
      .lean();

    return res.status(200).json({
      message: "All applications fetched successfully",
      applications,
    });
  } catch (error) {
    console.error("Error fetching all applications:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleCreateApplication,
  handleUpdateApplicationStatus,
  handleGetAllApplications,
};
