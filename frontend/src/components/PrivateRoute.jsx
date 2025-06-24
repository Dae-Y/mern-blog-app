/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  A component wrapper to protect routes that require authentication
 *  It ensures that only authenticated users can access certain parts
 *  Last mod: 26/05/2025
 * */

import { Navigate } from "react-router-dom"; // Used for declarative routing/redirects
import { useAuth } from "../context/AuthContext"; // Custom hook to access authentication state

// A higher-order component that checks if a user is authenticated
// If the user is authenticated, it renders the child components (the protected route)
// Otherwise, it redirects the user to the login page
export default function PrivateRoute({ children }) {
  // Access the current user state from the authentication context
  const { user } = useAuth(); // 'user' will be an object if logged in, null otherwise

  // Ternary operator to conditionally render content:
  // If 'user' exists (is truthy), render the 'children' (the protected component/route)
  // Otherwise, redirect the user to the /login page
  // 'replace' prop on Navigate ensures the login route replaces the current entry in history,
  // so the user doesn't go back to the private route they were redirected from by pressing the back button
  return user ? children : <Navigate to="/login" replace />;
}
