import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorizeMiddleware.js";
import { apiLimiter } from "../middlewares/rateLimiterMiddleware.js";
import { validateBooking } from "../middlewares/validateMiddlewares.js";
import * as BookingController from "../controllers/bookingControllers.js";
import { PERMISSIONS } from "../constants/permissions.js";

const router = express.Router();

// Skapa bokning
router.post(
  "/",
  apiLimiter,
  authenticate,
  authorize([PERMISSIONS.BOOKING_CREATE]),
  validateBooking,
  BookingController.createBooking,
);

// Hämta alla bokningar (admin) eller egna (user)
router.get(
  "/",
  authenticate,
  authorize([PERMISSIONS.BOOKING_READ_OWN, PERMISSIONS.BOOKING_READ_ALL]),
  BookingController.getBookings,
);

// Hämta specifik bokning via ID
router.get(
  "/:id",
  authenticate,
  authorize([PERMISSIONS.BOOKING_READ_OWN, PERMISSIONS.BOOKING_READ_ALL]),
  BookingController.getBookingById,
);

// Uppdatera bokning (bara egna bokningar)
router.put(
  "/:id",
  authenticate,
  authorize([PERMISSIONS.BOOKING_UPDATE_OWN]),
  validateBooking,
  BookingController.updateBooking,
);

// Radera bokning (egna bokningar eller admin kan ta bort valfri)
router.delete(
  "/:id",
  authenticate,
  authorize([PERMISSIONS.BOOKING_DELETE_OWN, PERMISSIONS.BOOKING_DELETE_ALL]),
  BookingController.deleteBooking,
);

export default router;
