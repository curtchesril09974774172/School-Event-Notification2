#!/bin/bash

# School Event Notification System - Setup Script
# This script installs all necessary dependencies

echo "================================"
echo "Installing Backend Dependencies"
echo "================================"

cd backend

# Install main dependencies
npm install express mongoose jsonwebtoken bcryptjs dotenv cors web-push express-validator

# Install dev dependencies
npm install --save-dev typescript @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors ts-node

echo ""
echo "================================"
echo "Backend setup complete!"
echo "================================"

echo ""
echo "To start the backend, run:"
echo "  cd backend"
echo "  npm run dev"
echo ""
