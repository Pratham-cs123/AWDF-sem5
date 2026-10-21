# Complete Lab Execution Guide: Practicals 7 to 13

**Course:** ITUE301 — Advanced Web Development Frameworks  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  
**Student:** Pratham (`d25cs123@charusat.edu.in`) | Repository: `Pratham-cs123/awdf-sem5`

---

## 📌 Master Port & Service Allocation Table

To prevent port conflicts when testing, each practical is assigned a dedicated port:

| Practical | Module Description | Default Port | Database / Dependency | Start Command |
|---|---|---|---|---|
| **Practical 07** | JWT Authentication & Route Protection | `5000` | MongoDB (`taskdb_auth`) | `cd Practical_7 && npm run dev` |
| **Practical 08** | RESTful API with HATEOAS Hypermedia | `5002` | In-Memory Dataset | `cd Practical_8 && npm run dev` |
| **Practical 09** | In-Memory Caching with `node-cache` | `5001` | MongoDB (`taskdb_cache`) | `cd Practical_9 && npm run dev` |
| **Practical 10** | Event-Driven Async with `EventEmitter` | `5003` | In-Memory & Event Loop | `cd Practical_10 && npm start` |
| **Practical 11** | Containerization (Docker Compose) | `5000` (API), `5173` (UI), `27017` (DB) | Dockerized MongoDB | `cd Practical_11 && docker-compose up --build` |
| **Practical 12** | CI/CD Pipeline (GitHub Actions & Jest) | `5004` | Jest & Supertest | `cd Practical_12 && npm test` |
| **Practical 13** | AI API Integration & Graceful Degradation | `5005` | OpenAI / Gemini / Heuristic | `cd Practical_13 && npm start` |
| **Interactive UI** | "How It Works" Master Dashboard | `5173` | React 18 SPA | `npm run dev` (in workspace root) |

---

## 🚀 Practical 07: User Authentication & Route Protection

### 1. Objective & Flow
Implement user registration, password hashing (`bcrypt`), JWT token generation upon login, and protected route access verified via an `authenticate` bearer token middleware.

### 2. How to Run
```bash
cd "src/Practical_7"
npm install
npm run dev
# Server running at http://localhost:5000
```

### 3. Postman API Testing Sequence

#### Request 1: Register New User
- **Method:** `POST`
- **URL:** `http://localhost:5000/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "Pratham Patel",
    "email": "pratham@charusat.edu.in",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "userId": "671680..."
  }
  ```

#### Request 2: Login User & Receive JWT Token
- **Method:** `POST`
- **URL:** `http://localhost:5000/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "email": "pratham@charusat.edu.in",
    "password": "SecurePassword123!"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
  *(Copy the `token` string for subsequent protected requests)*

#### Request 3: Access Protected Tasks without Token (Verification of 401)
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Expected Response (401 Unauthorized):**
  ```json
  {
    "error": "Access denied. No authentication token provided."
  }
  ```

#### Request 4: Access Protected Tasks WITH Token
- **Method:** `GET`
- **URL:** `http://localhost:5000/tasks`
- **Headers:**
  - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Expected Response (200 OK):** Returns array of user-accessible tasks.

---

## 🚀 Practical 08: RESTful API with HATEOAS

### 1. Objective & Flow
Implement Richardson Maturity Model Level 3. API representations embed a `_links` object allowing clients to discover next valid actions (self, update, delete, complete/reopen) dynamically.

### 2. How to Run
```bash
cd "src/Practical_8"
npm install
npm run dev
# Server running at http://localhost:5002
```

### 3. Postman API Testing Sequence

#### Request 1: Service Root (Discover Endpoints)
- **Method:** `GET`
- **URL:** `http://localhost:5002/`
- **Expected Response (200 OK):** Returns API service index with links to `/tasks`, filter queries, and docs.

#### Request 2: Get Tasks Collection with Item Hypermedia
- **Method:** `GET`
- **URL:** `http://localhost:5002/tasks`
- **Expected Response (200 OK):**
  ```json
  {
    "total": 3,
    "tasks": [
      {
        "id": 1,
        "title": "Study Richardson Maturity Model",
        "completed": true,
        "_links": {
          "self": { "href": "http://localhost:5002/tasks/1", "method": "GET" },
          "delete": { "href": "http://localhost:5002/tasks/1", "method": "DELETE" },
          "reopen": { "href": "http://localhost:5002/tasks/1/reopen", "method": "PATCH" },
          "collection": { "href": "http://localhost:5002/tasks", "method": "GET" }
        }
      }
    ]
  }
  ```

