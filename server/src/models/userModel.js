import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
  },
  { timestamps: true }, // Skapar createdAt och updatedAt automatically som används i bookingService för cache-invalidation
);

export default mongoose.model("User", userSchema); // Exporterar modellen som "User" så att den kan importeras i andra filer.
