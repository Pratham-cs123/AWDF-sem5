# Practical 08 — RESTful API with HATEOAS

- **Course:** ITUE301 — Advanced Web Development Frameworks
- **CO / PO:** CO3, CO4 / PO3, PO5
- **Objective:** Implement Richardson Maturity Model Level 3 (HATEOAS — Hypermedia As The Engine Of Application State) in a Node/Express REST API.

---

## 1. Concept: Richardson Maturity Model

| Level | Name | Description in this Practical |
|---|---|---|
| **Level 0** | The Swamp of POX | Single URI, single HTTP POST method for all remote procedure calls |
| **Level 1** | Resources | Individual resource URIs (e.g., `/tasks/1`, `/tasks/2`) |
| **Level 2** | HTTP Verbs | Standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with HTTP status codes |
| **Level 3** | **HATEOAS** | **Hypermedia controls (`_links`) embedded in responses so clients can discover possible actions dynamically without hardcoded URLs** |

---

## 2. API Endpoints & Hypermedia Flow

```
GET / ──────────────► Root Service Index (_links to /tasks, /filter)
                          │
                          ▼
GET /tasks ─────────► Tasks Collection (each task has _links: self, update, delete, complete)
                          │
                          ▼
PATCH /tasks/:id/complete ──► Resource state changes to completed: true
                              Links dynamically adapt (now shows 'reopen' link instead of 'complete')
```

---

## 3. Running Practical 08

```bash
cd "src/Practical_8"
npm install
npm run dev
# Server running at http://localhost:5002
```
