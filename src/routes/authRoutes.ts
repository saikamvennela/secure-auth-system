
import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";

import passport from "../config/passport";

import {
  register,
  login,
} from "../controllers/authController";

const router = Router();

// 1. Register a user
// POST /api/auth/register
router.post("/register", register);

// 2. JWT login
// POST /api/auth/login
router.post("/login", login);

// 3. Passport Local login
// POST /api/auth/login-local
router.post(
  "/login-local",
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message?: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(401).json({
            success: false,
            message:
              info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (loginError) => {
          if (loginError) {
            return next(loginError);
          }

          return res.status(200).json({
            success: true,
            message: "Passport Local login successful",
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          });
        });
      }
    )(req, res, next);
  }
);

// 4. Check Passport session
// GET /api/auth/session
router.get("/session", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json({
      success: true,
      message: "Session is active",
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      },
    });
    return;
  }

  res.status(401).json({
    success: false,
    message: "No active session",
  });
});

export default router;
