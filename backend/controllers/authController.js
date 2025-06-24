/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  manages user registration, login, logout, session status
 *  Validates registration using Joi, Passport.js for local authentication strategy
 *  Fetches and includes user subscription IDs upon login and for current user status
 *  Last mod: 25/05/2025
 * */

import Joi from "joi";
import passport from "passport";

import User from "../models/user.js";
import Subscription from "../models/subscription.js";

/* ---------- validation schema ---------- */
// Defines the structure and validation rules for user registration data
const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required() // required a minimum length of 6
});

/* ---------- POST /api/register ---------- */
// Handles new user registration
export const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ ok: false, message: error.details[0].message });

  try {
    // Create a new user with the validated username and password.
    // The pre-save hook in the User model will hash the password.
    const user = await User.create({
      username: value.username,
      password: value.password
    });

    // Send a 201 Created status with user information (ID, username).
    res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        subscriptions: []
      }
    });
  } catch {
    // If user creation fails, send a 409 Conflict status
    res.status(409).json({ ok: false, message: "Username already exists" });
  }
};

/* ---------- POST /api/login ---------- */
// Handles user login using Passport's local strategy
export const login = (req, res, next) => {
   // Authenticate the user using the 'local' Passport strategy
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user)
      // If authentication fails, send a 400 Bad Request
      return res.status(400).json({ ok: false, message: info.message });

    // Fetch the IDs of users the authenticated user is subscribed to
    const subs = await Subscription.find(
      { subscriberId: user.id },
      "targetUserId"
    ).lean();
    const ids = subs.map(s => s.targetUserId.toString());

    // Log the user in (establishes a session)
    req.logIn(user, err2 => {
      if (err2) return next(err2);
      res.json({
        ok: true,
        user: {
          id: user.id,
          username: user.username,
          subscriptions: ids
        }
      });
    });
  })(req, res, next);
};

/* ---------- POST /api/logout ---------- */
// Handles user logout
export const logout = (req, res) => {
  req.logout(() => res.json({ ok: true }));
};

/* ---------- GET /api/current-user ---------- */
// Retrieves information about the currently authenticated user
export const currentUser = async (req, res) => {
  // Check if the user is authenticated
  if (!req.isAuthenticated()) return res.status(401).json({ ok: false });

  // Fetch the IDs of users the authenticated user is subscribed to
  const subs = await Subscription.find(
    { subscriberId: req.user.id },
    "targetUserId"
  ).lean();
  const ids = subs.map(s => s.targetUserId.toString());

  res.json({
    ok: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      isAdmin: req.user.isAdmin,
      subscriptions: ids
    }
  });
};
