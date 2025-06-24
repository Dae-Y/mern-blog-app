/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Post Routes
 *  Defines API endpoints for managing posts
 *  Covers creating, reading, updating, deleting (CRUD), and listing/searching posts
 *  Mounted typically under /api/posts
 *  Last mod: 25/05/2025
 * */

import { Router } from "express";
// Import all exported functions from postController as 'pc'
import * as pc from "../controllers/postController.js";
// Import middleware to ensure the user is authenticated for protected routes
import { ensureAuth } from "../middleware/ensureAuth.js";

const router = Router(); // Initialize a new Express router

// Route to list all posts or filter posts based on a query
// HTTP Method: GET
// Path: /
// Controller: postController.list
router.get("/", pc.list);

// Route for searching posts (uses the same controller as listing)
// The controller will handle the ?q= query parameter for searching
// HTTP Method: GET
// Path: /search
// Controller: postController.list
router.get("/search", pc.list);

// Route to get a single post by its ID
router.get("/:id", pc.getOne);

// Route to create a new post
router.post("/", ensureAuth, pc.create);

// Route to update an existing post by its ID
router.put("/:id", ensureAuth, pc.update);

// Route to delete a post by its ID
router.delete("/:id", ensureAuth, pc.remove);

export default router;