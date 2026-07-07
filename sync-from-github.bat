@echo off
cd /d "%~dp0"
echo.
echo  Pulling latest code + database from GitHub...
echo.
call npm run sync:pull
if errorlevel 1 pause
exit /b %errorlevel%
