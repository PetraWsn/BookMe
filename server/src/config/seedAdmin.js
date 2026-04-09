import dotenv from "dotenv";
dotenv.config(); // laddar .env

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import connectDB from "./db.js";

await connectDB();

const password = await bcrypt.hash("admin123", 10);

await User.create({
  name: "Admin",
  email: "admin@bookme.com",
  password,
  role: "admin",
});

console.log("Admin created");
process.exit();
