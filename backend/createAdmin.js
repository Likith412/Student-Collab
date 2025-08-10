const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user.model");

const { connectToMongoDB } = require("./connection");

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error(
    "MONGO_URI environment variable is not defined. Please create a .env file with MONGO_URI=mongodb://localhost:27017/student-collab"
  );
  process.exit(1);
}

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      console.log("Admin user already exists:", {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role,
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin@123", 12);

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:", {
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });

    // Close the connection
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
