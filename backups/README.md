# Database backups

This folder stores local PostgreSQL backups from your PC.

## Create a backup

**Double-click:** `backup-db.bat` in the project root

**Or run:**

```powershell
npm run db:backup    # SQL + .backup files (needs pg_dump)
npm run db:export    # JSON export (readable in GitHub)
```

## Push to GitHub

Use a **private** repository only.

```powershell
git add backups/
git commit -m "Database backup"
git push
```

## Restore later (when going live)

```powershell
# From SQL file
psql -U postgres -d ws_computer_city -f backups/db-backup-YYYY-MM-DD.sql

# From custom backup
pg_restore -U postgres -d ws_computer_city backups/db-backup-YYYY-MM-DD.backup
```

## Notes

- `.sql` and `.json` files are tracked in git for easy recovery.
- Large `.backup` files are gitignored; keep them on your PC.
- Product **images** are URLs in the database — back up image files separately if stored locally.
