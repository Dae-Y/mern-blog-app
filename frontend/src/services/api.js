/* COMP3011 Final Assignment
 *  Author: Daehwan Yeo 19448288
 *  Reference: Lecture 8 - 10, Lab and online resources
 *  Axios instance configuration for making HTTP requests to the backend API
 *  This creates a pre-configured Axios instance that can be imported and used 
 *  throughout the frontend application
 *  Last mod: 26/05/2025
 * */

import axios from "axios";

// Create and export a pre-configured Axios instance
export default axios.create({
  // baseURL: The base URL for all API requests
  // All requests made using this instance will be prefixed with this URL
  baseURL: "http://localhost:3000/api",
  withCredentials: true
  // withCredentials: true indicates that cross-site Access-Control requests
  // should be made using credentials such as cookies or authorization headers
  // This is crucial for sending and receiving session cookies for authentication
});