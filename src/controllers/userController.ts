
import { Request, Response } from "express";

export const getMyProfile = (
  req: Request,
  res: Response
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
