/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Initializes and exports a Socket.IO client instance
 *  It provides a single, shared Socket.IO connection for the frontend application
 *  Last mod: 26/05/2025
 * */

import { io } from "socket.io-client"; // Import the Socket.IO client library
import api from "./api";

// Create and configure the Socket.IO client instance
// Connects to the Socket.IO server running at "http://localhost:3000"
const socket = io("http://localhost:3000", { withCredentials: true });
// withCredentials: true ensures that the client sends cookies
// It is necessary for the server to associate the socket connection with an authenticated user session

// Export the configured socket instance to be used throughout the application
export default socket;