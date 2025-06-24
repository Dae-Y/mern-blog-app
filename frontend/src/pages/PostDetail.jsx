/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Displays the full content of a single blog post
 *  Allows authenticated users to subscribe/unsubscribe to the post's author
 *  Allows the post's author (or admin) to edit or delete the post
 *  Last mod: 26/05/2025
 * */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Hooks for routing and navigation
import { Card, Badge, Button, Alert } from "react-bootstrap"; // UI components
import api from "../services/api"; // API service for HTTP requests
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication state

export default function PostDetail() {
  const { id } = useParams(); // Get the post 'id' from the URL parameters
  const { user } = useAuth(); // Get the current authenticated 'user' from AuthContext
  const nav = useNavigate(); // Hook for programmatic navigation

  const [post, setPost] = useState(null); // State to store the fetched post data
  const [error, setError] = useState(""); // State to store any error messages during data fetching

  // Fetch post data when the component mounts or the 'id' parameter changes
  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setError("Post not found"));
  }, [id]);

  // Helper booleans for conditional rendering and actions
  // 'mine' is true if the current logged-in user is the author of the post
  const mine = user && post && post.createdBy.username === user.username;
  // 'subscribed' is true if the current logged-in user is subscribed to the post's author
  const subscribed =
    user && post && user.subscriptions?.includes(post.createdBy._id);

  // Toggles the subscription status for the post's author
  // Sends a request to either subscribe or unsubscribe
  const toggleSub = async () => {
    try {
      const url = `/users/${post.createdBy._id}/` + (subscribed ? "unsubscribe" : "subscribe");
      const { data } = await api.post(url);
      if (data.ok) {
        // naive update: reload current user info
        const me = await api.get("/current-user");
        user.subscriptions = me.data.user.subscriptions;
        window.location.reload(); // refresh component state and reflect subscription change
      }
    } catch {
      alert("Action failed");
    }
  };

  // Handles the deletion of the post, prompts for confirmation before proceeding
  const handleDelete = async () => {
    if (!window.confirm("Delete permanently?")) return;
    await api.delete(`/posts/${id}`);
    nav("/");
  };

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!post) return null;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>

        <Card.Subtitle className="mb-3 text-muted">
          by{" "}
          <Link to={`/author/${post.createdBy.username}`}>
            {post.createdBy.username}
          </Link>
        </Card.Subtitle>

        {!mine && user && (
          <Button
            variant={subscribed ? "secondary" : "success"}
            size="sm"
            className="mb-3"
            onClick={toggleSub}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </Button>
        )}

        <Card.Text style={{ whiteSpace: "pre-wrap" }}>{post.content}</Card.Text>

        {post.tags.map(t => (
          <Badge key={t} bg="secondary" className="me-1">
            {t}
          </Badge>
        ))}

        {mine && (
          <div className="mt-4">
            <Link to={`/edit/${post._id}`} className="btn btn-primary me-2">
              Edit
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}