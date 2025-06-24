/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Manages and provides the list of online user IDs
 *  It listens to 'onlineUsers' events from Socket.IO to keep the list updated in real-time
 *  Last mod: 26/05/2025
 * */

import { createContext, useState, useEffect, useContext } from "react";
import { SocketContext } from "./SocketContext"; // Context providing the Socket.IO client instance

// Create the Presence context, initialized with an empty array (no users online initially)
export const PresenceContext = createContext([]);

// Provides the list of online user IDs to its children
export function PresenceProvider({ children }) {
  const socket = useContext(SocketContext); // Access the Socket.IO client instance from SocketContext
  const [onlineIds, setOnlineIds] = useState([]); // State to store the array of online user IDs

  // Effect to subscribe to 'onlineUsers' socket events
  useEffect(() => {
    socket.on("onlineUsers", ids => setOnlineIds(ids)); // Register the event listener
    return () => socket.off("onlineUsers"); // Cleanup function: remove the event listener
  }, [socket]); // Dependency array: re-run effect if the socket instance changes

  // Provide the list of online user IDs to child components
  return (
    <PresenceContext.Provider value={onlineIds}>
      {children}
    </PresenceContext.Provider>
  );
}