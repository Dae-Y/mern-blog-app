/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Displays a list of authors the current user is subscribed to
 *  Allows the user to unsubscribe from an author directly from this list
 *  Updates the global authentication state (user's subscriptions) after unsubscribing
 *  Last mod: 26/05/2025
 * */

import { useState, useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap"; // UI components
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication state

export default function Subscriptions() {
  const { setUser } = useAuth();
  const [subs, setSubs] = useState([]);

  // Fetch the current user's subscriptions when the component mounts
  useEffect(() => {
    api.get("/users/me/subscriptions").then(res => setSubs(res.data));
  }, []);

  // Handles the unsubscribe action for a specific author
  // Updates the local list of subscriptions
  // Fetches the updated current user data and updates the AuthContext
  const handleUnsub = async id => {
    await api.post(`/users/${id}/unsubscribe`);

    // Update local list state immediately for responsive UI
    setSubs(subs.filter(u => u._id !== id));

    // Refresh AuthContext to reflect the change globally
    // This ensures other components (e.g., AuthorProfile, PostDetail) see the updated subscription list
    const { data } = await api.get("/current-user");
    setUser(data.user);
  };

  // If the user has no subscriptions, display a message
  if (!subs.length)
    return <p className="text-muted">You’re not subscribed to anyone yet.</p>;

  return (
    <ListGroup>
      {subs.map(u => (
        <ListGroup.Item
          key={u._id}
          className="d-flex justify-content-between align-items-center"
        >
          <Link to={`/author/${u.username}`}>{u.username}</Link>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleUnsub(u._id)}
          >
            Unsubscribe
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}