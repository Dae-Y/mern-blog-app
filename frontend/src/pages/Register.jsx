/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Provides a form for new users to create an account
 *  Handles input for username, password, and password confirmation
 *  Navigates to the login page upon successful registration
 *  Last mod: 26/05/2025
 * */

import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap"; // UI components
import api from "../services/api"; // API service for HTTP requests
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation

export default function Register() {
  const nav = useNavigate(); // Hook for navigation
  const [fields, setFields] = useState({
    username: "",
    password: "",
    confirm: ""
  });
  const [errors, setErrors] = useState("");

  // Handles changes in form input fields
  const handleChange = e =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  // Validates the registration form fields
  const validate = () => {
    const { username, password, confirm } = fields;
    if (username.trim().length < 3) return "Username must be at least 3 chars";
    if (password.length < 6) return "Password must be at least 6 chars";
    if (password !== confirm) return "Passwords do not match";
    return "";
  };

  // Handles the form submission for registration
  // Validates fields, then makes an API call to the register endpoint
  // Navigates to login page on success, or sets error message on failure
  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setErrors(err);

    try {
      await api.post("/register", {
        username: fields.username,
        password: fields.password
      });
      nav("/login");
    } catch (ex) {
      setErrors(ex.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: 450 }}> {/* Styled card for the registration form. */}
      <Card.Body>
        <Card.Title className="mb-4">Create Account</Card.Title>

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

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirm"
              value={fields.confirm}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Sign up
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}