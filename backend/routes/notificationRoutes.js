/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Notification Routes
 *  Defines API endpoints for managing user notifications
 *  Allows users to fetch unread notifications and mark them as seen
 *  Mounted typically under /api/notifications
 *  Last mod: 29/05/2025
 * */

import { Router } from "express";
// Import controller functions for handling notification logic
import { unread, markSeen, markOneSeen } from "../controllers/notificationController.js";
// Import middleware to ensure the user is authenticated before accessing these routes
import { ensureAuth } from "../middleware/ensureAuth.js";

const router = Router(); // Initialize a new Express router

// Route to get all unread notifications for the authenticated user
// HTTP Method: GET
// Path: /
// Middleware: ensureAuth (user must be logged in)
// Controller: notificationController.unread
router.get("/", ensureAuth, unread);

// Route to mark notifications as seen for the authenticated user
// HTTP Method: PATCH (as it's a partial update to the notification resource state)
// Path: /mark-seen
// Middleware: ensureAuth (user must be logged in)
// Controller: notificationController.markSeen
router.patch("/mark-seen", ensureAuth, markSeen); // all unseen -> seen

router.patch("/:id/seen", ensureAuth, markOneSeen); // one -> seen

export default router;