# Practical 11: Containerization with Docker and Docker Compose

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO5 / PO3, PO5
- **Objective:** To containerize the full-stack application using Docker and orchestrate multiple services using Docker Compose.

---

## 1. Multi-Container Architecture Diagram

```
docker-compose.yml
├── frontend (React / Vite multi-stage build, Port 5173:5173)
├── backend  (Node 18 Express API, Port 5000:5000)
└── mongodb  (Official mongo:latest image, Port 27017:27017)

Network: app-network (Internal Docker Bridge)
  • frontend ──► backend (http://backend:5000)
  • backend  ──► mongodb (mongodb://mongodb:27017/taskdb)

Volume: mongodb_data ──► /data/db (Persistent database storage across restarts)
```

---

## 2. Key Questions & Viva Answers

### Q1: Why does the backend container need to reference the MongoDB container by its service name (`mongodb`) rather than `localhost`?
- **Answer:** In Docker, each container has its own isolated network namespace and its own loopback interface (`localhost` / `127.0.0.1`). If the backend attempts to connect to `mongodb://localhost:27017`, it is querying its own container where no MongoDB daemon is running. Docker Compose provides an embedded DNS resolver on custom bridge networks (`app-network`) that automatically translates container service names (`mongodb`, `backend`, `frontend`) to their private container IP addresses.

### Q2: What is the difference between `EXPOSE` in a Dockerfile and the `ports` mapping in `docker-compose.yml`?
- **Answer:**
  - `EXPOSE <port>` in a Dockerfile is purely **documentation and metadata**. It tells image consumers which ports the containerized service listens on, but does NOT publish the port to the host machine.
  - `ports: ["5000:5000"]` in `docker-compose.yml` creates an active **host-to-container port forward** (using iptables/NAT), allowing outside clients (such as your browser or Postman on `localhost`) to reach the container.

### Q3: Why is it considered bad practice to copy `node_modules` into a Docker image instead of running `npm install` inside the container?
- **Answer:**
  1. **Binary architecture mismatch:** Native C++ Node addons (e.g. `bcrypt`, `esbuild`) compiled for Windows on the host machine will crash when run inside the Linux container.
  2. **Bloated build context:** Uploading hundreds of megabytes of `node_modules` drastically slows down `docker build`.
  3. **Reproducibility:** Running `npm install` inside the container guarantees packages are installed specifically for the container's Linux environment.

---

## 3. How to Run & Verify

### Step 1: Verify Docker & Compose Installation
```bash
docker --version
docker compose version
```

### Step 2: Build and Run All 3 Containers in One Command
```bash
cd "src/Practical_11"
docker-compose up --build
```

### Step 3: Verify Running Containers
Open a separate terminal and run:
```bash
docker ps
```
You will see 3 running containers:
- `task_frontend` on `0.0.0.0:5173->5173/tcp`
- `task_backend` on `0.0.0.0:5000->5000/tcp`
- `task_mongodb` on `0.0.0.0:27017->27017/tcp`

### Step 4: Access the Full Stack App
- **Frontend App:** Open `http://localhost:5173` in your browser.
- **Backend API:** Open `http://localhost:5000` or test endpoints with Postman.
- **Stop Stack:** Run `docker-compose down`.
