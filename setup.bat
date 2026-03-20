@echo off
REM School Event Notification System - Setup Script (Windows)
REM This script installs all necessary dependencies

echo.
echo ================================
echo Installing Backend Dependencies
echo ================================
echo.

cd backend

REM Install main dependencies
echo Installing main packages...
call npm install express mongoose jsonwebtoken bcryptjs dotenv cors web-push express-validator

REM Install dev dependencies
echo.
echo Installing dev packages...
call npm install --save-dev typescript @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors ts-node

echo.
echo ================================
echo Backend setup complete!
echo ================================
echo.
echo To start the backend, run:
echo   cd backend
echo   npm run dev
echo.
pause
