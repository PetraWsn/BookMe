import { resolvePermissions } from "../utils/resolvePermissions.js";
import { logger } from "../config/logger.js";

export const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = resolvePermissions(userRole);

    const required = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];

    const hasPermission = required.some((perm) => permissions.includes(perm));

    if (!hasPermission) {
      logger.warn(
        `SECURITY: Obehörig åtkomst nekad. Användare: ${req.user.id} (Roll: ${userRole}). ` +
          `Krävde: [${required}], men hade: [${permissions}]. Rutt: ${req.originalUrl}`,
      );

      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
