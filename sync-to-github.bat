@echo off
cd /d "%~dp0"
echo.
echo  Pushing latest code + database to GitHub...
echo.
call npm run sync:push
if errorlevel 1 (
  echo.
  echo If commit failed with "nothing to commit", that is OK if nothing changed.
  pause
)
exit /b 0
