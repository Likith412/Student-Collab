const validator = require("validator");
const mongoose = require("mongoose");

const { DOMAINS_LIST, SKILLS_LIST } = require("../constants");

const Project = require("../models/project.model");
const User = require("../models/user.model");
const Application = require("../models/application.model");

const { queueNotification } = require("../services/email.service");

const PROJECT_SORT_OPTIONS = [
   "most_recent",
   "deadline_soon",
   "most_popular",
   "best_match",
   "relevance",
];

const SEARCH_MODES = ["text", "partial"];

// Neutralises regex metacharacters so a search for "C++" is not a broken pattern.
function escapeRegex(value) {
   return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
         return res
            .status(400)
            .json({ message: "Description must be a non-empty string" });
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
         return res
            .status(400)
            .json({ message: "Project with this title already exists" });
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
         return res
            .status(400)
            .json({ message: "Description must be a non-empty string" });
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
         return res
            .status(400)
            .json({ message: "Project with this title already exists" });
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
         return res.status(403).json({
            message: "You are not authorized to update the status of this project",
         });
      }

      // Validate request body
      if (!req.body) {
         return res.status(400).json({ message: "Request body is required" });
      }

      const { status } = req.body;

      // Validate status
      if (!["open", "in_progress", "closed", "cancelled"].includes(status)) {
         return res.status(400).json({
            message:
               "Invalid status. Must be one of: open, in_progress, closed, cancelled",
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
         searchMode = "text",
         domain,
         skills,
         difficulties,
         teamSizeRanges,
         status,
         deadlineFrom,
         deadlineTo,
         hideExpired,
         sortBy,
      } = req.query;

      // Every filter is pushed here and combined under a single $and, so no two
      // filters can overwrite each other the way two top-level $or keys would.
      const conditions = [];

      // Text search over title and description
      let textSearch = null;

      if (search !== undefined) {
         if (typeof search !== "string" || search.trim().length === 0) {
            return res
               .status(400)
               .json({ message: "Search must be a non-empty string" });
         }

         if (!SEARCH_MODES.includes(searchMode)) {
            return res.status(400).json({
               message: `Invalid searchMode. Must be one of: ${SEARCH_MODES.join(", ")}`,
            });
         }

         const term = search.trim();

         if (searchMode === "text") {
            // Indexed, relevance-ranked, whole-word search across title and description.
            textSearch = term;
         } else {
            // Substring search, for type-ahead where a partial word must still match.
            const pattern = new RegExp(escapeRegex(term), "i");
            conditions.push({ $or: [{ title: pattern }, { description: pattern }] });
         }
      }

      // Filter by single domain
      if (domain) {
         if (!DOMAINS_LIST.some(d => d.toLowerCase() === domain.toLowerCase())) {
            return res.status(400).json({
               message: `Invalid domain. Must be one of: ${DOMAINS_LIST.join(", ")}`,
            });
         }
         conditions.push({ domain });
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
         conditions.push({ requiredSkills: { $all: skillsArray } });
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

         conditions.push({ difficulty: { $in: difficultiesArray } });
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
                  return { teamSize: { $gte: 2, $lte: 3 } };
               case "4-5":
                  return { teamSize: { $gte: 4, $lte: 5 } };
               case "6+":
                  return { teamSize: { $gte: 6 } };
               default:
                  return {};
            }
         });

         conditions.push({ $or: teamSizeConditions });
      }

      // Filter by status
      if (status) {
         const validStatuses = ["open", "in_progress", "closed", "cancelled"];
         if (!validStatuses.includes(status)) {
            return res.status(400).json({
               message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
            });
         }
         conditions.push({ status });
      }

      // Filter by deadline window
      const deadlineRange = {};

      if (deadlineFrom) {
         const from = new Date(deadlineFrom);
         if (isNaN(from.getTime())) {
            return res
               .status(400)
               .json({ message: "Invalid deadlineFrom. Use an ISO date string" });
         }
         deadlineRange.$gte = from;
      }

      if (deadlineTo) {
         const to = new Date(deadlineTo);
         if (isNaN(to.getTime())) {
            return res
               .status(400)
               .json({ message: "Invalid deadlineTo. Use an ISO date string" });
         }
         deadlineRange.$lte = to;
      }

      if (deadlineRange.$gte && deadlineRange.$lte && deadlineRange.$gte > deadlineRange.$lte) {
         return res
            .status(400)
            .json({ message: "deadlineFrom must be earlier than deadlineTo" });
      }

      // Drop projects whose deadline has already passed.
      const expiredHidden = hideExpired === "true";

      if (expiredHidden) {
         const now = new Date();
         deadlineRange.$gte = deadlineRange.$gte && deadlineRange.$gte > now ? deadlineRange.$gte : now;
      }

      if (Object.keys(deadlineRange).length > 0) {
         conditions.push({ deadline: deadlineRange });
      }

      // Relevance is only meaningful alongside a text search, so it becomes the
      // default there and is rejected everywhere else.
      const effectiveSortBy = sortBy || (textSearch ? "relevance" : "most_recent");

      if (!PROJECT_SORT_OPTIONS.includes(effectiveSortBy)) {
         return res.status(400).json({
            message: `Invalid sortBy. Must be one of: ${PROJECT_SORT_OPTIONS.join(", ")}`,
         });
      }

      if (effectiveSortBy === "relevance" && !textSearch) {
         return res.status(400).json({
            message: "Sorting by relevance requires search with searchMode=text",
         });
      }

      // Calculate pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Validate pagination parameters
      if (
         isNaN(pageNum) ||
         isNaN(limitNum) ||
         pageNum < 1 ||
         limitNum < 1 ||
         limitNum > 50
      ) {
         return res.status(400).json({
            message:
               "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50",
         });
      }

      const skip = (pageNum - 1) * limitNum;

      // best_match ranks by overlap with the signed-in user's skills. The route is
      // public, so anonymous visitors fall back to the deadline ordering below.
      let userSkills = null;

      if (effectiveSortBy === "best_match" && req.user?.userId) {
         const viewer = await User.findById(req.user.userId, { skills: 1 }).lean();
         if (viewer?.skills?.length > 0) {
            userSkills = viewer.skills;
         }
      }

      // $text has to sit at the top level of the match, next to the $and clauses.
      const matchStage = {};

      if (textSearch) {
         matchStage.$text = { $search: textSearch };
      }
      if (conditions.length > 0) {
         matchStage.$and = conditions;
      }

      // Fields the sorts below need. Computing them here is what makes sorting by
      // team size and skill overlap possible at all — .sort() cannot evaluate $expr.
      const computedFields = {
         teamMemberCount: { $size: { $ifNull: ["$teamMembers", []] } },
      };

      if (textSearch) {
         computedFields.relevanceScore = { $meta: "textScore" };
      }

      if (userSkills) {
         computedFields.skillMatchCount = {
            $size: {
               $setIntersection: [{ $ifNull: ["$requiredSkills", []] }, userSkills],
            },
         };
      }

      // _id breaks ties so a project never repeats across pages.
      let sort;

      switch (effectiveSortBy) {
         case "deadline_soon":
            sort = { deadline: 1, _id: 1 };
            break;
         case "most_popular":
            sort = { teamMemberCount: -1, createdAt: -1, _id: 1 };
            break;
         case "best_match":
            sort = userSkills
               ? { skillMatchCount: -1, deadline: 1, createdAt: -1, _id: 1 }
               : { deadline: 1, createdAt: -1, _id: 1 };
            break;
         case "relevance":
            sort = { relevanceScore: -1, createdAt: -1, _id: 1 };
            break;
         default:
            sort = { createdAt: -1, _id: 1 };
      }

      const pipeline = [
         { $match: matchStage },
         { $addFields: computedFields },
         { $sort: sort },
         { $skip: skip },
         { $limit: limitNum },
      ];

      const [projects, totalProjects] = await Promise.all([
         Project.aggregate(pipeline),
         Project.countDocuments(matchStage),
      ]);

      // aggregate() skips populate, so the refs are resolved on the plain results.
      await Project.populate(projects, [
         { path: "createdBy", select: "username email" },
         { path: "teamMembers", select: "username email" },
      ]);

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
         ...(userSkills && { skillMatchCount: project.skillMatchCount }),
         ...(textSearch && { relevanceScore: project.relevanceScore }),
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
            searchMode: search ? searchMode : null,
            domain: domain || null,
            skills: skills || null,
            difficulties: difficulties || null,
            teamSizeRanges: teamSizeRanges || null,
            status: status || null,
            deadlineFrom: deadlineFrom || null,
            deadlineTo: deadlineTo || null,
            hideExpired: expiredHidden,
            sortBy: effectiveSortBy,
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

      // Applications are not returned here because this route is public.
      // The project owner reads them from GET /api/projects/:projectId/applications
      return res.status(200).json({ message: "Project retrieved successfully", project });
   } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ message: "Internal server error" });
   }
}

