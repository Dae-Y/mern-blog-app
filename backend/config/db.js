/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Single helper to connect Mongoose
 *  connectDB()  →  await connectDB() once at startup
 *  Exits process with non-zero code if connection fails.
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB using Mongoose
export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("Mongo URI not found in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err);
    process.exit(1);
  }
}
