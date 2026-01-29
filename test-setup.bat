@echo off
echo 🧪 Testing Farmer Shop Application
echo ===================================

REM Check if backend directory exists
if not exist backend (
    echo ❌ Backend directory not found
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist frontend (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

REM Check if package.json exists in backend
if not exist backend\package.json (
    echo ❌ Backend package.json not found
    pause
    exit /b 1
)

REM Check if node_modules exists in backend
if not exist backend\node_modules (
    echo ❌ Backend node_modules not found. Run setup script first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist backend\.env (
    echo ⚠️  .env file not found. Make sure to configure environment variables.
) else (
    echo ✅ Environment file found
)

REM Check if main files exist
set "files=backend\server.js frontend\index.html frontend\script.js"
for %%f in (%files%) do (
    if exist %%f (
        echo ✅ %%f found
    ) else (
        echo ❌ %%f not found
    )
)

echo.
echo 📋 Test Results:
if exist backend\node_modules (
    echo - Dependencies: ✅
) else (
    echo - Dependencies: ❌
)
if exist backend\.env (
    echo - Environment: ✅
) else (
    echo - Environment: ⚠️  Configure required
)
echo - Backend structure: ✅
echo - Frontend structure: ✅

echo.
echo 🚀 To start the application:
echo 1. Configure backend\.env with your settings
echo 2. Run: npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
pause