/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Post Mongoose Model
 *  Defines the schema for blog posts, includes title, content, tags, author
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";

// Define the Post schema
const postSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true }, // Title is a mandatory field.
    content:    { type: String, required: true },
    tags:       [String],
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" } 
    // Stores the MongoDB ObjectId of the creator
  },
  { timestamps: true }   // adds createdAt / updatedAt automatically
);

export default mongoose.model("Post", postSchema);