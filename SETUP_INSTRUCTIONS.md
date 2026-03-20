# School Event Notification Web Application - Setup Instructions

## Overview
This is a simple School Event Notification System built with:
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Vanilla TypeScript + HTML + CSS
- **Database**: MySQL (via WAMP phpMyAdmin)

## Prerequisites

### Required Software
1. **WAMP Server** (or XAMPP) - [Download here](https://www.wampserver.com/)
2. **Node.js** - [Download here](https://nodejs.org/)
3. **VS Code** - [Download here](https://code.visualstudio.com/)

### Step 1: Start WAMP Server

1. Download and install **WAMP Server** (or XAMPP)
2. Start WAMP from your system tray:
   - Click the WAMP icon in system tray
   - Select "Start All Services"
   - Wait for it to turn green
3. Open browser and go to: `http://localhost/phpmyadmin`

## Step 2: Create Database in phpMyAdmin

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Login (default: username=`root`, password=`empty`)
3. Open the file: `School Event Notification2/database_setup.sql`
4. Copy all the SQL code
5. In phpMyAdmin:
   - Click on "SQL" tab
   - Paste the SQL code
   - Click "Go" to execute

This will create:
- `school_events` database
- `users` table (with 2 sample users)
- `events` table (with 2 sample events)

### Sample Users:
- **Email**: `admin@school.com` | **Password**: `admin123`
- **Email**: `student@school.com` | **Password**: `student123`

## Step 3: Setup Backend (Node.js)

### 3.1 Install Backend Dependencies

Open Terminal/PowerShell in vs Code and navigate to the project:

```powershell
cd "School Event Notification2/backend"
npm install
```

### 3.2 Build and Start Backend

```powershell
npm run dev
```

You should see:
```
Server is running on http://localhost:5000
```

**Keep this terminal open!**

## Step 4: Setup Frontend

### 4.1 Install Frontend Dependencies

Open a **NEW** terminal/PowerShell:

```powershell
cd "School Event Notification2/frontend"
npm install http-server
```

### 4.2 Start Frontend Server

```powershell
npx http-server -p 8000
```

You should see:
```
Starting up http-server, serving .
http-server version: 14.1.1
Available on:
  http://127.0.0.1:8000
```

**Keep this terminal open!**

## Step 5: Access the Application

### Open in Browser

1. **Frontend**: Open browser and go to: `http://localhost:8000`
2. You should see the **Login Page**

### Available Pages:
- **Login**: `http://localhost:8000/login.html`
- **Register**: `http://localhost:8000/register.html`
- **Events**: `http://localhost:8000/events.html`
- **Admin**: `http://localhost:8000/admin.html`

## Step 6: Test the Application

### 6.1 Login Test
1. Go to `http://localhost:8000/login.html`
2. Use test credentials:
   - **Email**: `admin@school.com`
   - **Password**: `admin123`
3. Click "Login"
4. You should be redirected to Events page

### 6.2 Create Event (Admin)
1. After login, link to **Admin Panel**
2. Click "Create Event"
3. Fill in:
   - **Event Title**: e.g., "Science Fair"
   - **Description**: e.g., "Annual science fair for all students"
   - **Date & Time**: Select a date
4. Click "Create Event"
5. Go to "Manage Events" tab to see your event

### 6.3 View Events
1. Go to Events page or Guest view
2. See all events displayed in cards

### 6.4 Delete Event
1. Go to Admin Panel → Manage Events
2. Click "Delete" button on any event
3. Confirm deletion

### 6.5 Logout
1. Click "Logout" button
2. Redirected to login page

## API Endpoints

All endpoints are at: `http://localhost:5000/api`

### Authentication Routes
- `POST /auth/login` - Login user
  ```json
  Request: { "email": "admin@school.com", "password": "admin123" }
  Response: { "success": true, "user": { "id": 1, "email": "admin@school.com" } }
  ```

- `POST /auth/register` - Register new user
  ```json
  Request: { "email": "newuser@school.com", "password": "password123" }
  Response: { "success": true, "message": "User registered successfully" }
  ```

### Events Routes
- `GET /events/` - Get all events
- `POST /events/` - Create new event
  ```json
  Request: { "title": "Event", "date": "2026-03-25 10:00:00", "description": "Description" }
  ```

- `DELETE /events/:id` - Delete event

## Troubleshooting

### Problem: "Cannot connect to database"
**Solution**:
1. Check if WAMP is running (should be green in system tray)
2. Ensure MySQL service is running
3. Verify database `school_events` exists in phpMyAdmin

### Problem: Backend won't start
**Solution**:
1. Ensure Node.js is installed: `node --version`
2. Ensure MySQL/WAMP is running
3. Try: `npm install` again then `npm run dev`

### Problem: Frontend page shows blank
**Solution**:
1. Check browser console (F12) for errors
2. Ensure backend is running on port 5000
3. Check Network tab to see if API calls succeed

### Problem: "Port 5000 already in use"
**Solution**:
```powershell
# Kill process using port 5000
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force
```

### Problem: "Port 8000 already in use"
**Solution**:
```powershell
npx http-server -p 8080  # Use different port
```

## Project Structure

```
School Event Notification2/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   ├── database.ts           # MySQL connection
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── eventController.ts
│   │   └── routes/
│   │       ├── authRoutes.ts
│   │       └── eventRoutes.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── events.html
│   ├── admin.html
│   ├── css/
│   │   ├── styles.css
│   │   ├── auth.css
│   │   ├── events.css
│   │   └── admin.css
│   ├── js/
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── events.ts
│   │   ├── admin.ts
│   │   └── api.ts
│   └── package.json
├── database_setup.sql
└── SETUP_INSTRUCTIONS.md
```

## Key Features

### 1. User Authentication
- Simple login/register
- Credentials stored in MySQL
- Session maintained via localStorage

### 2. Event Management
- Create events (title, date, description)
- View all events in cards
- Delete events
- Sort by date

### 3. Admin Panel
- Dedicated admin interface
- Create and manage events
- View all events
- Delete events from management

### 4. Responsive Design
- Works on desktop and mobile
- Clean and simple UI
- Tab navigation in admin panel

## Important Notes

1. **No Password Hashing**: Passwords are stored as plain text for simplicity
2. **No JWT Tokens**: Uses localStorage for session management
3. **No Database Migrations**: Uses simple SQL setup
4. **Simple CORS**: Enabled for all origins
5. **TypeScript on Frontend**: Files are `.ts` but loaded as-is in browser

## Shutting Down

When done, close the terminals:

**Backend Terminal**:
```powershell
Ctrl + C
```

**Frontend Terminal**:
```powershell
Ctrl + C
```

Then stop WAMP from system tray: Right-click WAMP icon → Exit

## Next Steps for Production

1. Add password hashing (bcrypt)
2. Implement JWT tokens
3. Add input validation
4. Add database migrations
5. Set up environment variables
6. Add error logging
7. Implement HTTPS
8. Add unit tests
9. Add email notifications
10. Deploy to cloud server

---

**Happy coding!** 🚀