#### Request 3: Create Task & Observe `Location` Header
- **Method:** `POST`
- **URL:** `http://localhost:5002/tasks`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Build Hypermedia Frontend",
    "description": "Traverse _links dynamically without hardcoded URLs",
    "category": "Frontend"
  }
  ```
- **Expected Response (201 Created):**
  - Header: `Location: http://localhost:5002/tasks/4`
  - Body contains new task and complete hypermedia control map.

---

## 🚀 Practical 09: In-Memory Caching with `node-cache`

### 1. Objective & Flow
Implement server-side caching to reduce MongoDB query load. Compare uncached database reads with sub-millisecond in-memory cache hits, and verify cache invalidation on write operations.

### 2. How to Run
```bash
cd "src/Practical_9"
npm install
npm run seed       # Seeds 50 sample tasks in MongoDB
npm run dev        # Starts server on http://localhost:5001
```

### 3. Run Automated Benchmark
In a second terminal:
```bash
cd "src/Practical_9"
npm run benchmark
```
*Prints side-by-side latency comparison proving ~30%–80% latency reduction.*

### 4. Postman API Testing Sequence

#### Request 1: First Read (Cache MISS)
- **Method:** `GET`
- **URL:** `http://localhost:5001/tasks`
- **Headers to Inspect in Postman:** `X-Cache: MISS` (Query fetched from MongoDB and saved to cache).

#### Request 2: Second Read (Cache HIT)
- **Method:** `GET`
- **URL:** `http://localhost:5001/tasks`
- **Headers to Inspect in Postman:** `X-Cache: HIT` (Served instantly from Node.js V8 memory heap).

#### Request 3: Check Hit/Miss Counter
- **Method:** `GET`
- **URL:** `http://localhost:5001/debug/cache-stats`
- **Expected Response (200 OK):**
  ```json
  {
    "hits": 1,
    "misses": 1,
    "total": 2
  }
  ```

#### Request 4: Cache Invalidation Proof
- **Method:** `POST`
- **URL:** `http://localhost:5001/tasks`
- **Body:** `{ "title": "Invalidation Trigger Task" }`
- **Verification:** Immediately send `GET /tasks` again — it returns `X-Cache: MISS`, proving the stale cache key was cleared on mutation!

---

## 🚀 Practical 10: Event-Driven Asynchronous Processing

### 1. Objective & Flow
Decouple time-consuming side effects (notifications, audit logging) from the critical HTTP response path using Node.js native `EventEmitter`.

### 2. How to Run
```bash
cd "src/Practical_10"
npm install
npm start
# Server running at http://localhost:5003
```

### 3. Automated Timestamp Proof (Lab Evidence)
Run the verification demo script:
```bash
npm run demo
```
**Console Output Evidence:**
```
[STEP 3] 🚀 API HTTP RESPONSE SENT AT: 2026-10-21T15:50:02.533Z
🔔 [Background Worker] Received 'task-created' event...
✅ [Notification Complete] Finished At: 2026-10-21T15:50:04.047Z
Time Gap (Latency): +1514 ms
RESULT: PASS! API responded 1514ms BEFORE background notification completed.
```

### 4. Postman API Testing Sequence

#### Request 1: Create Task (Fast Response, Slow Worker)
- **Method:** `POST`
- **URL:** `http://localhost:5003/tasks`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Configure Cloudflare CDN Edge Cache",
    "description": "Optimize global asset delivery",
    "assignedUser": "Pratham_D25CS123"
  }
  ```
- **Expected Response (201 Created):** Returns in ~5ms. Watch the terminal: the notification log arrives ~1.5 seconds later!

#### Request 2: Inspect Event Audit Log
- **Method:** `GET`
- **URL:** `http://localhost:5003/debug/event-logs`
- **Expected Response (200 OK):** Displays array of events with comparison of `apiResponseTimestamp` vs `handlerFinishedAt`.

#### Request 3: Safe Error Handling Test
- **Method:** `POST`
- **URL:** `http://localhost:5003/tasks/simulate-error`
- **Verification:** Emits an error event. Check server console: the error is caught safely by `taskEvents.on('error', ...)` without crashing the server!

---

## 🚀 Practical 11: Containerization with Docker & Docker Compose

### 1. Objective & Flow
Containerize frontend, backend, and MongoDB services into isolated containers, configure bridge networking (`app-network`) and named volumes, and start the entire stack with a single command.

