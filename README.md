# Full-Stack MERN Blog App

This is a full-stack blog management system built for the **COMP3011 Web Application Frameworks** assignment.

It is built with a Node.js and Express backend, a MongoDB database, and a React.js single-page application frontend. This project was upgraded from a previous blog app, server-side rendered Pug application to a client-side rendered React application to implement a real-time notification system using Socket.io.

## Tech Stack

- **Backend**: Node.js, Express, Socket.io, Passport.js, Joi, Bcrypt
- **Frontend**: React.js, Vite, React-Bootstrap, Socket.io-client, Axios
- **Database**: MongoDB with Mongoose

---

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- `.env` file located in the `backend/` directory

### .env Example

```
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_super_secret_key
PORT=3000
```

---

### Installation

```bash
git clone <repo-url>
cd <your-project-directory>
```
Then install dependencies and run servers in two separate terminals:

**Terminal 1: Backend**
```bash
cd backend
npm ci
npm run dev
```

**Terminal 2: Frontend**
```bash
cd frontend
npm ci
npm run dev
```
### Access
Frontend: [http://localhost:5173](http://localhost:5173)
<br>
Backend API: [http://localhost:3000](http://localhost:3000)

---

## Features

### Frontend Architecture

- Single-page application built with React.js and React-Bootstrap  
- Client-side routing using React Router  
- Global state management via React Context API  
- Frontend form validation for user input  

### Real-time System Integration

- Real-time notification system using Socket.io for post subscriptions  
- Real-time display of active users  

### User Management

- User login and signup with validation and redirection  
- Users can subscribe/unsubscribe to authors  

### Post Management

- Create, read, update, and delete blog posts  
- Search posts by title or tags  

### Notification System

- Real-time notifications for new posts from subscribed authors  
- Missed notifications displayed after login  
- Notification bell with badge count for unseen notifications  

---

## Folder Structure

```
.
├── frontend/                  # React single-page application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── context/           # Context API for global state
│   │   ├── pages/             # Page components for different routes
│   │   └── services/          # API and Socket.io service logic
│   ├── App.jsx # Root React component
│   └── main.jsx # Entry point for React app (renders <App />)
│
├── backend/                  # Node.js and Express backend
│   ├── config/               # Database and Passport.js configurations
│   ├── controllers/          # Request handling and app logic
│   ├── middleware/           # Express middleware (e.g., auth checks)
│   ├── models/               # Mongoose schemas for MongoDB
│   ├── routes/               # API route definitions
│   └── sockets/              # Real-time communication with Socket.io
```

---

## Sample Users

These users are pre-seeded in the database:

| Username | Password |
|----------|----------|
| Zac      | wewe33   |
| Tom      | 123456   |
| Sara     | qwe123   |
| admin    | 111111   |
| Holly    | 121212   |
| Eve      | 222222   |

---

## Preview

![home](https://github.com/user-attachments/assets/bb413613-6c82-4e62-b94c-f6c655f53ab8)

**Home Page:** Public view showcasing posts, with no edit or delete options.
<br>
<br>

![login](https://github.com/user-attachments/assets/611bf3b8-f5bc-4107-a0b8-53e7685f8387)

**Login Page:** Standard user authentication.
<br>
<br>

![activeusers](https://github.com/user-attachments/assets/1dfde277-5d9e-4d4f-8b23-4dac69f0b64c)

**Logged In View:** User's name displayed in the navigation, and the active users panel has been updated.
<br>
<br>

![subscription](https://github.com/user-attachments/assets/9eca2215-e0a3-4435-8303-2df76e221bde)

**Subscription Page:** Tom has subscribed to Holly and Eve.
<br>
<br>

![realtime](https://github.com/user-attachments/assets/b8c8c3c0-a751-4b75-a8b1-1625b4e76923)

**Realtime update:** If Holly logs in, the active users panel in Tom's browser tab updates automatically.
<br>
<br>

![holly post 123](https://github.com/user-attachments/assets/4a7857c1-397a-495e-9bbd-49b42f0014b1)

![Tom alert1](https://github.com/user-attachments/assets/899397c3-aa98-4feb-bef5-7490ef40cba4)

![Tom alert2](https://github.com/user-attachments/assets/2837901e-4793-408b-8609-2338638188e7)


**Realtime update:** When a subscribed author publishes a new post, a realtime notification appears in the bell icon.

---

## References

- [Learn React](https://react.dev/learn)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