async function handleRemoveTeamMember(req, res) {
   try {
      const { projectId, memberId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(projectId)) {
         return res.status(400).json({ message: "Invalid project ID" });
      }

      if (!mongoose.Types.ObjectId.isValid(memberId)) {
         return res.status(400).json({ message: "Invalid member ID" });
      }

      // Check if project exists
      const project = await Project.findById(projectId);

      if (!project) {
         return res.status(404).json({ message: "Project not found" });
      }

      const { userId } = req.user;

      const isProjectOwner = project.createdBy.toString() === userId.toString();
      const isLeavingSelf = memberId === userId.toString();

      // Check authorization
      // The owner removes anyone, a team member only removes themselves
      if (!isProjectOwner && !isLeavingSelf) {
         return res.status(403).json({
            message: "You are not authorized to remove members from this project",
         });
      }

      // The creator is always part of their own team
      if (project.createdBy.toString() === memberId) {
         return res.status(400).json({
            message:
               "The project creator cannot be removed from the team. Delete the project instead.",
         });
      }

      // Check if the user is actually a team member
      const isTeamMember = project.teamMembers.some(
         member => member.toString() === memberId
      );

      if (!isTeamMember) {
         return res.status(400).json({
            message: "This user is not a team member of this project",
         });
      }

      // Remove member from the team
      await Project.findByIdAndUpdate(projectId, {
         $pull: { teamMembers: memberId },
      });

      // Cancel the accepted application so the spot can be applied for again
      await Application.findOneAndUpdate(
         { projectId, userId: memberId, status: "accepted" },
         { status: "cancelled" }
      );

      // Email the member that they were removed. Leaving is their own action,
      // so nothing is sent for it.
      if (!isLeavingSelf) {
         const removedMember = await User.findById(memberId, {
            username: 1,
            email: 1,
         }).lean();

         queueNotification("teamMemberRemoved", removedMember?.email, {
            memberName: removedMember?.username,
            projectTitle: project.title,
         });
      }

      return res.status(200).json({
         message: isLeavingSelf
            ? "You have left the project successfully"
            : "Team member removed successfully",
      });
   } catch (error) {
      console.error("Team member removal error:", error);
      return res.status(500).json({
         message: "Internal server error during team member removal",
      });
   }
}

module.exports = {
   handleCreateProject,
   handleUpdateProject,
   handleDeleteProject,
   handleUpdateProjectStatus,
   handleGetAllProjects,
   handleGetProject,
   handleRemoveTeamMember,
};
