# Secure Task Manager

A full-stack task management application with JWT authentication, AI-powered task description generation, and Docker containerisation.

🔗 **Live Demo:** https://secure-task-manager.vercel.app  
📦 **Backend API:** https://secure-task-manager-backend-r25x.onrender.com

---

## Features

- **JWT Authentication** — register, login, logout with bcrypt password hashing
- **Task CRUD** — create, read, update, and delete tasks
- **User-scoped data** — each user sees only their own tasks, enforced at the database query level
- **Toggle task status** — flip between pending and completed
- **AI Description Generation** — generate task descriptions using the Anthropic Claude API
- **Priority system** — low, medium, high with colour-coded badges
- **Responsive UI** — clean dashboard with Tailwind CSS
- **Dockerised** — multi-stage Docker build for frontend, containerised backend

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework and build tool |
| Tailwind CSS v4 | Styling |
| React Router | Client-side routing |
| Axios | HTTP client with JWT interceptor |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Stateless authentication |
| bcrypt | Password hashing |
| Anthropic SDK | AI description generation |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerisation |
| Docker Compose | Local multi-container orchestration |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## Project Structure

```
secure-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── taskController.js
│   │   │   └── aiController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── aiRoutes.js
│   │   └── app.js
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Anthropic API key
- Docker Desktop (optional)

### 1. Clone the repository

```bash
git clone https://github.com/avindipremaratne/secure-task-manager.git
cd secure-task-manager
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Running with Docker

Make sure Docker Desktop is running, then from the root folder:

```bash
docker-compose up --build
```

The app will be available at `http://localhost`

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Logout |

### Tasks (Protected)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### AI (Protected)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/generate-description` | Generate task description using Claude AI |

---

## Architecture Highlights

- **Stateless JWT auth** — tokens stored in localStorage, auto-attached via Axios interceptor
- **User-scoped queries** — all task queries filter by `userId` from the JWT payload
- **Ownership enforcement** — update and delete operations verify task belongs to the requesting user
- **Multi-stage Docker build** — frontend uses Node 20 Alpine to build, then copies dist files to Nginx Alpine — final image is ~25MB
- **AI integration** — Anthropic Claude Haiku generates concise, actionable task descriptions from the task title

---

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://secure-task-manager.vercel.app |
| Backend | Render | https://secure-task-manager-backend-r25x.onrender.com |
| Database | MongoDB Atlas | AWS Cloud |

> **Note:** The backend is hosted on Render's free tier which spins down after 15 minutes of inactivity. The first request after inactivity may take 30–60 seconds to respond.

---

## Author

**Avindi Premaratne**  
Software Developer | Full-Stack  
[LinkedIn](https://www.linkedin.com/in/avindi-premaratne/) | [GitHub](https://github.com/avindipremaratne)
