# Task Manager — Practical 4, 5 & 6

One interconnected full-stack Task Manager application built across three college
practicals. Each practical is a distinguishable stage of the **same** project that
incrementally adds persistence and a frontend.

| Practical | Name | Subtitle | Stack |
|---|---|---|---|
| **P4** | Task Manager — REST API | Express CRUD & Middleware | Express + in-memory array |
| **P5** | Task Manager — MongoDB | Mongoose & Persistent Storage | Express + Mongoose + MongoDB |
| **P6** | Task Manager — Full Stack | React + Express + MongoDB | React + Vite + Express + Mongoose + MongoDB |

---

## Project structure

```
pr 4 5 6/
│
├── shared/                      ← Common backend code imported by all practicals
│   ├── middleware/
│   │   ├── logger.js            ← logs method + URL + timestamp
│   │   └── errorHandler.js      ← structured 400 / 404 / 500 responses
│   ├── models/
│   │   └── Task.js              ← shared Mongoose Task model
│   ├── routes/
│   │   └── taskRoutes.js        ← shared CRUD routes (uses req.TaskModel)
│   ├── package.json             ← all backend deps live here (single copy)
│   └── package-lock.json
│
├── practical4/
│   ├── models/                  ← in-memory task store (no MongoDB)
│   ├── app.js                   ← imports shared middleware + routes
│   └── package.json
│
├── practical5/
│   ├── app.js                   ← connects MongoDB, uses shared Mongoose model
│   └── package.json
│
├── practical6/
│   ├── app.js                   ← Express entry (React + Express + MongoDB)
│   └── package.json
│
└── task-manager-frontend/       ← React + Vite frontend (all 3 views in one app)
    ├── src/
    │   ├── App.jsx              ← main app (practical selector + task manager)
    │   ├── App.css              ← restrained, developer-oriented UI
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Architecture progression

### Practical 4 — REST API (in-memory)

```
Client
  ↓
Express
  ↓
REST Routes
  ↓
In-memory task array
```

Focus: Express, REST, CRUD, and middleware. No database — tasks exist only in memory.

### Practical 5 — MongoDB (persistent)

```
Express
  ↓
REST Routes
  ↓
Mongoose Task Model
  ↓
MongoDB
```

The database-backed evolution of P4. Tasks persist in MongoDB across server restarts.

### Practical 6 — Full Stack

```
React + Vite
  ↓
HTTP / REST API
  ↓
Express
  ↓
Middleware
  ↓
REST Routes
  ↓
Mongoose
  ↓
MongoDB
```

The polished, integrated application. MongoDB is the **source of truth** —
no in-memory array, no localStorage, no fake/mock data.

---

## Getting started

> Prerequisites: **Node.js** and a running **MongoDB** instance on
> `127.0.0.1:27017` (needed for Practical 5 and 6).

### 1. Install dependencies

Backend dependencies live in one place (`shared/`). The frontend has its own.

```bash
# in: pr 4 5 6/
cd shared && npm install          # express, cors, mongoose
cd ../task-manager-frontend && npm install   # react, vite
```

(`practical4/5/6` have no bundled dependencies — they import from `shared/`.)

### 2. Run a backend (choose ONE — all use port 5000)

**Practical 4** (in-memory, no MongoDB needed):

```bash
cd practical4
node app.js
# MongoDB not used
# Server running at http://localhost:5000
```

**Practical 5** (MongoDB):

```bash
cd practical5
node app.js
# MongoDB connected successfully
# Server running at http://localhost:5000
```

**Practical 6** (Full Stack — backend):

```bash
cd practical6
node app.js
# MongoDB connected successfully
# Server running at http://localhost:5000
```

### 3. Run the frontend (for Practical 6)

```bash
# in a second terminal
cd task-manager-frontend
npm run dev
# → http://localhost:5173
```

The frontend is a single React app with a **Practical selector**
(`P4 REST API`, `P5 MongoDB`, `P6 Full Stack`) that lets you view the
architecture, endpoints, and database info for each stage while sharing the
same task-manager implementation and the currently-running backend.

> Start **one backend at a time** — they all listen on port 5000.

---

## API endpoints

All three backends expose identical routes (same shared router):

| Method | Endpoint | Success | Errors |
|---|---|---|---|
| `GET` | `/tasks` | `200` — array of tasks | `500` |
| `POST` | `/tasks` | `201` — `{ message, task }` | `400` validation |
| `PUT` | `/tasks/:id` | `200` — `{ message, task }` | `400` invalid ID, `404` not found |
| `DELETE` | `/tasks/:id` | `200` — `{ message }` | `400` invalid ID, `404` not found |

**Example requests**

```bash
# Create
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn MongoDB","description":"Study Mongoose CRUD","completed":false}'

# Update
curl -X PUT http://localhost:5000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated","completed":true}'

# Delete
curl -X DELETE http://localhost:5000/tasks/<id>
```

**Structured error responses**

```json
{ "message": "Validation failed", "errors": { "title": "Path `title` is required." } }
{ "message": "Invalid task ID" }
{ "message": "Task not found" }
{ "message": "Route not found" }
{ "message": "Internal Server Error" }
```

---

## Task model (shared/models/Task.js)

```js
title:       String, required (trimmed, rejects blank)
description: String, optional
completed:   Boolean, default false
createdAt:   Date,   default Date.now
_id:         generated by Mongoose (ObjectId)
```

The **Practical 4** variant uses a small in-memory model that mimics this shape
(including a 24-char ID and title validation) so the shared routes work unchanged.

---

## Frontend features (Practical 6)

- Create / edit / delete tasks
- Optimistic UI on add (temporary task → replaced by the real MongoDB task; removed on failure)
- Completion toggle persisted through `PUT /tasks/:id`
- "Completed" / "Pending" status labels
- Human-readable created date (e.g. `Created Aug 31, 2026 · 2:14 PM`)
- Contextual loading states: Loading tasks… / Adding… / Saving… / Deleting…
- Success toasts: `✓ Task created successfully` etc.
- Friendly error states with a **Try again** button
- Connection status indicator (`API ● Connected`)
- The `Add Task` and `Save` actions are disabled until a non-blank title is entered
- Responsive layout (desktop, laptop, tablet, mobile)

---

## MongoDB configuration

- Connection string: `mongodb://127.0.0.1:27017/taskdb`
- Database: `taskdb`
- Collection: `tasks`
- Model: `Task`

No cloud / Atlas credentials are required — a local MongoDB instance is used.

---
