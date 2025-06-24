/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Provides a global instance of the Socket.IO client
 *  It allows other parts of the application to access the same socket connection
 *  without needing to import it directly or manage multiple instances
 *  Last mod: 26/05/2025
 * */

import { createContext } from "react";
import socket from "../services/socket"; // Import the pre-configured Socket.IO client instance

// Create the SocketContext, initializing it with the imported socket instance
export const SocketContext = createContext(socket);

// Provides the shared Socket.IO client instance to its children via context
export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}