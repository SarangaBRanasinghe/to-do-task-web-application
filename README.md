# To-do Task Web Application

A full-stack to-do web application (Next.js frontend + Node/Express backend + MySQL database).

## Contents

- `backend/` — Node/Express backend (API)
- `frontend/` — Next.js frontend
- `docker-compose.yml` — Docker compose to run both services together

---

## Prerequisites

- Node.js (v18+) and npm (for local development)
- Docker & Docker Compose (for containerized runs)

If you only want to run locally without Docker, ensure Node and npm are installed.

---

## Environment variables

- Frontend: `frontend/.env` (example at `frontend/.env.example`)
	- `NEXT_PUBLIC_API_URL` — base URL of the backend API (e.g. `http://localhost:5000`)

- Backend: `backend/.env` (optional)
	- `PORT` — backend port (default: `5000`)
	- `CORS_ORIGIN` — allowed origin for CORS (default: `http://localhost:3000`)

Make sure to copy or create these files when running locally. Example:

```powershell
# frontend
cd frontend
cp .env.example .env

# backend (optional)
cd ../backend
echo "PORT=5000" > .env
echo "CORS_ORIGIN=http://localhost:3000" >> .env
```

---

## Running locally

1) Backend

```powershell
cd backend
npm install
# development with auto-reload (if nodemon is installed globally or as dev dep)
npm run dev
# or run production entrypoint
npm start
```

The backend listens on `http://localhost:5000` by default and exposes API routes under `/api/tasks`.

2) Frontend

```powershell
cd frontend
npm install
npm run dev
```

The Next.js dev server will be available at `http://localhost:3000`.

Notes:
- The frontend reads `NEXT_PUBLIC_API_URL` from the environment to determine the backend base URL.
- Restart the dev server after changing `.env`.

---

## Build & run in production (locally)

1) Frontend (production build)

```powershell
cd frontend
npm ci
npm run build
# start the built Next.js app
npm start
```

2) Backend (production)

```powershell
cd backend
npm ci --only=production
npm start
```

---

## Docker  

This repository includes Dockerfiles for frontend and backend and a `docker-compose.yml` at the repository root.

To build and run both services with Docker Compose:

```powershell
# from repository root
docker-compose up --build

# to run in background
docker-compose up -d --build

# stop and remove containers
docker-compose down
```

Services and default ports:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Persistence:
- The backend stores task data in a Docker volume named `backend_data` (declared in `docker-compose.yml`).

---
 

 

 

 

