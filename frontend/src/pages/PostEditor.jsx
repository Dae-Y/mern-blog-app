/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  A page component for creating new blog posts or editing existing ones
 *  It handles form input for title, content, and tags
 *  In edit mode, it fetches the post data and pre-fills the form
 *  It also performs authorization to ensure only the author or an admin can edit
 *  Last mod: 26/05/2025
 * */

import { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap"; // UI components
import { useNavigate, useParams } from "react-router-dom"; // Hooks for navigation and URL parameters
import api from "../services/api"; // API service for HTTP requests
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication state

export default function PostEditor() {
  const { id } = useParams(); // If 'id' is undefined, it's in "create new post" mode
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { user } = useAuth(); // Get the current authenticated 'user' from AuthContext

  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [error, setError] = useState("");

  // Load post data if in edit mode (i.e., 'id' is present)
  useEffect(() => {
    if (!id) return;

    api
      .get('/posts/${id}')
      .then(res => {
        const p = res.data; // The fetched post data

        // Authorization Guard: Only the post author or an admin can edit
        if (p.createdBy.username !== user.username && !user.isAdmin) {
          navigate("/"); // If not authorized, redirect to home
          return;
        }

        setForm({ // Pre-fill the form with the fetched post data
          title: p.title,
          content: p.content,
          tags: (p.tags || []).join(", ")
        });
      })
      .catch(() => navigate("/")); // If post not found or other error, redirect to homepage
  }, [id, user, navigate]);

  /* ----- Helper Functions ----- */

  // Handles changes in form input fields
  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validates the form fields (title and content)
  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (form.content.trim().length < 1)
      return "Content must be at least 1 characters";
    return "";
  };

  // Handles the form submission for creating or updating a post
  // Validates fields, prepares the payload and makes an API call (POST for create, PUT for update)
  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);

    // Prepare the payload for the API
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
    };

    try {
      if (id) await api.put('/posts/${id}', payload);
      else await api.post("/posts", payload);
      navigate("/"); // On success, back to list
    } catch (ex) {
      setError(ex.response?.data?.message || "Save failed");
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">
          {id ? "Edit Post" : "Create New Post"}
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control
              name="tags"
              value={form.tags}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={form.content}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            {id ? "Update" : "Publish"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}