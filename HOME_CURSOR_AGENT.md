# Home PC — Cursor Agent Guide

**Pass this entire document to your Cursor agent on your home PC.**

This project uses **local PostgreSQL** on each machine (office + home). Products are **not** synced by `git pull` alone. Use **`sync:pull`** and **`sync:push`** every time.

---

## Project info

| Item | Value |
|------|--------|
| Project name | WS Computer City |
| GitHub repo | https://github.com/wadudshuvro/WS-Computer-City |
| Branch | `main` |
| Framework | Next.js 15 + Prisma + PostgreSQL |
| Database name | `ws_computer_city` |
| DB user | `postgres` |
| DB password | `1234` |
| DB port | `5432` |
| DB host | `localhost` |
| **Do NOT use** | Supabase |

---

## How sync works

```text
Office PC                          GitHub                           Home PC
─────────                          ──────                           ───────
Add products in CMS
       ↓
PostgreSQL (local)
       ↓
npm run sync:push  ──────────►  code + backups/*.sql  ◄──────────  npm run sync:pull
                                      │                                    ↓
                                      └──────────────────────────►  PostgreSQL (local)
                                                                           ↓
                                                                    Products show on site
```

- **Code** syncs via Git.
- **Products (database)** sync via `backups/db-backup-*.sql` in the repo.
- **`git pull` alone does NOT load products** into PostgreSQL.

---

## One-time setup on home PC

Run these steps once when setting up home for the first time.

### 1. Install software

- Node.js 18+
- Git
- PostgreSQL 18 (or 15+) — port **5432**, user **postgres**, password **1234**
- pgAdmin 4 (optional, comes with PostgreSQL)

### 2. Clone the project

```powershell
git clone https://github.com/wadudshuvro/WS-Computer-City.git
cd WS-Computer-City
git checkout main
git pull origin main
npm install
```

### 3. Create `.env` file

Copy from `.env.example` or create manually. **Never commit `.env` to GitHub.**

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/ws_computer_city?schema=public"

NEXTAUTH_SECRET="zAG0/GMKZUD9hYe34voeryF0J3RbqawJps9o+AF49BQ="
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="WS Computer City"
```

> If the password has special characters (`$`, `#`, `!`, `@`), URL-encode them in `DATABASE_URL`.

### 4. Create database in PostgreSQL

**pgAdmin:** Right-click **Databases** → **Create → Database** → name: `ws_computer_city`

**Or SQL Shell (psql):**

```sql
CREATE DATABASE ws_computer_city;
```

### 5. Connect pgAdmin

- Server: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `1234`

### 6. First sync (get office products)

```powershell
npm run sync:pull
```

This pulls latest code **and** restores the latest database backup from `backups/`.

### 7. Start the site

```powershell
npm run dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Admin email: `admin@wscomputercity.com`
- Admin password: `admin123`

---

## Daily workflow (home PC)

### When you START work (evening at home)

```powershell
cd C:\Users\Shuvro\WS-Computer-City
npm run sync:pull
npm run dev
```

**Or double-click:** `sync-from-github.bat`

### When you FINISH work (before sleep)

```powershell
npm run sync:push
```

**Or double-click:** `sync-to-github.bat`

> Always `sync:push` before you stop working so office PC gets your new products tomorrow.

---

## Daily workflow (office PC — same rules)

| When | Command |
|------|---------|
| Start work | `npm run sync:pull` then `npm run dev` |
| End work | `npm run sync:push` |

---

## NPM commands reference

| Command | What it does |
|---------|----------------|
| `npm run sync:pull` | Pull code from GitHub + restore latest database backup |
| `npm run sync:push` | Backup database + export JSON + commit + push to GitHub |
| `npm run dev` | Start development server |
| `npm run db:setup` | First-time only: create tables + seed sample data |
| `npm run db:backup` | Create SQL backup in `backups/` |
| `npm run db:export` | Create JSON backup in `backups/` |
| `npm run db:restore` | Restore latest `backups/db-backup-*.sql` |
| `npm run db:studio` | Open Prisma Studio to view database |

---

## Copy-paste prompts for Cursor agent

### First-time home setup

```
Read HOME_CURSOR_AGENT.md in this project and complete one-time home PC setup:
1. Pull latest main from GitHub
2. Ensure .env has DATABASE_URL for local PostgreSQL ws_computer_city (postgres/1234/5432)
3. npm install
4. Create database ws_computer_city if missing
5. npm run sync:pull
6. npm run dev
Do not use Supabase. Products must come from backups/ via sync:pull.
```

### Start work (every day)

```
Run npm run sync:pull to get latest code and products from GitHub, then npm run dev.
```

### End work (every day)

```
Run npm run sync:push to backup database and push code + products to GitHub.
```

### Products missing after pull

```
Products are missing on the site. Run npm run sync:pull (not git pull alone) to restore the latest database from backups/. Then restart npm run dev.
```

### Database connection error

```
Check PostgreSQL is running, .env DATABASE_URL is correct (postgres:1234@localhost:5432/ws_computer_city), and database ws_computer_city exists. Test with npm run db:studio.
```

---

## Important rules for the agent

1. **Never use Supabase** — local PostgreSQL only during development.
2. **Never commit `.env`** — it contains the database password.
3. **Always use `sync:pull` / `sync:push`** — not plain `git pull` / `git push` when products need to sync.
4. **GitHub repo must be private** — backups contain admin user data.
5. **Same database name on both PCs:** `ws_computer_city`.
6. **Restart `npm run dev`** after `sync:pull` if the server was already running.
7. **Product images** are stored as URLs in the database — image files are not in the backup unless hosted online.

---

## Troubleshooting

### pgAdmin asks for password / connection failed

Enter password: `1234`. Check **Save Password**.

### "Can't reach database server"

- Open **Services** → start `postgresql-x64-18` (or your version).
- Confirm port `5432` in `.env`.

### Products not showing after git pull

You used `git pull` without restoring the database. Run:

```powershell
npm run sync:pull
```

### sync:push says "nothing to commit"

That can happen if only the database changed and backup file already exists for today. Run:

```powershell
npm run db:backup
npm run db:export
git add backups/
git commit -m "Database backup"
git push origin main
```

### Forgot PostgreSQL password

Reset in pgAdmin: **Login/Group Roles** → **postgres** → **Definition** → set new password → update `.env`.

---

## File locations

```text
WS-Computer-City/
├── .env                          ← local only, never push
├── sync-from-github.bat          ← double-click to pull + restore
├── sync-to-github.bat            ← double-click to backup + push
├── backups/
│   ├── db-backup-YYYY-MM-DD.sql  ← full database (synced via GitHub)
│   └── export-YYYY-MM-DD.json    ← readable backup
└── HOME_CURSOR_AGENT.md          ← this file
```

---

## Quick cheat sheet

```text
┌──────────────────────────────────────────────────┐
│  START WORK  →  npm run sync:pull  →  npm run dev │
│  ADD/EDIT    →  use CMS at /admin                 │
│  END WORK    →  npm run sync:push                 │
└──────────────────────────────────────────────────┘
```

**Same commands on office PC and home PC. Always in this order.**

---

## Agent checklist before saying "setup complete"

- [ ] PostgreSQL service is running
- [ ] Database `ws_computer_city` exists
- [ ] `.env` has correct `DATABASE_URL`
- [ ] `npm run sync:pull` completed without errors
- [ ] `npm run dev` runs at http://localhost:3000
- [ ] Products visible on site match latest GitHub backup
- [ ] User knows to run `npm run sync:push` before stopping work

---

*Last updated: July 2026 — WS Computer City office/home sync workflow*
