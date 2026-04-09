import jwt from "jsonwebtoken";
import { logger } from "../config/logger.js";

//** Middleware för autentisering **/
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(
      `MISSING_TOKEN: Försök att nå skyddad rutt (${req.originalUrl}) från IP: ${req.ip}`,
    );
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vi lägger till username i req.user för att kunna logga namn i framtiden
    req.user = {
      id: decoded.id || decoded._id || decoded.sub,
      role: decoded.role,
      name: decoded.name || "Okänd",
    };

    next();
  } catch (error) {
    logger.error(
      `INVALID_TOKEN: Felaktig token från IP: ${req.ip}. Fel: ${error.message}`,
    );
    return res.status(401).json({ message: "Invalid token" });
  }
};
