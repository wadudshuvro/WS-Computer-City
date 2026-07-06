@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  WS Computer City - Database Backup
echo ========================================
echo.

call npm run db:backup
if errorlevel 1 (
  echo.
  echo Backup failed. If PostgreSQL is not installed yet:
  echo   1. Install from https://www.postgresql.org/download/windows/
  echo   2. Update DATABASE_URL in .env with your password
  echo   3. Run: npm run db:setup
  echo.
  pause
  exit /b 1
)

echo.
echo Optional: also export readable JSON backup
call npm run db:export
echo.
pause
