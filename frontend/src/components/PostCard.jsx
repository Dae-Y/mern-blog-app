/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  PostCard.jsx – A reusable UI component to display a summary of a blog post
 *  It's designed to be used in homepage, author's profile
 *  Last mod: 26/05/2025
 * */

import { Card, Badge } from "react-bootstrap"; // Importing UI components from React Bootstrap
import { Link } from "react-router-dom"; // Importing Link for client-side navigation

// Renders a card displaying a post's title, a snippet of its content, author, and tags
export default function PostCard({ post }) {
  if (!post) return null; // safety

  const {
    _id,
    title,
    content,
    tags = [],
    createdBy = {}
  } = post;

  // 'createdBy' comes populated with _id + username from the API
  const authorName = createdBy.username || "Unknown"; // Fallback to "Unknown" if username is not available
  const authorLink = `/author/${authorName}`; // Construct the link to the author's profile page

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title as={Link} to={`/posts/${_id}`} className="h5 text-decoration-none">
          {title}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          by <Link to={authorLink}>{authorName}</Link>
        </Card.Subtitle>

        <Card.Text>
          {content.slice(0, 160)}
          {content.length > 160 && "…"}
        </Card.Text>

        <div>
          {tags.map(t => (
            <Badge key={t} bg="secondary" className="me-1">
              {t}
            </Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}