/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Notification Mongoose Model
 *  Defines the schema for notifications, to inform users about new post events
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";

// Define the Notification schema
const notificationSchema = new mongoose.Schema(
  {
    recipientId: { // MongoDB ObjectId of the user who should receive this notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    postId: { // The post that triggered the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },

    seen: { // Has the user opened (seen) this notification?
      type: Boolean,
      default: false
    }
  },
  { timestamps: true } // Automatically add 'createdAt' and 'updatedAt' timestamp fields
);

export default mongoose.model("Notification", notificationSchema);