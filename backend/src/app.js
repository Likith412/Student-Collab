const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.route");
const projectRoutes = require("./routes/project.route");
const applicationRoutes = require("./routes/application.route");
const reviewRoutes = require("./routes/review.route");
const constantRoutes = require("./routes/constant.route");
const { authenticateUser } = require("./middlewares/auth.middleware");

const app = express();

app.use(
   cors({
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      credentials: true,
   })
);

app.use(express.json());

// Health/landing route — a quick check that the API is up.
app.get("/", (_req, res) => {
   res.send({ message: "Student Collab API" });
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/constants", constantRoutes);

app.get("/api/protected", authenticateUser, (req, res) => {
   return res.status(200).json({ message: "Authenticated", user: req.user });
});

module.exports = app;
