/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  The main navigation bar for the blog application
 *  Displays links for navigation, login/logout, live-updating notification bell with a dropdown menu
 *  Last mod: 26/05/2025
 * */

import {
  Navbar,
  Nav,
  Container,
  Badge,
  Image,
  Dropdown
} from "react-bootstrap"; // Importing UI components from React Bootstrap
import { LinkContainer } from "react-router-bootstrap"; // For integrating React Router with React Bootstrap Nav.Link
import { Bell } from "react-bootstrap-icons"; // Bell icon for notifications
import { Link, useNavigate } from "react-router-dom"; // For client-side navigation
import { useContext } from "react"; // Hook for accessing context

import api from "../services/api"; // API service for making HTTP requests (e.g., logout)
import { useAuth } from "../context/AuthContext"; // Custom hook for authentication state
import { NotificationContext } from "../context/NotificationContext"; // Context for notification data and actions

// Helper function to format a date into a human-readable "time ago" string
// e.g., "5s ago", "10m ago", "3h ago", "2d ago"
function timeAgo(date) {
  const s = (Date.now() - new Date(date)) / 1000;
  if (s < 60) return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// Access user authentication state and setter from AuthContext
function NavigationBar() {
  const { user, setUser } = useAuth(); // Hook that provides authentication state and a setter
  const navigate = useNavigate(); // Hook that enables programmatic navigation
  const { list, unseenCount, markSeen } = useContext(NotificationContext); // Hook that allows access to shared values

  // Handles the user logout process, make an API call to the logout endpoint
  const handleLogout = async () => {
    try {
      await api.post("/logout"); // Attempt to log out via API
    } finally { // Regardless of API call success or failure, clear user state and redirect
      setUser(null); // Set user to null in the authentication context
      navigate("/"); // Redirect to the homepage
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>BlogApp</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {user && (
              <>
                <LinkContainer to="/new">
                  <Nav.Link>New Post</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/subscriptions">
                  <Nav.Link>Subscriptions</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                {/* bell + dropdown */}
                <Dropdown
                  align="end"
                  className="me-3"
                  onToggle={isOpen => isOpen && markSeen()}
                >
                  <Dropdown.Toggle variant="link" id="dropdown-notifications">
                    <Bell size={20} />
                    {!!unseenCount && (
                      <Badge bg="danger" pill className="ms-1">
                        {unseenCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ minWidth: 300 }}>
                    <Dropdown.Header>Notifications</Dropdown.Header>

                    {list.length ? (
                      list.map(n => (
                        <Dropdown.Item
                          key={n.id}
                          as={Link}
                          to={`/posts/${n.postId}`}
                          onClick={() => markOneSeen(n.id)}
                        >
                          <strong>{n.title}</strong>
                          <br />
                          <small className="text-muted">
                            {n.author} • {timeAgo(n.createdAt)}
                          </small>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.ItemText className="text-muted">
                        No notifications
                      </Dropdown.ItemText>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                {/* profile + logout */}
                <LinkContainer
                  to={`/author/${user.username}`}
                  className="d-flex align-items-center me-3"
                >
                  <Nav.Link>
                    {user.avatar && (
                      <Image
                        src={user.avatar}
                        roundedCircle
                        width={30}
                        height={30}
                        className="me-2"
                      />
                    )}
                    {user.username}
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Sign&nbsp;Up</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;