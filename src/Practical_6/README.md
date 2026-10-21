# Practical 06 — Full-Stack Task Management Application

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO3, CO4 / PO3, PO5
- **Objective:** Build a complete full-stack web application connecting a React frontend with a Node/Express REST API and MongoDB database.

---

## Architecture Overview
```
┌─────────────────────────────────┐
│     React Frontend (Vite)       │
│     http://localhost:5173       │
└────────────────┬────────────────┘
                 │ HTTP (Fetch/Axios) + CORS
                 ▼
┌─────────────────────────────────┐
│      Express REST API           │
│      http://localhost:5000      │
│  - Logger Middleware            │
│  - Content-Type Checker         │
│  - CRUD Endpoints (/tasks)      │
└────────────────┬────────────────┘
                 │ Mongoose ODM
                 ▼
┌─────────────────────────────────┐
│      MongoDB Database           │
│      mongodb://127.0.0.1:27017  │
└─────────────────────────────────┘
```

## Running Practical 06

### Step 1: Install Dependencies
```bash
cd "src/Practical_6"
npm install
```

### Step 2: Start the Backend Server
```bash
npm start
# Server running at http://localhost:5000
```

### Step 3: API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks` | Retrieve all tasks |
| `GET` | `/tasks/:id` | Retrieve single task |
| `POST` | `/tasks` | Create a new task (`{ "title": "...", "description": "..." }`) |
| `PUT` | `/tasks/:id` | Update task (`{ "completed": true }`) |
| `DELETE` | `/tasks/:id` | Remove task |
