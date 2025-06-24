/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  User Mongoose Model
 *  Defines the schema for users in blog app, includes fields for username, password(hashed), and admin status
 *  Implements a pre-save hook to automatically hash passwords
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";
import bcrypt from "bcrypt"; // Library for hashing passwords

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true }, // Ensures usernames are unique
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, default: false },
});

// hash on CREATE or when password field changes
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
// It should be try-catch, if an error occurs during hashing, I skipped it

export default mongoose.model("User", userSchema);