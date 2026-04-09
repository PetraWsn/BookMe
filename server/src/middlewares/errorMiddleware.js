import { logger } from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
  // 1. Logga detaljerat fel med Winston
  logger.error({
    message: err.message,
    stack: err.stack, // Visar exakt var i koden felet uppstod
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.name : "Anonym",
    ip: req.ip,
  });

  // 2. Skicka svar till klienten
  // döljer stack-trace för användaren i produktion av säkerhetsskäl
  const status = err.status || 500;

  res.status(status).json({
    message: status === 500 ? "Ett internt serverfel uppstod" : err.message,
    // Skicka bara med detaljerat fel om vi är i utvecklingsläge
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

export default errorMiddleware;
