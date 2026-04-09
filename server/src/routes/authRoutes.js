import express from "express";
import {
  login,
  register,
  refreshToken,
  logout,
  me,
  updatePassword,
  updateProfile,
  deleteAccount,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshToken);

// Returnerar user som är loggad in
router.get("/me", authenticate, me);

router.post("/logout", authenticate, logout);

// Uppdatera profil (namn/email)
router.patch("/update-profile", authenticate, updateProfile);

// Ändra lösenord
router.patch("/update-password", authenticate, updatePassword);

// Radera konto
router.delete("/delete-account", authenticate, deleteAccount);

export default router;
