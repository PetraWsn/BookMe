import express from "express";
import * as RoomController from "../controllers/roomControllers.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorizeMiddleware.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize(PERMISSIONS.ROOM_CREATE),
  RoomController.createRoom,
);
router.get(
  "/",
  authenticate,
  authorize(PERMISSIONS.ROOM_READ),
  RoomController.getRooms,
);
router.get(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROOM_READ),
  RoomController.getRoomById,
);
router.put(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROOM_UPDATE),
  RoomController.updateRoom,
);
router.delete(
  "/:id",
  authenticate,
  authorize(PERMISSIONS.ROOM_DELETE),
  RoomController.deleteRoom,
);

export default router;
