import { logger } from "../config/logger.js";

export const httpLogger = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  // lyssnar på "finish"-eventet som triggas när svaret skickas till klienten
  res.on("finish", () => {
    let userIdentifier = "Anonym";
    if (req.user) {
      userIdentifier = req.user.name || req.user.username || "Okänd";
    }
    const ip = req.ip;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    // Logga resultatet
    logger.info(
      `${method} ${url} - Status: ${status} - Användare: ${userIdentifier} - IP: ${ip}`,
    );
  });

  next();
};
