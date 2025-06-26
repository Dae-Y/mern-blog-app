/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Authentication Routes
 *  Defines API endpoints related to user authentication
 *  Handles registration, login, logout, fetching current user status
 *  Mounted typically under /api/auth or /api
 *  Last mod: 25/05/2025
 * */

import { Router } from "express";
// Import controller functions for handling authentication logic
import { register, login, logout, currentUser } from "../controllers/authController.js";

const router = Router(); // Initialize a new Express router

// Route to handle new user registration
// HTTP Method: POST
// Path: /register
// Controller: authController.register
router.post("/register", register);

// Route to handle user login
// HTTP Method: POST
// Path: /login
// Controller: authController.login
router.post("/login", login);

// Route to handle user logout
router.post("/logout", logout);

// Route to get the currently authenticated user's information
router.get("/current-user", currentUser);

export default router;