/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Handles all post-related operations, validates post data using Joi
 *  Ensures that only the creator of a post or an admin can update or delete it
 *  Last mod: 25/05/2025
 * */

import Post from "../models/post.js";
import Joi from "joi";

/* ---------- validation schema ---------- */
// Defines the structure and validation rules for post data.
const postSchema = Joi.object({
  title: Joi.string().required(), // Title is a required string.
  content: Joi.string().required(),  
  tags: Joi.alternatives()
    .try(Joi.array().items(Joi.string()), Joi.string()) // allow "tag1,tag2"
    .optional()
});

/* ---------- GET /api/posts ---------- */
// Retrieves a list of posts, with optional query-based filtering.
export const list = async (req, res) => {
  const q = req.query.q || "";
  const regex = new RegExp(q, "i");

  const filter = q
    ? { $or: [{ title: regex }, { tags: { $regex: regex } }] }
    : {};

  // Find posts matching the filter and populate the 'createdBy' field with the 'username'  
  const posts = await Post.find(filter).populate("createdBy", "username");
  res.json(posts);
};

/* ---------- GET /api/posts/:id ---------- */
// Retrieves a single post by its ID.
export const getOne = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "createdBy",
    "username"
  );
  if (!post) return res.sendStatus(404); // If post not found, send a 404 Not Found status
  res.json(post);
};

/* ---------- POST /api/posts (auth) ---------- */
// Creates a new post. Requires authentication.
export const create = async (req, res) => {
  // Validate the request body against the post schema
  const { error, value } = postSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ ok: false, message: error.details[0].message });

  // Normalize tags: if tags is a string, split it into an array and trim whitespace
  value.tags =
    typeof value.tags === "string"
      ? value.tags.split(",").map(t => t.trim())
      : value.tags;

  // save & immediately populate author username
  let savedPost = await Post.create({ ...value, createdBy: req.user.id });
  savedPost = await savedPost.populate("createdBy", "username");

  // Real-time fan-out: Notify connected clients about the new post
  req.app.locals.fanOutNewPost(savedPost);

  res.status(201).json(savedPost);
};

/* ---------- PUT /api/posts/:id (auth) ---------- */
// Updates an existing post by its ID. Requires authentication
export const update = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.sendStatus(404);

  if (!post.createdBy.equals(req.user.id) && !req.user.isAdmin)
    return res.sendStatus(403);

  // Validate the request body against the post schema
  const { error, value } = postSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ ok: false, message: error.details[0].message });

  value.tags =
    typeof value.tags === "string"
      ? value.tags.split(",").map(t => t.trim())
      : value.tags;

  await Post.findByIdAndUpdate(req.params.id, value);
  res.json({ ok: true });
};

/* ---------- DELETE /api/posts/:id (auth) ---------- */
// Deletes a post by its ID. Requires authentication
export const remove = async (req, res) => {
  // Find the post to be deleted by its ID
  const post = await Post.findById(req.params.id);
  if (!post) return res.sendStatus(404);
  // Authorization check: only the post creator or an admin can delete
  if (!post.createdBy.equals(req.user.id) && !req.user.isAdmin)
    return res.sendStatus(403);

  await post.deleteOne(); // Delete the post
  res.json({ ok: true }); // Send a success response
};
