
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import session from "express-session";
import dotenv from "dotenv";

import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Parse JSON and form request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests
app.use(morgan("dev"));

// Configure Express sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Initialize Passport and restore login sessions
app.use(passport.initialize());
app.use(passport.session());

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected user routes
app.use("/api/users", userRoutes);

// Home route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Authentication System API is running",
  });
});

export default app;
