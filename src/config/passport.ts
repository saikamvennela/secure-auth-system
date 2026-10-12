
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";

import {
  findUserByEmail,
  findUserById,
} from "../models/userModel";

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await findUserByEmail(
          email.trim().toLowerCase()
        );

        if (!user || !user.password) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const userId = Number(id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return done(null, false);
    }

    const user = await findUserById(userId);

    if (!user) {
      return done(null, false);
    }

    return done(null, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return done(error);
  }
});

export default passport;
