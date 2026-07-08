# Database backups

This folder stores local PostgreSQL backups shared via GitHub (private repo).

## Daily workflow

| When | Command |
|------|---------|
| Start work | `npm run sync:pull` then `npm run dev` |
| End work / leave | `npm run sync:push` |

Or tell Cursor: **"Run sync:push"** / **"Run sync:pull and dev"**.

## What gets synced

| File | Purpose | In git? |
|------|---------|---------|
| `db-backup-YYYY-MM-DD.sql` | Full SQL restore (preferred) | Yes |
| `export-YYYY-MM-DD.json` | Readable product export / JSON import fallback | Yes |
| `*.backup` / `*.dump` | Custom pg_dump format | No (gitignored) |

## Restore on another PC

```powershell
npm run sync:pull
```

That pulls code and restores the latest SQL. If only JSON exists:

```powershell
npm run db:import
```

## Manual commands

```powershell
npm run db:backup    # SQL + custom dump
npm run db:export    # JSON
npm run db:restore   # Restore latest SQL (or JSON fallback)
npm run db:import    # Import latest JSON only
```

## Notes

- `.env` is never committed. Use `postgres` / `1234` / `ws_computer_city` locally.
- Never use Supabase for this local sync flow.
- Image URLs in the DB are external — local image files are not in this dump.
