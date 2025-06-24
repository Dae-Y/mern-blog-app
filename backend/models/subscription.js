/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Subscription Mongoose Model
 *  Defines the schema for user subscriptions
 *  Last mod: 25/05/2025
 * */

import mongoose from "mongoose";

// Define the Subscription schema
const subscriptionSchema = new mongoose.Schema({
  
  subscriberId: { // The user who is initiating the subscription (the follower)
    type: mongoose.Schema.Types.ObjectId, // Stores the MongoDB ObjectId of the subscriber
    ref: "User", // Creates a reference to the 'User' model
    required: true
  },
  
  targetUserId: { // The user who is being subscribed to (the one being followed)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default mongoose.model("Subscription", subscriptionSchema);