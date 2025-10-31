const express = require("express");
const cors = require("cors");

const { connectToMongoDB } = require("./connection");
const userRoutes = require("./routes/user.route");
const projectRoutes = require("./routes/project.route");
const applicationRoutes = require("./routes/application.route");
const reviewRoutes = require("./routes/review.route");
const { authenticateUser } = require("./middlewares/auth.middleware");

require("dotenv").config();

const app = express();

// DB Connection
connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error", err));

// Middlewares
app.use(
  cors({
    origin: "*", // Allow specific origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allow specific methods
    credentials: true, // Allow credentials
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/protected", authenticateUser, (req, res) => {
  return res.status(200).json({ message: "Authenticated", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
