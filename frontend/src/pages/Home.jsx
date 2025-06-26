/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  The main landing page of the application
 *  Displays a feed of blog posts, a list of currently active users,
 *  and a search bar to filter posts by title or tag
 *  Last mod: 26/05/2025
 * */

import { useState, useEffect, useContext } from "react";
import {
  Row, Col, Form, ListGroup, InputGroup, Card
} from "react-bootstrap"; // UI components
import { Link } from "react-router-dom"; // For client-side navigation
import api from "../services/api"; // API service for HTTP requests
import PostCard from "../components/PostCard"; // Reusable component for displaying post summaries
import { PresenceContext } from "../context/PresenceContext"; // Context for real-time online user IDs

export default function Home() {
  const onlineIds = useContext(PresenceContext); // Get the list of online user IDs from PresenceContext

  const [posts, setPosts] = useState([]); // State for all posts fetched from the server
  const [allUsers, setAllUsers] = useState([]); // State for all users fetched from the server
  const [q, setQ] = useState("");  // State for the search query input

  // Fetch initial posts and list of all users when the component mounts
  useEffect(() => {
    api.get("/posts").then(r => setPosts(r.data)); // Fetch all posts
    api.get("/users/active").then(r => setAllUsers(r.data)); // Fetch all users
  }, []);

  // Filter 'allUsers' to get only those who are currently online, based on 'onlineIds'
  const activeUsers = allUsers.filter(u => onlineIds.includes(u._id));

  // Filter posts based on the search query 'q'
  // Matches against post title or any of the post's tags (case-insensitive)
  const filtered = posts.filter(
    p =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <Row>
      {/* Left Panel: Active Users List */}
      <Col md={3} className="d-none d-md-block">
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h6">Active Users</Card.Title>
            <ListGroup variant="flush">
              {activeUsers.map(u => (
                <ListGroup.Item key={u._id} className="py-1 px-0">
                  <Link to={`/author/${u.username}`} className="text-decoration-none">
                    {u.username}
                  </Link>
                </ListGroup.Item>
              ))}
              {!activeUsers.length && (
                <ListGroup.Item className="text-muted py-1 px-0">
                  (none online)
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>

      {/* Middle Panel: Post Feed */}
      <Col md={6}>
        {filtered.map(p => (
          <PostCard key={p._id} post={p} />
        ))}
        {!filtered.length && <p className="text-muted">No posts found.</p>}
      </Col>

      {/* Right Panel: Search Bar */}
      <Col md={3} className="d-none d-md-block">
        <Card>
          <Card.Body>
            <Card.Title className="h6">Search posts</Card.Title>
            <InputGroup>
              <Form.Control
                placeholder="title or tag…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </InputGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}