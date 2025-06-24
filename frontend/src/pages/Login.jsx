/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Provides a form for users to log in to the application
 *  Redirects to the homepage if the user is already authenticated
 *  Last mod: 26/05/2025
 * */

import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation
import { Form, Button, Card, Alert } from "react-bootstrap"; // UI components
import { AuthContext } from "../context/AuthContext"; // Context for authentication state
import api from "../services/api"; // API service for HTTP requests

export default function Login() {
   const { user, setUser } = useContext(AuthContext); // Access user state and setUser function from AuthContext
   const navigate = useNavigate(); // Hook for navigation
   const [fields, setFields] = useState({ username: "", password: "" }); // State for form input fields
   const [errors, setErrors] = useState("");

  // Redirect to Home if user is already signed-in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Validates the login form fields
  const validate = () => {
    const { username, password } = fields;
    if (!username.trim()) return "Username is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  // Handles changes in form input fields
  const handleChange = e =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  // Handles the form submission for login
  // Validates fields, then makes an API call to the login endpoint
  // Updates AuthContext with user data on success, or sets error message on failure
  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setErrors(err);

    try {
      const { data } = await api.post("/login", fields);
      setUser(data.user);
      navtigate("/"); 
    } catch (ex) {
      setErrors(ex.response?.data?.message || "Login failed");
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 400 }}> {/* Styled card for the login form. */}
      <Card.Body>
        <Card.Title className="mb-4">Login</Card.Title>

        {/* Display errors if any. */}
        {errors && <Alert variant="danger">{errors}</Alert>}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              value={fields.username}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100"> {/* Full-width submit button. */}
            Sign in
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}