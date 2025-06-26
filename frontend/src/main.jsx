/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  The entry point for the React application, responsible for bootstrapping
 *  It renders the root App component and wraps it 
 *  with necessary context providers and routing capabilities
 *  Last mod: 26/05/2025
 * */

import React from "react";
import ReactDOM from "react-dom/client"; // React's library for DOM rendering
import { BrowserRouter } from "react-router-dom"; // Enables client-side routing
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS for global styling

import App from "./App"; // The main application component

// Importing context providers to make global state and functions available throughout the app
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { PresenceProvider } from "./context/PresenceContext";
import { NotificationProvider } from "./context/NotificationContext";

// Render the application into the DOM element with the ID 'root'
ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode activates additional checks and warnings for its descendants
  // It's a developer tool for highlighting potential problems in an application
  <React.StrictMode>
    {/* AuthProvider manages user authentication state. */}
    <AuthProvider>
      {/* SocketProvider provides a shared Socket.IO client instance. */}
      <SocketProvider>
        {/* PresenceProvider manages real-time user presence (online status). */}
        <PresenceProvider>
          {/* NotificationProvider manages real-time notifications. */}
          <NotificationProvider>
            {/* BrowserRouter enables routing capabilities for the App component and its children. */}
            <BrowserRouter>
              <App />  {/* The main application component where routes and UI structure are defined. */}
            </BrowserRouter>
          </NotificationProvider>
        </PresenceProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);