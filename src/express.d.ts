import "passport";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: "student" | "instructor" | "admin";
    }
  }
}

export {};
