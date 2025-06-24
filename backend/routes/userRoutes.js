/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  User Routes
 *  Defines API endpoints related to user profiles and interactions
 *  Handles listing active users, fetching posts by a specific author, user subscriptions
 *  Mounted typically under /api/users
 *  Last mod: 25/05/2025
 * */

import { Router } from "express";
// Import controller functions for handling user-related logic
import {
  listActive,
  postsByAuthor,
  subscribe,
  unsubscribe,
  mySubscriptions
} from "../controllers/userController.js";
// Import middleware to ensure the user is authenticated for protected routes
import { ensureAuth } from "../middleware/ensureAuth.js";

const router = Router(); // Initialize a new Express router

// Route to get a list of active users
// HTTP Method: GET
// Path: /active
// Controller: userController.listActive
router.get("/active", listActive);

// Route to get all posts by a specific author (identified by username)
router.get("/:username/posts", postsByAuthor);

// New subscription endpoints

// Route for the authenticated user to subscribe to another user 
router.post("/:id/subscribe", ensureAuth, subscribe);

// Route for the authenticated user to unsubscribe from another user
router.post("/:id/unsubscribe", ensureAuth, unsubscribe);

// Route for the authenticated user to get their list of subscriptions
router.get("/me/subscriptions", ensureAuth, mySubscriptions);

export default router;