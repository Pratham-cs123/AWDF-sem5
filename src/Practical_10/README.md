# Practical 10: Asynchronous Processing with Event-Driven Architecture

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO4 / PO3, PO5
- **Objective:** To implement asynchronous background processing using Node.js native `EventEmitter` without external dependencies.

---

## 1. Architecture Flow Diagram

```
POST /tasks request
        │
        ▼
Save task to Database
        │
        ├───────────────────────────────────────────────────────┐
        │                                                       │
        ▼                                                       ▼
emit('task-created', taskData)                    Send API Response Immediately (201 Created)
        │                                         Client receives response in ~5ms
        ▼
Event Loop / Non-blocking Queue
        │
        ▼ (executed asynchronously)
Notification Listener (listeners.js)
  - Logs: Task Title, Timestamp, Assigned User
  - Simulates external notification (1.5s delay)
  - Completes without ever blocking the HTTP response!
```

---

## 2. Key Analysis & Viva Questions

### Q1: Why does emitting an event not block the API response, even though both run on the same Node.js process?
- **Answer:** Node.js executes JavaScript on a single-threaded Event Loop. When `taskEvents.emit('task-created', task)` is called after `res.status(201).json(...)`, the HTTP response headers and body are immediately flushed to the socket. Any asynchronous timers (`setTimeout`, Promises, I/O) inside the listener are registered with the Libuv event loop threadpool/timer queue, allowing the main call stack to clear immediately.

### Q2: What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?
- **Answer:** The client would be forced to wait synchronously until the notification service responded (e.g. 1500ms to 3000ms delay). Emitting an event reduces API response latency down to single-digit milliseconds (~5ms), offloading side effects from the critical path.

### Q3: Why is EventEmitter a reasonable choice for this scale of application, but not for a production system handling millions of events per day?
- **Answer:**
  1. `EventEmitter` is **in-memory**: If the Node process crashes or restarts, unhandled events in memory are lost forever (no persistence).
  2. **Single-instance only**: It cannot distribute events across multiple clustered server instances or Kubernetes pods.
  3. **No retry/dead-letter queues**: For mission-critical enterprise systems, external message brokers like RabbitMQ, Apache Kafka, or Redis BullMQ are preferred.

---

## 3. How to Run & Verify

### Step 1: Install Dependencies
```bash
cd "src/Practical_10"
npm install
```

### Step 2: Run the Verification Demo (Instant Timestamp Evidence)
```bash
npm run demo
```
Observe in console: The API response timestamp is logged ~1500ms before the worker completes!

### Step 3: Run the Server
```bash
npm start
# Server running at http://localhost:5003
```

### Step 4: Test with Postman / Thunder Client
1. Send `POST http://localhost:5003/tasks` with:
```json
{
  "title": "Build Docker Container",
  "assignedUser": "Pratham_D25CS123"
}
```
2. Observe terminal output: API response timestamp prints immediately, followed by the notification delivered ~1.5s later.
3. Send `GET http://localhost:5003/debug/event-logs` to inspect timestamp differences.
4. Send `POST http://localhost:5003/tasks/simulate-error` to confirm the error listener prevents server crashes.
