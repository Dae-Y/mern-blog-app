/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Express session configuration
 *  Configures express-session middleware for managing user sessions
 *  Use MongoStore to persist session data in a MongoDB database
 *  allowing sessions to survive server restarts and be shared across multiple server instances
 *  Defines session secret, resave/saveUninitialized policies, and cookie settings
 *  Last mod: 26/05/2025
 * */

import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

// Load environment variables from .env
dotenv.config();

// Export the configured session middleware
export default session({
  // Secret used to sign the session ID cookie. Should be a long, random string in production
  secret: process.env.SESSION_SECRET, // Use environment variable for session secret

  // Forces the session to be saved back to the session store, even if it wasn't modified
  resave: false, // False is generally recommended as it avoids unnecessary writes

  // Forces a session that is "uninitialized" to be saved to the store
  // A session is uninitialized when it is new but not modified
  // False is useful for implementing login sessions, reducing server storage usage
  saveUninitialized: false,

  // Configure the session store to use MongoDB
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),

  // Configuration for the session cookie
  // 'sameSite' attribute helps prevent CSRF attacks.
  // 'lax' allows the cookie to be sent with top-level navigations and GET requests initiated by third parties
  cookie: { sameSite: "lax" }
  
});
