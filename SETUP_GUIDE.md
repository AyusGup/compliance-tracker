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

---
### 🏗️ Notes
- **Migrations**: No manual SQL is required. `db:push` handles synchronization.
- **Backend**: Node.js/Express + Drizzle ORM
- **DB**: Managed Supabase PostgreSQL
