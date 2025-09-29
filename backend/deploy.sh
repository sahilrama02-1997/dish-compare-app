#!/bin/bash

# DishCompare Backend Deployment Script
# This script deploys the backend to various cloud platforms

echo "🚀 Starting DishCompare Backend Deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if MongoDB is running (for local development)
if [ "$NODE_ENV" = "development" ]; then
    echo "🔍 Checking MongoDB connection..."
    if ! command -v mongod &> /dev/null; then
        echo "⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas."
        echo "   For local development: brew install mongodb-community"
        echo "   For production: Use MongoDB Atlas (https://cloud.mongodb.com)"
    fi
fi

# Start the server
echo "🌟 Starting DishCompare Backend Server..."
echo "📱 Frontend URL: $FRONTEND_URL"
echo "🔗 API URL: http://localhost:$PORT"
echo "🌍 Environment: $NODE_ENV"

# Start server based on environment
if [ "$NODE_ENV" = "production" ]; then
    echo "🚀 Starting in production mode..."
    npm start
else
    echo "🔧 Starting in development mode..."
    npm run dev
fi
