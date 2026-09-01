// One-off seed script: creates the single admin account. There is no admin
// signup route, so this is the only way an admin comes into existence.
require("dotenv").config();

const bcrypt = require("bcrypt");

const { connectDatabase, disconnectDatabase } = require("../config/database");
const User = require("../models/user.model");

const createAdmin = async () => {
   try {
      await connectDatabase();
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

      await disconnectDatabase();
      console.log("MongoDB connection closed");
   } catch (error) {
      console.error("Error creating admin:", error);
      process.exit(1);
   }
};

createAdmin();
