import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
  role: "student" | "instructor" | "admin";
}

export const generateToken = (user: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1h",
    }
  );
};