/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Authentication middleware - gatekeeper for authenticated routes
 *  It checks if a user is authenticated using Passport.js's isAuthenticated() method
 *  If the user is authenticated, it allows the request to proceed to the next handler in the chain
 *  If the user is not authenticated, it sends a 401 Unauthorized HTTP status code
 *  effectively blocking access to the protected route
 *  Last mod: 25/05/2025
 * */

// Middleware function to ensure the user is authenticated
export const ensureAuth = (req, res, next) =>
  // Check if the request is authenticated (Passport.js method)
  req.isAuthenticated() ? next() : res.sendStatus(401);
  // If authenticated, proceed to the next / if not, send a 401 Unauthorized status
