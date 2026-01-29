# Farmer Shop Setup Script
# Run this script to set up the project quickly

#!/bin/bash

echo "🌾 Setting up Farmer Shop E-Commerce Application"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version $(node -v) detected"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if npm install; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
cd ..
if npm install; then
    echo "✅ Root dependencies installed successfully"
else
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Create environment file
echo "🔧 Setting up environment configuration..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
    echo "⚠️  Please edit backend/.env with your actual configuration values"
else
    echo "ℹ️  .env file already exists"
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in backend/.env"
echo "2. Set up MongoDB Atlas account and update MONGODB_URI"
echo "3. Configure payment gateways (Razorpay/Stripe) if needed"
echo "4. Set up Cloudinary account for image uploads"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed setup instructions, see README.md"