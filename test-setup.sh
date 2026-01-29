# Farmer Shop Test Script
# Run this script to test the application setup

#!/bin/bash

echo "🧪 Testing Farmer Shop Application"
echo "==================================="

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Frontend directory not found"
    exit 1
fi

# Check if package.json exists in backend
if [ ! -f "backend/package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

# Check if node_modules exists in backend
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Backend node_modules not found. Run setup script first."
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  .env file not found. Make sure to configure environment variables."
else
    echo "✅ Environment file found"
fi

# Check if main files exist
files=("backend/server.js" "frontend/index.html" "frontend/script.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ $file not found"
    fi
done

echo ""
echo "📋 Test Results:"
echo "- Backend structure: ✅"
echo "- Frontend structure: ✅"
echo "- Dependencies: $([ -d 'backend/node_modules' ] && echo '✅' || echo '❌')"
echo "- Environment: $([ -f 'backend/.env' ] && echo '✅' || echo '⚠️  Configure required')"

echo ""
echo "🚀 To start the application:"
echo "1. Configure backend/.env with your settings"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:3000 in your browser"