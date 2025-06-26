/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Manages real-time notifications for the authenticated user
 *  Fetches initial unread notifications upon user login
 *  Listens for 'newPost' events from Socket.IO to add live notifications
 *  Provides functionality to mark all notifications as seen
 *  Exposes the list of notifications and the count of unseen notifications
 *  Last mod: 29/05/2025
 * */

import { createContext, useState, useEffect, useContext } from "react";
import socket from "../services/socket"; // Shared Socket.IO client instance
import api from "../services/api"; // API service for HTTP requests
import { useAuth } from "./AuthContext"; // Custom hook to access authentication state

// Create the Notification context
export const NotificationContext = createContext();

// Provides notification state (list, unseenCount) and actions (markSeen) to its children
// props.children - The child components that will have access to this context
export function NotificationProvider({ children }) {
  const { user } = useAuth(); // Access the current authenticated user from AuthContext
  const [list, setList] = useState([]); // State to store the list of notifications

  // Fetch initial unread notifications when a user logs in
  useEffect(() => {
    if (user) // Initialize all fetched notifications with false on the client-side
      api.get("/notifications").then(res =>
        setList(res.data.map(n => ({ ...n, seen: false })))
      );
    else setList([]);
  }, [user]);

  // Listen for live push notifications (newPost events) from the socket
  useEffect(() => {
    socket.on("newPost", n => // Add the new notification to the beginning of the list, marked as unseen
      setList(prev => [{ ...n, seen: false }, ...prev])
    );
    return () => socket.off("newPost"); // Cleanup function: remove the event listener
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Function to mark all currently displayed notifications as seen
  const markSeen = async () => { // Only proceed if there's at least one notification currently
    if (!list.some(n => !n.seen)) return; // currently marked as unseen in the client state
    await api.patch("/notifications/mark-seen"); // Make an API call to the backend to mark notifications as seen
    setList(list.map(n => ({ ...n, seen: true })));
  };

  // mark one as seen
  const markOneSeen = async id => {
    setList(prev => prev.filter(n => n.id !== id)); // optimistic
    await api.patch(`/notifications/${id}/seen`);
  };

  // Calculate the count of notifications that are currently marked as 'seen: false'
  const unseenCount = list.filter(n => !n.seen).length;

  // Provide the notification list, unseen count, and markSeen function to child components
  return (
    <NotificationContext.Provider value={{ list, unseenCount, markSeen, markOneSeen }}>
      {children}
    </NotificationContext.Provider>
  );
}