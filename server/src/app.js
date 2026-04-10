import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import { apiLimiter } from "./middlewares/rateLimiterMiddleware.js";
import { httpLogger } from "./middlewares/httpLoggerMiddleware.js";
import { securityLogger } from "./middlewares/securityLogger.js";
import { logger } from "./config/logger.js";

const app = express();

// Kör loggningen först av allt för att fånga alla försök
app.use(httpLogger);

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(securityLogger);
app.use("/api", apiLimiter);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

// Logga att server-logiken är redo (sker vid initiering)
logger.info("Express-motor och rutter har laddats");

export default app;
