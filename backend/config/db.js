/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Single helper to connect Mongoose
 *  connectDB()  →  await connectDB() once at startup
 *  Exits process with non-zero code if connection fails.
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";

// Connect to MongoDB using Mongoose
// In production, move URI to process.env.MONGO_URI (.env file)
export async function connectDB() {
  const uri =
    "mongodb+srv://daeydev:CW0KhXAVefLYjBZS@cluster0.tm5thrs.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err);
    process.exit(1);
  }
}
