@echo off
echo ========================================
echo   WS Computer City - Push to GitHub
echo ========================================
echo.
echo Your code is ready to push!
echo.
echo You need a GitHub Personal Access Token to push.
echo.
echo HOW TO GET A TOKEN:
echo 1. Go to: https://github.com/settings/tokens/new
echo 2. Note: "WS-Computer-City"
echo 3. Expiration: 90 days
echo 4. Select: [x] repo (Full control)
echo 5. Click "Generate token"
echo 6. COPY THE TOKEN!
echo.
echo ========================================
echo.
set /p TOKEN="Paste your GitHub token here and press Enter: "
echo.
echo Pushing to GitHub...
echo.

git push -u https://%TOKEN%@github.com/WShuvro/WS-Computer-City.git main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo Your repository is now live at:
    echo https://github.com/WShuvro/WS-Computer-City
    echo.
    echo What you pushed:
    echo - 44 files
    echo - 18,506 lines of code
    echo - Complete e-commerce platform
    echo - Admin panel + Mega menu
    echo - Comprehensive documentation
    echo.
    pause
) else (
    echo.
    echo ========================================
    echo   ERROR: Push failed!
    echo ========================================
    echo.
    echo Common issues:
    echo 1. Invalid token - make sure you copied it correctly
    echo 2. Token doesn't have 'repo' permission
    echo 3. Repository doesn't exist
    echo.
    echo Try again or check PUSH_INSTRUCTIONS.md
    echo.
    pause
)
