
import { RequestHandler } from "express";

type UserRole = "student" | "instructor" | "admin";

export const authorize = (
  ...allowedRoles: UserRole[]
): RequestHandler => {
  return (req, res, next): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });
      return;
    }

    next();
  };
};
