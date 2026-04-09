import rateLimit from "express-rate-limit";
import { logger } from "../config/logger.js";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuter
  max: 100,

  // Denna funktion körs när en användare blir blockerad
  handler: (req, res, next, options) => {
    logger.warn(
      `RATE_LIMIT_EXCEEDED: IP ${req.ip} försökte nå ${req.originalUrl}. Användare: ${req.user?.name || "Anonym"}`,
    );

    res.status(options.statusCode).json({
      message: "För många anrop från din IP, försök igen om 15 minuter.",
    });
  },

  // Standardinställningar för headers
  standardHeaders: true,
  legacyHeaders: false,
});
