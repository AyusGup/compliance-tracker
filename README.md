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

## Getting Started (Local)

1. Ensure you have **pnpm** and **Docker** installed.
2. Clone the repository.
3. Run the following command to start everything:
   ```bash
   pnpm docker:up
   ```
4. Once containers are up, open a new terminal and run migrations/seed:
   ```bash
   # Run migrations
   docker exec -it compliance-api pnpm run db:push
   # Seed data
   docker exec -it compliance-api pnpm run db:seed
   ```
5. Access the app:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:3000`

## Manual Local Setup (Without Docker)

1. Set up a PostgreSQL database and create a `.env` in the `server/` directory with `DATABASE_URL`.
2. In the root, run `pnpm install`.
3. Start the dev environment:
   ```bash
   pnpm dev
   ```

## Assumptions & Tradeoffs

- **Manual Zod vs Drizzle-Zod**: We chose manual Zod schemas to ensure strict separation between database schema and API validation logic (e.g. `createdAt` shouldn't be valid in a `POST` request).
- **SQLite vs Postgres**: PostgreSQL was selected as per the user request for better scalability and robustness.
- **State Management**: Using standard React `useState` and `useEffect` as the application's complexity at this stage doesn't require a heavy store like Redux or Zustand.
