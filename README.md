# Mini Compliance Tracker

A full-stack compliance task tracker built with **Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, and React**.

## Features

- **Client Selection**: Toggle between different clients to view their specific tasks.
- **Task Management**: View, add, and update status (Pending → In Progress → Completed) with a single click.
- **Filters & Sorting**: Filter by status or sort by due date and priority.
- **Search**: Real-time searching with **debounced inputs** for performance.
- **Summary Dashboard**: Quick glimpse at Total, Pending, and Overdue tasks.
- **Overdue Highlighting**: Tasks past their due date are clearly marked with red styling and badges.

## Tech Stack

- **Backend**: Express.js, TypeScript, Drizzle ORM, PostgreSQL, Zod.
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Lucide Icons, Date-fns.
- **DevOps**: Docker, Docker Compose, pnpm.

## Getting Started (Docker - Recommended)

1.  Ensure you have **pnpm** and **Docker** installed.
2.  Clone the repository and set up your environment variables in `server/.env`.
3.  Start the entire stack (Postgres, Backend, Frontend):
    ```bash
    docker-compose up --build
    ```
4.  **Initialize the Database**: 
    Because we use a minimal **distroless** image for production, you should run migrations from your host:
    ```bash
    # Run from the project root
    pnpm --filter server run db:migrate
    pnpm --filter server run db:seed
    ```
5.  **Access the App**:
    - **Dashboard**: [http://localhost:8080](http://localhost:8080)

## Security & Production Design

This project follows **cloud-native best practices** for production readiness:

-   **Multi-Stage Docker Builds**: Separates build tools (pnpm, typescript, vite) from the final runtime for a massive reduction in attack surface and image size.
-   **Google Distroless**: The backend runs in a minimal environment with **no shell** and no extra binaries, making it nearly impossible for attackers to execute code inside the container.
-   **Nginx Reverse Proxy**: The frontend is served by Nginx on port 8080, which also handles Gzip compression, immutable asset caching, and proxies API traffic to the backend internal network.
-   **Non-Root Execution**: Both frontend and backend run under unprivileged users (`nginx` and `nonroot`) to prevent privilege escalation.
-   **pnpm Fetch Cache**: Optimized Docker layers use `pnpm fetch` to speed up builds and ensure lockfile-strict dependency management.

## Manual Local Setup (Development)

1.  Set up a PostgreSQL database and create a `.env` in the `server/` directory.
2.  In the root, run `pnpm install`.
3.  Start the dev environment:
    ```bash
    pnpm dev
    ```
    - Frontend: `http://localhost:5173`
    - API: `http://localhost:3000`

## Assumptions & Tradeoffs

-   **Relative API Paths**: The frontend uses `/api/v1` instead of absolute URLs. This allows the same bundle to work across local dev (via Vite proxy) and production (via Nginx proxy) without code changes.
-   **Distroless vs Alpine**: While Alpine is small, Distroless is even more secure for production because it removes the shell and system package managers entirely.
-   **State Management**: Standard React `useState`/`useEffect` was selected for simplicity, as the current data flow is direct and doesn't warrant the overhead of Redux/Zustand.
