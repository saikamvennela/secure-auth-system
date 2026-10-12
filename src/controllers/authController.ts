
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import {
  findUserByEmail,
  createUser,
} from "../models/userModel";

import { generateToken } from "../utils/generateToken";

// ==================== REGISTER ====================

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Accept only name, email and password from public registration.
    const { name, email, password } = req.body;

    // Validate required fields.
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
      return;
    }

    // Basic email validation.
    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
      return;
    }

    // Require a minimum password length.
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters",
      });
      return;
    }

    // Check whether the email is already registered.
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "Email already registered",
      });
      return;
    }

    // Hash the password before saving it.
    const hashedPassword = await bcrypt.hash(password, 10);

    // SECURITY: Public registration always assigns the student role.
    // Never trust a role sent by the client.
    const userRole = "student";

    // Save the new user in MySQL.
    const userId = await createUser(
      name.trim(),
      normalizedEmail,
      hashedPassword,
      userRole
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId,
      role: userRole,
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ==================== LOGIN ====================

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate required fields.
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find the user in MySQL.
    const normalizedEmail = email.trim().toLowerCase();

    const user = await findUserByEmail(normalizedEmail);

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Compare the entered password with the stored hash.
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate a JWT after successful authentication.
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return the token and safe user details.
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
