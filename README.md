# Secure Task Manager API

This is a backend **REST API** built with **Node.js, Express, MongoDB, and JWT authentication**.
I built this project to practice and demonstrate how a real-world backend is structured — from authentication to database design and secure data access.

The main goal of this project is to **showcase practical backend skills** that are commonly expected in junior to mid-level software developer roles.

## Features

### Authentication & Authorization

- User registration and login
- Passwords hashed using **bcrypt** (no plain-text storage)
- Stateless authentication using **JWT**
- Protected routes via custom authentication middleware

### Task Management (CRUD)

- Create tasks (only for logged-in users)
- Fetch tasks that belong only to the logged-in user
- Update tasks with ownership checks
- Delete tasks with ownership checks

### Querying & Data Handling

- **Pagination** using `page` and `limit`
- **Filtering** by task `status` and `priority`
- **Sorting** results by fields such as `createdAt`

### Stability & Safety

- Consistent error handling using `try/catch`
- Basic request validation for required fields
- Environment variables used for secrets and configuration

---

## Tech Stack

- **Node.js** – runtime environment
- **Express.js** – backend framework
- **MongoDB Atlas** – cloud-hosted NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – authentication & authorization
- **bcrypt** – password hashing
- **dotenv** – environment variable management
- **Postman** – API testing

## Project Structure

backend/
├── src/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ └── taskController.js
│ ├── middleware/
│ │ └── authMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ └── Task.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ └── taskRoutes.js
│ └── app.js
├── package.json
└── .env (ignored)

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/avindipremaratne/secure-task-manager.git
cd secure-task-manager/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the server

```bash
npm run dev
```

The API will be available at:

```
http://localhost:5000
```

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a new user   |
| POST   | `/api/auth/login`    | Login and receive JWT |

### Tasks (Protected)

| Method | Endpoint         | Description                             |
| ------ | ---------------- | --------------------------------------- |
| GET    | `/api/tasks`     | Get user tasks (pagination & filtering) |
| POST   | `/api/tasks`     | Create a new task                       |
| PUT    | `/api/tasks/:id` | Update an existing task                 |
| DELETE | `/api/tasks/:id` | Delete a task                           |

---

## Query Parameters (GET /api/tasks)

Example request:

```
GET /api/tasks?page=1&limit=5&status=pending&priority=high&sort=createdAt&order=desc
```

Supported query parameters:

- `page` – page number
- `limit` – number of tasks per page
- `status` – pending | completed
- `priority` – low | medium | high
- `sort` – field to sort by (e.g. `createdAt`)
- `order` – asc | desc

---

## Testing

All endpoints were manually tested using **Postman**, including:

- Authentication success and failure cases
- Authorization checks (invalid or missing tokens)
- Task CRUD operations
- Pagination, filtering, and sorting scenarios

---

## Design Notes

- JWT authentication keeps the API stateless and scalable
- All task queries are scoped to the logged-in user to prevent data leaks
- MongoDB queries are built dynamically to keep the API flexible
- Secrets and credentials are never committed to version control

---

## Future Improvements

- Add response metadata (total tasks, total pages)
- Add automated tests using Jest and Supertest
- Introduce role-based access control
- Build a frontend client (React)

---

## Author

**Avindi Premaratne**
Aspiring Software Developer | Backend & Full-Stack

---

## Notes

This project intentionally focuses on **backend logic and API design** rather than UI.
It is designed to be consumed by any frontend application (web or mobile).
