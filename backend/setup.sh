#!/bin/bash

# HomeMadeFood Backend Setup Script

echo "🍕 HomeMadeFood Backend Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18+) first."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL CLI not found. Make sure PostgreSQL is installed."
else
    echo "✅ PostgreSQL found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your database credentials!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Update your .env file with database credentials"
echo "2. Create PostgreSQL database: CREATE DATABASE homemadefood_db;"
echo "3. Run database migrations: npm run migration:run"
echo "4. Start development server: npm run start:dev"
echo ""
echo "🚀 API will be available at: http://localhost:3000/api/v1"
echo "📖 Documentation at: http://localhost:3000/api/docs"