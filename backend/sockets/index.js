/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Socket.IO initialisation and event handling web socket
 *  Integrates Express session middleware for authenticating socket connections
 *  Manages real-time presence tracking of connected users
 *  Handles broadcasting 'onlineUsers' update to all clients
 *  Provides a 'fanOutNewPost' function to notify relevant users about new posts
 *  by creating notifications and emitting 'newPost' events
 *  Last mod: 26/05/2025
 * */

import { Server } from "socket.io";
import sessionMiddleware from "../session.js"; // Shared Express session configuration
import Notification from "../models/notification.js";
import Subscription from "../models/subscription.js";

// Initializes and configures the Socket.IO server
export default function initSockets(httpServer) { 
  // Create a new Socket.IO server instance, attaching it to the HTTP server
  const io = new Server(httpServer, {
    cors: { origin: "http://localhost:5173", credentials: true }
  }); // Allow cookies to be sent with the request

  // Middleware to make Express session data available to Socket.IO handlers
  io.use((socket, next) => sessionMiddleware(socket.request, {}, next));

  // Map to store active socket IDs for each user (userId -> Set of socket IDs)
  // This helps in sending messages to all connected devices of a specific user
  const socketsByUser = new Map();

  // Event handler for new client connections
  io.on("connection", socket => {
    // Extract userId from the session, if the user is authenticated via Passport.js
    const userId = socket.request.session.passport?.user ?? null;

    /* ---------- presence tracking only if logged-in ---------- */
    if (userId) {
      // If the user is logged in, track their socket connection
      if (!socketsByUser.has(userId)) {
        // Create a new set for the user if it's their first connection
        socketsByUser.set(userId, new Set());
      }
      // Add the current socket ID to the user's set
      socketsByUser.get(userId).add(socket.id);

      // Notify all clients about the updated list of online users
      broadcastOnline();
    }

    // Always send current list of online users to the newcomer
    socket.emit("onlineUsers", [...socketsByUser.keys()]);

    // Event handler for client disconnections
    socket.on("disconnect", () => {
      if (!userId) return; // Guests were never added to the map, so nothing to do

      const set = socketsByUser.get(userId);
      if (set) {
        set.delete(socket.id); // Remove the disconnected socket ID from the user's set
        // If the user has no more active connections, remove them from the map
        if (!set.size) socketsByUser.delete(userId);

        // Notify all clients about the updated list of online users
        broadcastOnline();
      }
    });
  });

  // Function to broadcast the current list of online user IDs to all connected clients
  function broadcastOnline() {
    io.emit("onlineUsers", [...socketsByUser.keys()]);
  }

  /* ---- fanOutNewPost notifies subscribers about a new post ---- */
  // This function is called when a new post is created
  async function fanOutNewPost(postDoc) {
    // Find all users subscribed to the author of the new post
    const subs = await Subscription.find(
      { targetUserId: postDoc.createdBy._id }, // Filter by the ID of the post's creator
      "subscriberId" // Select only the 'subscriberId' field
    ).lean(); // Get plain JavaScript objects

    // For each subscriber:
    subs.forEach(async ({ subscriberId }) => {
      // 1. Create a notification document in the database
      await Notification.create({ recipientId: subscriberId, postId: postDoc._id });

      // 2. If the subscriber is online, send them a real-time 'newPost' event
      const set = socketsByUser.get(String(subscriberId));
      if (set)
        set.forEach(sid =>
          io.to(sid).emit("newPost", { // Emit to each specific socket ID of the subscriber
            id: `${Date.now()}-${postDoc._id}`, // Unique ID for the client-side notification
            postId: postDoc._id,
            title: postDoc.title,
            author: postDoc.createdBy.username,
            createdAt: new Date().toISOString()
          })
        );
    });
  }
  // Return the fanOutNewPost function so it can be used by controllers
  return { fanOutNewPost };
}