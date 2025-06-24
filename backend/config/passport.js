/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Configure Passport-Local strategy for username / password login 
 *  and hook serialise / deserialise.
 *  default function initPassport(passport) (called once from server.js)
 *  Last mod: 25/05/2025
 * */

import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user.js";

// Attach LocalStrategy and serialisers to a Passport instance
export default function initPassport(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find the user record
        const user = await User.findOne({ username });
        if (!user) return done(null, false, { message: "Invalid username" });

        // Compare hashed passwords
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { message: "Invalid password" });

        // Success - pas user through to req.user
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    })
  );

  // Session serialisation
  passport.serializeUser((u, done) => done(null, u.id));
  passport.deserializeUser((id, done) =>
    User.findById(id).then(u => done(null, u))
  );
}