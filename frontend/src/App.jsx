/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  The top-level component that defines the application's routing structure
 *  It includes the main navigation bar and sets up all the page routes
 *  Last mod: 26/05/2025
 * */

import { Routes, Route } from "react-router-dom"; // Components for defining application routes
import NavigationBar from "./components/NavigationBar"; // The main navigation bar component

// Importing page components that will be rendered by the routes
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";
import PostEditor from "./pages/PostEditor";
import AuthorProfile from "./pages/AuthorProfile";
import Subscriptions from "./pages/Subscriptions";
import PrivateRoute from "./components/PrivateRoute"; // Wrapper component to protect routes

function App() {
  return (
    <>
      <NavigationBar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route for viewing a single post's details. Uses a URL parameter 'id' */}
        <Route path="/posts/:id" element={<PostDetail />} />

        {/* ---------- Protected Routes (require authentication) ---------- */}
        <Route
          path="/new"
          element={
            <PrivateRoute>
              <PostEditor />
            </PrivateRoute>
          }
        />

        {/* Route for editing an existing post. Uses a URL parameter 'id'. Protected by PrivateRoute. */}
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <PostEditor />
            </PrivateRoute>
          }
        />

        {/* Route for viewing an author's profile page. Uses a URL parameter 'username'. */}
        <Route path="/author/:username" element={<AuthorProfile />} />

        <Route
          path="/subscriptions"
          element={
            <PrivateRoute> {/* Ensures only authenticated users can view their subscriptions. */}
              <Subscriptions />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;