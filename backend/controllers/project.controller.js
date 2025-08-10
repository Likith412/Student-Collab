const validator = require("validator");
const mongoose = require("mongoose");

const { DOMAINS_LIST, SKILLS_LIST } = require("../constants");

const Project = require("../models/project.model");
const User = require("../models/user.model");
const Application = require("../models/application.model");

async function handleCreateProject(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = [
      "title",
      "description",
      "domain",
      "difficulty",
      "requiredSkills",
      "teamSize",
      "groupLink",
      "deadline",
    ];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const {
      title,
      description,
      domain,
      difficulty,
      requiredSkills,
      teamSize,
      groupLink,
      deadline,
    } = req.body;

    const { userId } = req.user;

    // Validate required fields
    if (
      !title ||
      !description ||
      !domain ||
      !difficulty ||
      !requiredSkills ||
      !teamSize ||
      !deadline
    ) {
      return res.status(400).json({
        message:
          "All fields are required: title, description, domain, difficulty, requiredSkills, teamSize, and deadline",
      });
    }

    // Validate title
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Title must be a non-empty string" });
    }

    // Validate description
    if (typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ message: "Description must be a non-empty string" });
    }

    // Validate domain
    if (!DOMAINS_LIST.some(d => d.toLowerCase() === domain.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid domain. Must be one of: ${DOMAINS_LIST.join(", ")}`,
      });
    }

    // Validate difficulty
    const validDifficulties = ["beginner", "intermediate", "advanced"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: `Invalid difficulty. Must be one of: ${validDifficulties.join(", ")}`,
      });
    }

    // Validate requiredSkills array
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        message: "Required skills must be provided as a non-empty array",
      });
    }

    // Validate that all skills are from the allowed list (case insensitive)
    const skillsListLower = SKILLS_LIST.map(skill => skill.toLowerCase());
    const invalidSkills = requiredSkills.filter(
      skill => !skillsListLower.includes(skill.toLowerCase())
    );
    if (invalidSkills.length > 0) {
      return res.status(400).json({
        message: `Invalid skills: ${invalidSkills.join(
          ", "
        )}. Please use skills from the allowed list.`,
      });
    }

    // Validate teamSize
    if (typeof teamSize !== "number" || teamSize < 2 || teamSize > 8) {
      return res.status(400).json({
        message: "Team size must be a number between 2 and 8",
      });
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date format" });
    }

    const currentDate = new Date();
    if (deadlineDate <= currentDate) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    // Validate groupLink if provided
    if (groupLink && !validator.isURL(groupLink.trim())) {
      return res.status(400).json({ message: "Invalid group link URL" });
    }

    // Check if project already exists
    const existingProject = await Project.findOne({ title, createdBy: userId });
    if (existingProject) {
      return res.status(400).json({ message: "Project with this title already exists" });
    }

    // Normalize domain to proper case from DOMAINS_LIST
    const normalizedDomain = DOMAINS_LIST.find(
      d => d.toLowerCase() === domain.toLowerCase()
    );

    // Normalize skills to proper case from SKILLS_LIST
    const normalizedSkills = requiredSkills.map(skill => {
      const originalSkill = SKILLS_LIST.find(
        s => s.toLowerCase() === skill.toLowerCase()
      );
      return originalSkill || skill; // Fallback to original if not found (shouldn't happen after validation)
    });

    // Create new project
    const newProject = await Project.create({
      title: title.trim(),
      description: description.trim(),
      domain: normalizedDomain,
      difficulty,
      requiredSkills: normalizedSkills,
      teamSize,
      groupLink: groupLink ? groupLink.trim() : undefined,
      status: "open",
      deadline: deadlineDate,
      createdBy: userId,
      teamMembers: [userId], // Creator is automatically a team member
    });

    // Populate creator details
    const populatedProject = await Project.findById(newProject._id)
      .populate("createdBy", "username email")
      .populate("teamMembers", "username email")
      .lean();

    // Prepare response
    const projectResponse = {
      _id: populatedProject._id,
      title: populatedProject.title,
      description: populatedProject.description,
      domain: populatedProject.domain,
      difficulty: populatedProject.difficulty,
      requiredSkills: populatedProject.requiredSkills,
      teamSize: populatedProject.teamSize,
      teamMembers: populatedProject.teamMembers,
      status: populatedProject.status,
      deadline: populatedProject.deadline,
      createdBy: populatedProject.createdBy,
      createdAt: populatedProject.createdAt,
      updatedAt: populatedProject.updatedAt,
    };

    if (populatedProject.groupLink) {
      projectResponse.groupLink = populatedProject.groupLink;
    }

    return res.status(201).json({
      message: "Project created successfully",
      project: projectResponse,
    });
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({
      message: "Internal server error during project creation",
    });
  }
}

async function handleUpdateProject(req, res) {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const { userId } = req.user;

    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = [
      "title",
      "description",
      "domain",
      "difficulty",
      "requiredSkills",
      "teamSize",
      "groupLink",
      "deadline",
    ];
    const providedFields = Object.keys(req.body);
    const extraFields = providedFields.filter(field => !allowedFields.includes(field));

    if (extraFields.length > 0) {
      return res.status(400).json({
        message: `Extra fields not allowed: ${extraFields.join(
          ", "
        )}. Only ${allowedFields.join(", ")} are allowed.`,
      });
    }

    const {
      title,
      description,
      domain,
      difficulty,
      requiredSkills,
      teamSize,
      groupLink,
      deadline,
    } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check authorization
    if (project.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this project" });
    }

    // Validate required fields
    if (
      !title ||
      !description ||
      !domain ||
      !difficulty ||
      !requiredSkills ||
      !teamSize ||
      !deadline
    ) {
      return res.status(400).json({
        message:
          "All fields are required: title, description, domain, difficulty, requiredSkills, teamSize, and deadline",
      });
    }

    // Validate title
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Title must be a non-empty string" });
    }

    // Validate description
    if (typeof description !== "string" || description.trim().length === 0) {
      return res.status(400).json({ message: "Description must be a non-empty string" });
    }

    // Validate domain
    if (!DOMAINS_LIST.some(d => d.toLowerCase() === domain.toLowerCase())) {
      return res.status(400).json({
        message: `Invalid domain. Must be one of: ${DOMAINS_LIST.join(", ")}`,
      });
    }

    // Validate difficulty
    const validDifficulties = ["beginner", "intermediate", "advanced"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: `Invalid difficulty. Must be one of: ${validDifficulties.join(", ")}`,
      });
    }

    // Validate requiredSkills array
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        message: "Required skills must be provided as a non-empty array",
      });
    }

    // Validate that all skills are from the allowed list (case insensitive)
    const skillsListLower = SKILLS_LIST.map(skill => skill.toLowerCase());
    const invalidSkills = requiredSkills.filter(
      skill => !skillsListLower.includes(skill.toLowerCase())
    );
    if (invalidSkills.length > 0) {
      return res.status(400).json({
        message: `Invalid skills: ${invalidSkills.join(
          ", "
        )}. Please use skills from the allowed list.`,
      });
    }

    // Validate teamSize
    if (typeof teamSize !== "number" || teamSize < 2 || teamSize > 8) {
      return res.status(400).json({
        message: "Team size must be a number between 2 and 8",
      });
    }

    // Validate deadline
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid deadline date format" });
    }

    const currentDate = new Date();
    if (deadlineDate <= currentDate) {
      return res.status(400).json({ message: "Deadline must be in the future" });
    }

    // Validate groupLink if provided
    if (groupLink && !validator.isURL(groupLink.trim())) {
      return res.status(400).json({ message: "Invalid group link URL" });
    }

    // Check if project already exists
    const existingProject = await Project.findOne({ title, createdBy: userId });
    if (existingProject) {
      return res.status(400).json({ message: "Project with this title already exists" });
    }

    // Normalize domain to proper case from DOMAINS_LIST
    const normalizedDomain = DOMAINS_LIST.find(
      d => d.toLowerCase() === domain.toLowerCase()
    );

    // Normalize skills to proper case from SKILLS_LIST
    const normalizedSkills = requiredSkills.map(skill => {
      const originalSkill = SKILLS_LIST.find(
        s => s.toLowerCase() === skill.toLowerCase()
      );
      return originalSkill || skill; // Fallback to original if not found (shouldn't happen after validation)
    });

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: title.trim(),
        description: description.trim(),
        domain: normalizedDomain,
        difficulty,
        requiredSkills: normalizedSkills,
        teamSize,
        groupLink: groupLink ? groupLink.trim() : undefined,
        deadline: deadlineDate,
      },
      { new: true }
    )
      .populate("createdBy", "username email")
      .populate("teamMembers", "username email")
      .lean();

    // Prepare response
    const projectResponse = {
      _id: updatedProject._id,
      title: updatedProject.title,
      description: updatedProject.description,
      domain: updatedProject.domain,
      difficulty: updatedProject.difficulty,
      requiredSkills: updatedProject.requiredSkills,
      teamSize: updatedProject.teamSize,
      teamMembers: updatedProject.teamMembers,
      status: updatedProject.status,
      deadline: updatedProject.deadline,
      createdBy: updatedProject.createdBy,
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt,
    };

    if (updatedProject.groupLink) {
      projectResponse.groupLink = updatedProject.groupLink;
    }

    return res.status(200).json({
      message: "Project updated successfully",
      project: projectResponse,
    });
  } catch (error) {
    console.error("Project update error:", error);
    return res.status(500).json({
      message: "Internal server error during project update",
    });
  }
}

async function handleUpdateProjectStatus(req, res) {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { userId } = req.user;

    // Check authorization
    if (project.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update the status of this project" });
    }

    // Validate request body
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { status } = req.body;

    // Validate status
    if (!["open", "in_progress", "closed", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: open, in_progress, closed, cancelled",
      });
    }

    // Update project status
    await Project.findByIdAndUpdate(projectId, { status });

    return res.status(200).json({ message: "Project status updated successfully" });
  } catch (error) {
    console.error("Project status update error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during project status update" });
  }
}

async function handleDeleteProject(req, res) {
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

    // Check authorization
    if (project.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this project" });
    }

    // Delete project
    await Project.findByIdAndDelete(projectId);

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Project deletion error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during project deletion" });
  }
}

async function handleGetAllProjects(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      domain,
      skills,
      difficulties,
      teamSizeRanges,
      status,
      sortBy = "most_recent",
    } = req.query;

    // Build filter object
    const filter = {};

    // Search by title (case-insensitive)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // Filter by single domain
    if (domain) {
      if (!DOMAINS_LIST.some(d => d.toLowerCase() === domain.toLowerCase())) {
        return res.status(400).json({
          message: `Invalid domain. Must be one of: ${DOMAINS_LIST.join(", ")}`,
        });
      }
      filter.domain = domain;
    }

    // Filter by multiple skills
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];

      // Validate skills
      const skillsListLower = SKILLS_LIST.map(skill => skill.toLowerCase());
      const invalidSkills = skillsArray.filter(
        skill => !skillsListLower.includes(skill.toLowerCase())
      );

      if (invalidSkills.length > 0) {
        return res.status(400).json({
          message: `Invalid skills: ${invalidSkills.join(
            ", "
          )}. Please use skills from the allowed list.`,
        });
      }

      // Projects must have ALL the specified skills
      filter.requiredSkills = { $all: skillsArray };
    }

    // Filter by multiple difficulties
    if (difficulties) {
      const difficultiesArray = Array.isArray(difficulties)
        ? difficulties
        : [difficulties];
      const validDifficulties = ["beginner", "intermediate", "advanced"];

      const invalidDifficulties = difficultiesArray.filter(
        diff => !validDifficulties.includes(diff)
      );

      if (invalidDifficulties.length > 0) {
        return res.status(400).json({
          message: `Invalid difficulties: ${invalidDifficulties.join(
            ", "
          )}. Must be one of: ${validDifficulties.join(", ")}`,
        });
      }

      filter.difficulty = { $in: difficultiesArray };
    }

    // Filter by team size ranges
    if (teamSizeRanges) {
      const rangesArray = Array.isArray(teamSizeRanges)
        ? teamSizeRanges
        : [teamSizeRanges];
      const validRanges = ["2-3", "4-5", "6+"];

      const invalidRanges = rangesArray.filter(range => !validRanges.includes(range));
      if (invalidRanges.length > 0) {
        return res.status(400).json({
          message: `Invalid team size ranges: ${invalidRanges.join(
            ", "
          )}. Must be one of: ${validRanges.join(", ")}`,
        });
      }

      const teamSizeConditions = rangesArray.map(range => {
        switch (range) {
          case "2-3":
            return { $and: [{ teamSize: { $gte: 2 } }, { teamSize: { $lte: 3 } }] };
          case "4-5":
            return { $and: [{ teamSize: { $gte: 4 } }, { teamSize: { $lte: 5 } }] };
          case "6+":
            return { teamSize: { $gte: 6 } };
          default:
            return {};
        }
      });

      filter.$or = teamSizeConditions;
    }

    // Filter by status
    if (status) {
      const validStatuses = ["open", "in_progress", "closed", "cancelled"];
      if (validStatuses.includes(status)) {
        filter.status = status;
      }
    }

    // Build sort object
    let sort = {};
    let additionalFilter = {};

    switch (sortBy) {
      case "most_recent":
        sort = { createdAt: -1 };
        break;
      case "deadline_soon":
        sort = { deadline: 1 };
        break;
      case "most_popular":
        // Sort by number of team members (descending)
        sort = { $expr: { $size: "$teamMembers" } };
        break;
      case "best_match":
        // For best match, prioritize projects matching user's skills
        const { userId } = req.user;
        const { skills: userSkills } = await User.findById(userId).lean();

        if (userSkills && userSkills.length > 0) {
          // Projects with more matching skills get higher priority
          sort = {
            $expr: {
              $size: {
                $setIntersection: ["$requiredSkills", userSkills],
              },
            },
            deadline: 1,
            createdAt: -1,
          };
        } else {
          sort = { deadline: 1, createdAt: -1 };
        }
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Validate pagination parameters
    if (pageNum < 1 || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        message:
          "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50",
      });
    }

    // Execute query with pagination
    const projects = await Project.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate("createdBy", "username email")
      .populate("teamMembers", "username email")
      .lean();

    // Get total count for pagination info
    const totalProjects = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalProjects / limitNum);

    // Prepare response
    const projectsResponse = projects.map(project => ({
      _id: project._id,
      title: project.title,
      description: project.description,
      domain: project.domain,
      difficulty: project.difficulty,
      requiredSkills: project.requiredSkills,
      teamSize: project.teamSize,
      teamMembers: project.teamMembers,
      status: project.status,
      deadline: project.deadline,
      createdBy: project.createdBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return res.status(200).json({
      message: "Projects retrieved successfully",
      projects: projectsResponse,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProjects,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      filters: {
        search: search || null,
        domain: domain || null,
        skills: skills || null,
        difficulties: difficulties || null,
        teamSizeRanges: teamSizeRanges || null,
        status: status || null,
        sortBy,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetProject(req, res) {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId)
      .populate("createdBy", "username email")
      .populate("teamMembers", "username email")
      .lean();

    // Check if project exists
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const applications = await Application.find({ project: projectId })
      .populate("userId", "username email")
      .lean();

    return res.status(200).json({ project, applications });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleCreateProject,
  handleUpdateProject,
  handleDeleteProject,
  handleUpdateProjectStatus,
  handleGetAllProjects,
  handleGetProject,
};
