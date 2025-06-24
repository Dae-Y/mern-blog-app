/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Displays the profile of a specific author,  including their posts and 
 *  an option for authenticated users to subscribe/unsubscribe
 *  Allows the author to manage their own posts from this page
 *  Last mod: 26/05/2025
 * */

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Hooks for routing and navigation
import { Container, Button, Card } from "react-bootstrap"; // UI components
import api from "../services/api"; // API service for HTTP requests
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication state
import PostCard from "../components/PostCard"; // Reusable component to display post summaries

export default function AuthorProfile() {
  const { username } = useParams(); // Get the 'username' from the URL parameters
  const { user, setUser } = useAuth(); // Get the current authenticated 'user' and 'setUser' function from AuthContext
  const nav = useNavigate(); // Hook for programmatic navigation, not used, but later use

  const [authorName, setAuthorName] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [posts, setPosts] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  // Fetch author's posts and basic info when component mounts or 'username' changes
  useEffect(() => {
    api.get(`/users/${username}/posts`).then(res => {
      setAuthorName(res.data.author);
      setPosts(res.data.posts || []);
      setAuthorId(res.data.posts[0]?.createdBy._id || "");
    });
  }, [username]);

  // Update 'subscribed' flag when 'user' or 'authorId' changes
  useEffect(() => {
    if (!user || !authorId) return setSubscribed(false);
    const match = user.subscriptions?.some(
      s => (typeof s === "string" ? s : s._id) === authorId
    );
    setSubscribed(match);
  }, [user, authorId]);

  // Toggle subscription status for the currently viewed author
  const toggleSub = async () => {
    if (!authorId) return;
    const url = `/users/${authorId}/${subscribed ? "unsubscribe" : "subscribe"}`;
    await api.post(url);
    const { data } = await api.get("/current-user");
    setUser(data.user);
  };

  // Handle deletion of one of the author's posts
  const handleDelete = async id => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/posts/${id}`);
    setPosts(prev => prev.filter(p => p._id !== id));
  };

  // 'mine' is true if the current logged-in user is viewing their own profile
  const mine = user && user.username === authorName;

  return (
    <Container>
      {/* ---------- Author Header Information ---------- */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="h4">{authorName}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            {posts.length} post{posts.length !== 1 && "s"}
          </Card.Subtitle>

          {!mine && user && (
            <Button
              size="sm"
              variant={subscribed ? "secondary" : "success"}
              onClick={toggleSub}
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* ---------- List of Author's Posts ---------- */}
      {posts.map(p => (
        <Card key={p._id} className="mb-3">
          <Card.Body>
            {/* Use PostCard for a compact view of the post */}
            <PostCard post={p} />

            {/* Display Edit and Delete buttons if the current user owns these posts */}
            {mine && (
              <div className="mt-2">
                <Link to={`/edit/${p._id}`} className="btn btn-primary btn-sm me-2">
                  Edit
                </Link>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}

      {!posts.length && <p>No posts yet.</p>}
    </Container>
  );
}