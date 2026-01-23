# MERN Mini Blog Platform

A fully functional Mini Blog Platform built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS.

## Features

- **Authentication**: Secure Login and Register with JWT & Bcrypt.
- **Posts**: Create, Read, Update, Delete (CRUD) posts.
- **Interactions**: Like posts and add comments.
- **Dashboard**: View your own posts and manage them.
- **Frontend**: Modern UI with React, Vite, and Tailwind CSS.
- **Backend**: Robust API with Express and MongoDB.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios, React Router DOM, React Hot Toast.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcryptjs.

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or a cloud URI)

## Setup Instructions

### 1. Clone/Open the Project
Navigate to the project directory:
```bash
cd "c:\Users\hp\Desktop\DMS\mini Blog"
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env`:
   Ensure `backend/.env` exists and has the following (or similar):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/miniblog
   JWT_SECRET=supersecretkey12345
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or similar).

## Usage
1. Open the frontend URL in your browser.
2. Register a new account.
3. Login and start writing stories!
