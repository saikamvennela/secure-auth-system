
import { Router } from "express";

import { getMyProfile } from "../controllers/userController";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

// Any logged-in user can view their own profile
router.get("/profile", authenticate, getMyProfile);

// Only instructors and admins can access this route
router.get(
  "/instructor",
  authenticate,
  authorize("instructor", "admin"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the instructor area",
    });
  }
);

// Only admins can access this route
router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin area",
    });
  }
);

export default router;
