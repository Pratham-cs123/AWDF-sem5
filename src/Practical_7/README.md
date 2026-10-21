# Practical 07 — User Authentication & Route Protection

Implements User Authentication with JWT (JSON Web Tokens), Password Hashing with `bcrypt`, and protected Task routes using authentication middleware.

## Features
- User registration with password hashing (`bcrypt`)
- User login with JWT token issuance (`jsonwebtoken`)
- Protected `/tasks` routes verified with `authenticate` middleware
- MongoDB user persistence

## API Endpoints

| Method | Endpoint | Header | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | — | Register user (`name`/`username`, `email`, `password`) |
| `POST` | `/auth/login` | — | Login user (`email`, `password`) -> returns JWT token |
| `GET` | `/tasks` | `Authorization: Bearer <token>` | Get all tasks (Protected) |
| `GET` | `/tasks/:id` | `Authorization: Bearer <token>` | Get task by ID (Protected) |
| `POST` | `/tasks` | `Authorization: Bearer <token>` | Create task (Protected) |
| `PUT` | `/tasks/:id` | `Authorization: Bearer <token>` | Update task (Protected) |
| `DELETE` | `/tasks/:id` | `Authorization: Bearer <token>` | Delete task (Protected) |

## Running the Server

```bash
cd "src/Practical 07"
npm install
npm run dev
# Server running at http://localhost:5000
```
