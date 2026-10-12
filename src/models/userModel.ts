import pool from "../config/db";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string | null;
  role: "student" | "instructor" | "admin";
  google_id: string | null;
  created_at: Date;
}

export const findUserByEmail = async (
  email: string
): Promise<User | null> => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  const users = rows as User[];

  return users.length > 0 ? users[0] : null;
};

export const findUserById = async (
  id: number
): Promise<User | null> => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  const users = rows as User[];

  return users.length > 0 ? users[0] : null;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: "student" | "instructor" | "admin" = "student"
): Promise<number> => {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [name, email, password, role]
  );

  const insertResult = result as { insertId: number };

  return insertResult.insertId;
};