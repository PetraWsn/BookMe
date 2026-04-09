import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/userControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorizeMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.get("/", authenticate, authorize([PERMISSIONS.USER_READ_ALL]), getUsers);

router.patch(
  "/:id",
  authenticate,
  authorize([PERMISSIONS.USER_UPDATE_ALL]),
  updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorize([PERMISSIONS.USER_DELETE_ALL]),
  deleteUser,
);

export default router;
