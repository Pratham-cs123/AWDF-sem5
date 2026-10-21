# Practical 9: In-Memory Caching and Query Optimization

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO2, CO4 / PO3, PO5
- **Objective:** To implement server-side caching using `node-cache` and measure its impact on API response time.

---

## 1. Architecture & Flow Diagram

```
      Client Request (e.g., GET /tasks)
                    │
                    ▼
          ┌───────────────────┐
          │ Cache Key Lookup  │
          │   ("all_tasks")   │
          └─────────┬─────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    [Cache HIT]           [Cache MISS]
         │                     │
         ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│ Return Cached    │  │ Query MongoDB    │
│ Response (Memory)│  │ Task.find()      │
└────────┬─────────┘  └────────┬─────────┘
         │                     │
         │            ┌────────┴─────────┐
         │            │ Store in Cache   │
         │            │ (TTL = 60s)      │
         │            └────────┬─────────┘
         │                     │
         └──────────┬──────────┘
                    │
                    ▼
     HTTP Response (X-Cache: HIT / MISS)
```

### Cache Invalidation on Mutations (POST, PUT, DELETE):
```
Client (POST / PUT / DELETE)
       │
       ▼
Execute write operation on MongoDB
       │
       ▼
Invalidate Cache Keys:
  • cache.del("all_tasks")
  • cache.del("task_" + id)  [for PUT & DELETE]
       │
       ▼
Return Success (Fresh data guaranteed on next GET)
```

---

## 2. Implementation Summary

1. **Shared Cache Instance (`cache/cache.js`):**
   - Built on `node-cache` with a default TTL of 60 seconds (`stdTTL: 60`) and periodic expired key check every 120 seconds (`checkperiod: 120`).
2. **Hit/Miss Counter (`cache/cacheStats.js`):**
   - Singleton object tracking `hits` and `misses`.
   - Exposed via `GET /debug/cache-stats`.
3. **Mongoose Task Model (`models/Task.js`):**
   - Fields: `title` (required, trimmed), `description`, `completed` (boolean), `createdAt` (timestamp).
4. **Cached Route Handlers (`routes/taskRoutes.js`):**
   - `GET /tasks`: Checks `cache.get("all_tasks")`. On hit, sets `X-Cache: HIT` and increments hits. On miss, fetches from MongoDB, caches result, sets `X-Cache: MISS`, and increments misses.
   - `GET /tasks/:id`: Checks `cache.get("task_" + id)` separately.
   - `POST /tasks`: Creates task, invalidates `cache.del("all_tasks")`.
   - `PUT /tasks/:id`: Updates task, invalidates `cache.del("all_tasks")` and `cache.del("task_" + id)`.
   - `DELETE /tasks/:id`: Deletes task, invalidates `cache.del("all_tasks")` and `cache.del("task_" + id)`.
   - `GET /debug/cache-stats`: Returns `{ hits, misses, total }`.
   - `POST /tasks/debug/cache-clear`: Flushes cache and resets counters for clean testing.

---

## 3. Response Time Comparison Data (Uncached vs. Cached)

Measured across 5 sample requests for `GET /tasks` with 50 tasks in MongoDB:

| Request Sample | Uncached (Direct MongoDB Query) | Cached (`node-cache` In-Memory) | Latency Difference | Status |
|:--------------:|:-------------------------------:|:-------------------------------:|:------------------:|:------:|
| **Sample 1**   | 35.95 ms                        | 19.57 ms                        | -16.38 ms          | HIT    |
| **Sample 2**   | 24.33 ms                        | 14.79 ms                        | -9.54 ms           | HIT    |
| **Sample 3**   | 16.14 ms                        | 14.43 ms                        | -1.71 ms           | HIT    |
| **Sample 4**   | 19.81 ms                        | 15.43 ms                        | -4.38 ms           | HIT    |
| **Sample 5**   | 18.06 ms                        | 14.00 ms                        | -4.06 ms           | HIT    |
|:--------------:|:-------------------------------:|:-------------------------------:|:------------------:|:------:|
| **Average**    | **22.86 ms**                    | **15.64 ms**                    | **~31.6% faster**  | —      |

> **Observation:** In-memory caching bypasses the database wire protocol, query serialization, BSON parsing, and disk I/O, serving data directly from Node.js V8 process heap. In larger production datasets or under concurrent traffic, response time improvements typically exceed 10x to 50x.

---

## 4. Key Questions & Viva Answers

### Q1: Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?
- **Answer:** If the cache is not invalidated on `POST`, `PUT`, or `DELETE`, read requests (`GET /tasks`) continue to receive the stale in-memory snapshot stored during the initial query until the TTL expires.
- **Consequence:** This produces a **stale read anomaly** (data inconsistency). A user who adds or completes a task would refresh the page and still see the outdated task state, violating user expectations and data integrity.

### Q2: What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-off does TTL length represent?
- **Answer:** A reasonable TTL for task management is **30 to 120 seconds** (default here is 60s).
- **Trade-off:**
  - **Shorter TTL (e.g., 5s–15s):** Guarantees high data freshness even if invalidation fails, but increases database load and decreases the cache hit ratio.
  - **Longer TTL (e.g., 10m–1hr):** Maximizes performance and minimizes database workload, but increases memory utilization and extends the duration of stale data if external database updates occur outside the Express app.

### Q3: Why is in-memory caching (`node-cache`) not suitable for a multi-server/multi-instance deployment?
- **Answer:** `node-cache` stores keys strictly inside the **local V8 heap memory of a single Node.js process**.
- In a horizontally scaled production deployment (e.g., PM2 cluster, Kubernetes pods, or multiple AWS EC2 instances behind a load balancer):
  1. Each server instance maintains its own separate, isolated cache.
  2. A write request (`POST /tasks`) routed to Instance A only clears Instance A's cache.
  3. Subsequent read requests routed to Instance B or Instance C will serve outdated, stale cached data.
- **Solution:** A centralized distributed caching store such as **Redis** or **Memcached**, shared across all instances over the network.

---

## 5. How to Run & Test

### Prerequisites
- Node.js (v18+)
- MongoDB running on `127.0.0.1:27017`

### Step 1: Install Dependencies
```bash
cd "src/Practical 09"
npm install
```

### Step 2: Seed Sample Data
```bash
npm run seed
# Populates 50 sample tasks in MongoDB for testing
```

### Step 3: Run the Development Server
```bash
npm run dev
# Server running at http://localhost:5001
```

### Step 4: Run the Benchmark Script
In a second terminal:
```bash
npm run benchmark
# Automatically measures 5 uncached vs 5 cached requests and prints the comparison table
```

### Step 5: Testing with Postman / Thunder Client
1. **Uncached request:** Send `GET http://localhost:5001/tasks?nocache=true`. Inspect the `Time` in ms and verify `X-Cache: BYPASS`.
2. **First cached request (MISS):** Send `GET http://localhost:5001/tasks`. Check headers: `X-Cache: MISS`.
3. **Subsequent request (HIT):** Send `GET http://localhost:5001/tasks` again. Notice lower `Time` and header `X-Cache: HIT`.
4. **Check Stats:** Send `GET http://localhost:5001/debug/cache-stats`.
5. **Test Invalidation:** Send `POST http://localhost:5001/tasks` with `{"title": "New Task"}`. Send `GET /tasks` immediately — verify it produces `X-Cache: MISS`, proving the stale cache was invalidated!
