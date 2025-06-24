/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Express + Socket.io Server Bootstrap
 *  Initialises and configures the Express application
 *  Sets up the middleware: CORS, JSON parsing, Express session
 *  Passport.js for authentication
 *  Connects to the MongoDB database
 *  Defines and mounts API routes for various resources (auth, posts, etc)
 *  Starts the HTTP server, initialises Socket.IO and makes 'fanOutNewPost' available to controllers
 *  Last mod: 26/05/2025
 * */

import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import session from "./session.js"; // Shared Express session middleware configuration
import cors from "cors";
import passport from "passport";

// Import database connection utility and Passport configuration
import { connectDB } from "./config/db.js";
import initPassport from "./config/passport.js";
import initSockets from "./sockets/index.js"; // Import Socket.IO initialization function.

// Import route handlers
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Establish database connection
await connectDB();

const app = express(); // Create an Express application instance

/* ---------- middleware ---------- */
app.use( // Enable Cross-Origin Resource Sharing (CORS)
  cors({
    origin: "http://localhost:5173", // Allow requests from the frontend development server
    credentials: true // Allow cookies and authorization headers
  })
);

// Parse incoming requests with JSON payloads
app.use(express.json());

// Use the configured Express session middleware, same session instance is shared with Socket.IO
app.use(session);

// Initialize Passport.js for authentication
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login sessions

/* ---------- REST routes ---------- */
app.use("/api", authRoutes); // Mount authentication routes under the /api base path
app.use("/api/posts", postRoutes); // Mount post-related routes under /api/posts
app.use("/api/users", userRoutes); // Mount user-related routes under /api/users
app.use("/api/notifications", notificationRoutes);

/* ---------- start HTTP server + WebSocket integration ---------- */
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);

/* ---------- Socket.io initialisation ---------- */
// Initialize Socket.IO and get the fanOutNewPost function
const { fanOutNewPost } = initSockets(httpServer);
// Make fanOutNewPost available globally in Express app locals
app.locals.fanOutNewPost = fanOutNewPost; // Allows controllers to access, req.app.locals.fanOutNewPost
