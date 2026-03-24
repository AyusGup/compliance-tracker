# 🚀 Setup Guide - Compliance Tracker

Follow these steps to get the project running from scratch.

## 1. Installation
Run the following at the **root** of the project:
```bash
pnpm install
```

## 2. Environment Variables
Create a `.env` file in the `server` directory:
```env
# Your provided Supabase credentials
DATABASE_URL=postgresql://postgres:pass@db.bpsyunehmccnggmsjslv.supabase.co:5432/postgres
PORT=3000
NODE_ENV=development
```

## 3. Database Sync
To create the tables in Supabase based on your TypeScript schema:
```bash
# Run this from the project root
pnpm --filter server run db:push
```

## 4. Running the Application
Start both the server and client concurrently from the root:
```bash
pnpm dev
```
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)
- **Frontend**: [http://localhost:5173](http://localhost:5173)

## 5. Containerized Deployment (Production Ready)
We use a high-performance, secure Docker setup featuring **Multi-stage builds**, **Distroless** images, and **Nginx** reverse proxying.

To start everything:
```bash
docker-compose up --build
```
- **Frontend App**: [http://localhost:8080](http://localhost:8080)
- **Backend API**: Proxied through [http://localhost:8080/api](http://localhost:8080/api)

## 6. Database Migrations & Seeding (Docker)
Since the production container is a secure **distroless** image (no shell), you should run your migrations and seeding from your host machine pointing to the Docker Postgres.

1.  Set `DATABASE_URL` in your local `.env` to: `postgresql://user:password@localhost:5432/compliance_tracker`
2.  Run the following commands from the **root**:
```bash
# Initialize the tables
pnpm --filter server run db:migrate

# Seed initial data
pnpm --filter server run db:seed
```

---
### 🏗️ Architecture & Best Practices
- **Frontend**: Served by **Nginx** on port 8080. Features automatic Gzip compression and long-term caching for static assets.
- **Backend**: Runs on **Node-Postgres** in a minimal, non-root Distroless container.
- **Reverse Proxy**: Nginx handles all routing. Your browser only talks to port 8080; Nginx forwards `/api` requests to the backend internally.
- **Security**: The app follows the principle of least privilege (non-root users) and uses **Helmet.js** for secure HTTP headers.
- **Dependency Cache**: Docker builds leverage `pnpm fetch` for ultra-fast, consistent installations.
