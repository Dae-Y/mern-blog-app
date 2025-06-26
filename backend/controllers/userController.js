/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Retrieves posts by a specific author, handles user subscriptions
 *  Lists a user's subscriptions
 *  Last mod: 25/05/2025
 * */

import User from "../models/user.js";
import Post from "../models/post.js";
import Subscription from "../models/subscription.js";

/* ---------- active users list ---------- */
// Retrieves a list of all active users, showing only their usernames
export const listActive = async (_req, res) => {
  const users = await User.find({}, "username");
  res.json(users);
};

/* ---------- author’s posts ---------- */
// Retrieves all posts created by a specific author
export const postsByAuthor = async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.sendStatus(404);

  const posts = await Post.find({ createdBy: user.id }).populate(
    "createdBy",
    "username"
  );
  res.json({ author: user.username, count: posts.length, posts });
};

/* ---------- subscribe ---------- */
// Allows the authenticated user to subscribe to another user
export const subscribe = async (req, res) => {
  if (req.user.id === req.params.id)
    return res.status(400).json({ message: "Cannot subscribe to yourself" });

  const target = await User.findById(req.params.id);
  if (!target) return res.sendStatus(404);

  // Check if a subscription already exists
  const existing = await Subscription.findOne({
    subscriberId: req.user.id,
    targetUserId: target.id
  });

  if (!existing) {
    await Subscription.create({
      subscriberId: req.user.id,
      targetUserId: target.id
    });
  }

  res.json({ ok: true });
};

/* ---------- unsubscribe ---------- */
// Allows the authenticated user to unsubscribe from another user
export const unsubscribe = async (req, res) => {
  await Subscription.deleteOne({
    subscriberId: req.user.id,
    targetUserId: req.params.id
  });
  res.json({ ok: true });
};

/* ---------- my subscriptions list ---------- */
// Retrieves a list of users the authenticated user is subscribed to
export const mySubscriptions = async (req, res) => {
  // Find all subscriptions where the 'subscriberId' is the authenticated user's ID
  const subs = await Subscription.find(
    { subscriberId: req.user.id },
    "targetUserId"
  )
    .populate("targetUserId", "username")
    .lean(); // Get plain JavaScript objects instead of Mongoose documents

  // Transform the subscription data to a simpler format: { _id, username }
  const list = subs.map(s => ({
    _id: s.targetUserId._id,
    username: s.targetUserId.username
  }));

  res.json(list);
};
