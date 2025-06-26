/* COMP3011 Final Assignment
 * Author: Daehwan Yeo 19448288
 * Reference: Lecture 8 - 10, Lab and online resources
 * Manages user notifications, retrieves unread notifications for authenticated user
 * Marks notifications as seen for the authenticated user
 * Last mod: 29/05/2025
 * */

import Notification from "../models/notification.js";

// Retrieves unread notifications for the authenticated user GET /api/notifications 
export const unread = async (req, res) => {
  try {
    // 1. get unseen notifications, newest first, with nested populate for author's username
    const raw = await Notification.find({
      recipientId: req.user.id,
      seen: false
    })
      .sort({ createdAt: -1 })
      .populate({
        path: 'postId',               // Populate the 'postId' field in Notification
        select: 'title createdBy',    // Select 'title' and 'createdBy' from the Post document
        populate: {                   // Nested populate: populate the 'createdBy' field within the Post
          path: 'createdBy',          // This 'createdBy' is the field on the Post model
          select: 'username'          // Select only the 'username' from the User model
        }
      })
      .lean();

    // 2. filter out notifications whose post has been removed and map to desired format
    const list = raw
      .filter(n => n.postId) // keep only those with a valid populated post
      .map(n => ({
        id: n._id,                     // Notification's ID
        postId: n.postId._id,          // Post's ID (safe now due to filter)
        title: n.postId.title,         // Post's title (safe)
        // Access username, checking if createdBy and its username property exist
        author: n.postId.createdBy && n.postId.createdBy.username ? n.postId.createdBy.username : "Unknown",
        createdAt: n.createdAt         // Notification's creation date
      }));

    // 3. (optional) clean up orphans so we never fetch them again
    const orphans = raw.filter(n => !n.postId).map(n => n._id);
    if (orphans.length) {
      try {
        await Notification.deleteMany({ _id: { $in: orphans } });
        console.log(`Cleaned up ${orphans.length} orphan notifications.`);
      } catch (deleteError) {
        console.error("Error cleaning up orphan notifications:", deleteError);
        // Decide if this error should affect the response to the user; likely not.
      }
    }

    res.json(list);

  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// Marks all unread notifications for the authenticated user as seen PATCH /api/notifications/mark-seen
export const markSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, seen: false },
      { $set: { seen: true } }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error("Error marking notifications as seen:", error);
    res.status(500).json({ message: "Failed to mark notifications as seen" });
  }
};

// Mark one notification as seen PATCH /api/notifications/:id/seen
export const markOneSeen = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { seen: true });
    res.json({ ok: true });
  } catch (err) {
    console.error("Mark-one-seen error:", err);
    res.status(500).json({ message: "Failed to mark notification" });
  }
};