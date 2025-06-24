/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Manages global authentication state and synchronizes it with localStorage
 *  Handles Socket.IO connection reconnections upon authentication changes (login/logout)
 *  to ensure the socket connection reflects the user's current auth status
 *  Last mod: 26/05/2025
 * */

import { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket"; // Import the shared Socket.IO client instance

// Create the authentication context. Initial value is null
export const AuthContext = createContext(null);

// Custom hook for easy consumption of the AuthContext
export const useAuth = () => useContext(AuthContext);

// Provides authentication state (user object) and a setter function (setUser) to its children
// Initializes user state from localStorage on mount
// Keeps localStorage synchronized with the user state
// Manages Socket.IO connection: disconnects and reconnects on user state changes
// Forces a fresh socket handshake whenever auth changes
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Keep localStorage in sync with the user state
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Manage socket connection on every authentication change (login/logout)
  useEffect(() => {
    // Always disconnect the existing socket connection, if any
    // It ensures that a fresh handshake occurs with the current session cookie
    if (socket.connected) socket.disconnect();
    socket.connect(); // Establish a new socket connection
  }, [user]); // The browser will automatically send the latest session cookie

  // Provide the user state and setUser function to child components
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}