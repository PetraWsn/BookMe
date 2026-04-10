import { logger } from "../utils/logger.js"; // Eller var du nu har din logger

export const securityLogger = (req, res, next) => {
  // Vi kollar både URL-parametrar (query) och inskickad data (body)
  const payload = JSON.stringify(req.query) + JSON.stringify(req.body);

  // Vanliga mönster för XSS-attacker
  const xssPatterns = ["<script>", "onerror=", "javascript:", "<img", "alert("];

  const hasMaliciousContent = xssPatterns.some((pattern) =>
    payload.toLowerCase().includes(pattern.toLowerCase()),
  );

  if (hasMaliciousContent) {
    logger.warn(
      `SÄKERHETSLARM: Misstänkt XSS/Payload upptäckt! 
       IP: ${req.ip} 
       Metod: ${req.method} 
       URL: ${req.originalUrl} 
       Data: ${payload}`,
    );
  }

  next();
};
