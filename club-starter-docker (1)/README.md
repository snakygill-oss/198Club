Club-starter (Docker-ready)

This project contains:
- backend/ (Node + Express)
- frontend/ (Next.js)
- docker-compose.yml (mongo + backend + frontend)

Quick start (requires Docker & docker-compose):
1. Copy backend/.env.example to backend/.env and set any secrets you want (JWT_SECRET, STRIPE_SECRET).
   The docker-compose file uses backend/.env.example by default, but you can replace it with a real .env file.
2. From project root run:
   docker-compose build
   docker-compose up

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

Notes:
- The included WebRTC demo will need TURN servers for many NAT scenarios — not included here.
- For production, add proper environment variables, volumes for logs, and secure secrets management.