### 2. Prerequisites
- Docker Desktop or Docker Engine installed (`docker --version`)

### 3. Single-Command Execution
```bash
cd "src/Practical_11"
docker-compose up --build
```

### 4. Verification Commands (In a separate terminal)
```bash
docker ps
```
**Expected Containers Running:**
1. `task_frontend` — `0.0.0.0:5173->5173/tcp`
2. `task_backend` — `0.0.0.0:5000->5000/tcp`
3. `task_mongodb` — `0.0.0.0:27017->27017/tcp`

### 5. Postman & Browser Verification
- **Frontend UI:** Open `http://localhost:5173` in your browser.
- **Backend API:** Send `GET http://localhost:5000/` — returns container status and `mongodb://mongodb:27017/taskdb` connection confirmation.
- **Create Task:** Send `POST http://localhost:5000/tasks` with `{ "title": "Docker persistence test" }`.
- **Stop Stack:** `docker-compose down`.

---

## 🚀 Practical 12: CI/CD Pipeline with GitHub Actions

### 1. Objective & Flow
Set up an automated Continuous Integration pipeline (`.github/workflows/ci.yml`) that triggers on every `push` and `pull_request` to run automated test suites (`Jest` & `Supertest`).

### 2. How to Run Locally
```bash
cd "src/Practical_12"
npm install
npm test
```
*All 5 unit tests pass (status 200 checks, input validation, 404 handler).*

### 3. Run Simulated GitHub Actions Runner
```bash
npm run simulate-ci
```
*Outputs step-by-step runner log simulating checkout, Node 18 setup, and test pass/fail status.*

### 4. Triggering Pass vs Fail for Lab Assessment
- **Deliberately Failing Test:** In `tests/task.test.js`, change `expect(res.statusCode).toBe(200)` to `expect(res.statusCode).toBe(500)`. Run `npm test`. Output shows **Red X** with assertion failure.
- **Passing Test:** Revert to `toBe(200)` and run `npm test`. Output shows **Green Checkmark (✓)**.

---

## 🚀 Practical 13: AI API Integration & Graceful Degradation

### 1. Objective & Flow
Integrate external AI APIs (OpenAI `gpt-4o-mini` or Google Gemini) securely through a backend proxy. Provide automatic **Graceful Degradation** fallback if the third-party service is offline or API key is unconfigured.

### 2. How to Run
```bash
cd "src/Practical_13"
npm install
# Optional: create .env and add OPENAI_API_KEY=... or GEMINI_API_KEY=...
# If omitted, intelligent graceful degradation fallback activates automatically!
npm start
# Server running at http://localhost:5005
```

### 3. Postman API Testing Sequence

#### Request 1: Generate AI Description
- **Method:** `POST`
- **URL:** `http://localhost:5005/api/ai/generate-description`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "title": "Implement JWT authentication and refresh token rotation"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "title": "Implement JWT authentication and refresh token rotation",
    "description": "Implement secure authentication workflows for \"Implement JWT authentication and refresh token rotation\". Ensure passwords are encrypted with bcrypt, JWT tokens include expiration claims, and route guards enforce authorization middleware.",
    "provider": "Built-in Intelligent Heuristic (Graceful Degradation Fallback)",
    "fallback": true,
    "disclaimer": "Suggested content generated via local heuristic engine. Please review before saving."
  }
  ```

#### Request 2: Suggest Priority & Smart Deadline
- **Method:** `POST`
- **URL:** `http://localhost:5005/api/ai/suggest-priority`
- **Body (raw JSON):**
  ```json
  {
    "title": "Urgent memory leak in production cluster"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "suggestedPriority": "High",
    "suggestedDeadline": "2026-10-22",
    "disclaimer": "AI-assisted estimation. Adjust based on project velocity."
  }
  ```

#### Request 3: Test Rate Limiting
Send the request twice within 3 seconds. The second call returns `429 Too Many Requests`:
```json
{
  "error": "Rate limit exceeded. Please wait 4s before requesting AI generation again.",
  "fallback": true
}
```

---

## 🎯 Consolidated Postman Collection File

All endpoints for Practicals 7 through 13 have been combined into a single, ready-to-import JSON file:
`src/Postman_Collection_Practicals_7_to_13.json`

**How to Import in Postman or Thunder Client:**
1. Open Postman.
2. Click **Import** (Top left).
3. Select `Postman_Collection_Practicals_7_to_13.json`.
4. Run requests in folder order (Practical 07 ➔ Practical 13)!
