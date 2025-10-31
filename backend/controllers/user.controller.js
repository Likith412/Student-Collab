const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { SKILLS_LIST } = require("../constants");

const User = require("../models/user.model");
const Project = require("../models/project.model");
const Application = require("../models/application.model");
const Review = require("../models/review.model");

async function handleRegister(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const {
      username,
      email,
      password,
      bio,
      skills,
      githubLink,
      linkedinLink,
      emailLink,
    } = req.body;

    // Validate required fields for student registration
    if (!username || !email || !password || !bio || !skills) {
      return res.status(400).json({
        message: "All fields are required: username, email, password, bio, and skills",
      });
    }

    // Check for any extra fields other than the allowed ones
    const allowedFields = [
      "username",
      "email",
      "password",
      "bio",
      "skills",
      "githubLink",
      "linkedinLink",
      "emailLink",
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

    // Validate username
    if (typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({ message: "Username must be a non-empty string" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Validate bio
    if (typeof bio !== "string" || bio.trim().length === 0) {
      return res.status(400).json({ message: "Bio must be a non-empty string" });
    }

    // Validate skills array
    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        message: "Skills must be provided as a non-empty array",
      });
    }

    // Validate that all skills are from the allowed list (case insensitive)
    const skillsListLower = SKILLS_LIST.map(skill => skill.toLowerCase());
    const invalidSkills = skills.filter(
      skill => !skillsListLower.includes(skill.toLowerCase())
    );
    if (invalidSkills.length > 0) {
      return res.status(400).json({
        message: `Invalid skills: ${invalidSkills.join(
          ", "
        )}. Please use skills from the allowed list.`,
      });
    }

    // Validate githubLink
    if (githubLink && !validator.isURL(githubLink.trim())) {
      return res.status(400).json({ message: "Invalid GitHub link" });
    }

    // Validate linkedinLink
    if (linkedinLink && !validator.isURL(linkedinLink.trim())) {
      return res.status(400).json({ message: "Invalid LinkedIn link" });
    }

    // Validate emailLink
    if (emailLink && !emailLink.trim().startsWith("mailto:")) {
      return res.status(400).json({ message: "Email link must start with 'mailto:'" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.trim() }).lean();
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Normalize skills to proper case from SKILLS_LIST
    const normalizedSkills = skills.map(skill => {
      const originalSkill = SKILLS_LIST.find(
        s => s.toLowerCase() === skill.toLowerCase()
      );
      return originalSkill || skill; // Fallback to original if not found (shouldn't happen after validation)
    });

    // Create new student user
    const savedUser = await User.create({
      username: username.trim(),
      email,
      password: hashedPassword,
      role: "student", // Explicitly set role to student
      bio: bio.trim(),
      skills: normalizedSkills,
      githubLink: githubLink ? githubLink.trim() : undefined,
      linkedinLink: linkedinLink ? linkedinLink.trim() : undefined,
      emailLink: emailLink ? emailLink.trim() : undefined,
      isBlocked: false, // Default value for new students
    });

    // Remove password from response
    const userResponse = {
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      bio: savedUser.bio,
      skills: savedUser.skills,
      isBlocked: savedUser.isBlocked,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    if (savedUser.githubLink) {
      userResponse.githubLink = savedUser.githubLink;
    }
    if (savedUser.linkedinLink) {
      userResponse.linkedinLink = savedUser.linkedinLink;
    }
    if (savedUser.emailLink) {
      userResponse.emailLink = savedUser.emailLink;
    }

    return res.status(201).json({
      message: "Student registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error during registration",
    });
  }
}

async function handleLogin(req, res) {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User with this email does not exist" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const payload = { userId: user._id, role: user.role, username: user.username };
    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "6d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error during login",
    });
  }
}

async function handleGetMyProfile(req, res) {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).lean();
    const projectsHistory = await Project.find(
      {
        teamMembers: { $in: [userId] },
      },
      {
        _id: 1,
        title: 1,
        teamSize: 1,
        status: 1,
        createdAt: 1,
        deadline: 1,
        createdBy: 1,
      }
    ).lean();

    const applications = await Application.find({ userId })
      .populate("projectId", "_id title projectId.createdBy")
      .lean();

    // sort applications by accepted, pending, rejected
    applications.sort((a, b) => {
      if (a.status === "accepted") {
        return -1;
      }
      return 1;
    });
    applications.sort((a, b) => {
      if (a.status === "pending") {
        return -1;
      }
      return 1;
    });
    applications.sort((a, b) => {
      if (a.status === "rejected") {
        return -1;
      }
      return 1;
    });

    const reviews = await Review.find({ userId })
      .populate("projectId", "_id title projectId.createdBy")
      .lean();

    // sort reviews by createdAt descending
    reviews.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
      projectsHistory,
      applications,
      reviews,
      createdAt: user.createdAt,
    };

    if (user.githubLink) {
      userProfile.githubLink = user.githubLink;
    }
    if (user.linkedinLink) {
      userProfile.linkedinLink = user.linkedinLink;
    }
    if (user.emailLink) {
      userProfile.emailLink = user.emailLink;
    }

    return res.status(200).json({
      user: userProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleGetStudentProfile(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projectsHistory = await Project.find(
      {
        teamMembers: { $in: [userId] },
      },
      { _id: 1, title: 1, teamSize: 1, status: 1, createdAt: 1, deadline: 1 }
    ).lean();

    const reviews = await Review.find({ userId })
      .populate("projectId", "_id title projectId.createdBy")
      .lean();

    const studentProfile = {
      username: user.username,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
      projectsHistory,
      reviews,
      createdAt: user.createdAt,
    };

    if (user.githubLink) {
      studentProfile.githubLink = user.githubLink;
    }
    if (user.linkedinLink) {
      studentProfile.linkedinLink = user.linkedinLink;
    }
    if (user.emailLink) {
      studentProfile.emailLink = user.emailLink;
    }

    return res.status(200).json({
      user: studentProfile,
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleGetMyProfile,
  handleGetStudentProfile,
};
