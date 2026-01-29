@echo off
echo 🌾 Setting up Farmer Shop E-Commerce Application
echo =================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=v." %%i in ('node --version') do set NODE_MAJOR=%%i
if %NODE_MAJOR% lss 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version detected:
node --version

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if npm install (
    echo ✅ Backend dependencies installed successfully
) else (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

REM Install root dependencies
echo 📦 Installing root dependencies...
cd ..
if npm install (
    echo ✅ Root dependencies installed successfully
) else (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Create environment file
echo 🔧 Setting up environment configuration...
cd backend
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please edit backend\.env with your actual configuration values
) else (
    echo ℹ️  .env file already exists
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Configure your environment variables in backend\.env
echo 2. Set up MongoDB Atlas account and update MONGODB_URI
echo 3. Configure payment gateways (Razorpay/Stripe) if needed
echo 4. Set up Cloudinary account for image uploads
echo 5. Run 'npm run dev' to start the development server
echo.
echo For detailed setup instructions, see README.md
echo.
pause