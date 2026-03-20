# School Event Notification System

A beginner-friendly web application for managing school events with a simple login system, event creation, and event viewing capabilities.

## 🎯 Features

✅ User authentication (register & login)
✅ Create, view, and delete events
✅ Admin dashboard for event management
✅ Responsive design (mobile & desktop)
✅ Simple database setup
✅ No framework complexity - pure TypeScript/JavaScript

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: Vanilla HTML + CSS + TypeScript/JavaScript
- **Database**: MySQL (via WAMP/phpMyAdmin)
- **Server**: http-server for frontend, Express.js for backend

## 📋 Project Structure

```
School Event Notification2/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── database.ts        # MySQL connection
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.ts
│   │   │   └── eventController.ts
│   │   └── routes/            # API routes
│   │       ├── authRoutes.ts
│   │       └── eventRoutes.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                  # Compiled JavaScript (generated)
│
├── frontend/                   # Web application
│   ├── login.html             # Login page
│   ├── register.html          # Registration page
│   ├── events.html            # Events listing
│   ├── admin.html             # Admin dashboard
│   ├── css/                   # Stylesheets
│   │   ├── styles.css         # Base styles
│   │   ├── auth.css           # Auth pages styles
│   │   ├── events.css         # Events page styles
│   │   └── admin.css          # Admin styles
│   ├── js/                    # JavaScript files
│   │   ├── api.js             # API utility functions
│   │   ├── login.js           # Login page logic
│   │   ├── register.js        # Register page logic
│   │   ├── events.js          # Events page logic
│   │   └── admin.js           # Admin page logic
│   ├── js/*.ts                # TypeScript source files
│   └── package.json
│
├── database_setup.sql         # Database schema
├── SETUP_INSTRUCTIONS.md      # Detailed setup guide
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites
- WAMP Server or XAMPP
- Node.js (v14+)
- VS Code

### 1️⃣ Setup Database

```powershell
# Open http://localhost/phpmyadmin in browser
# Copy and execute all SQL from database_setup.sql
```

### 2️⃣ Start Backend

```powershell
cd backend
npm install
npm run dev
# Server will run on http://localhost:5000
```

### 3️⃣ Start Frontend

```powershell
cd frontend
npm install
npx http-server -p 8000
# Frontend will run on http://localhost:8000
```

### 4️⃣ Open in Browser

```
http://localhost:8000
```

### 5️⃣ Login with Test Account

- **Email**: `admin@school.com`
- **Password**: `admin123`

## 📖 Usage Guide

### Creating an Event (Admin)
1. Login with admin account
2. Click "Admin Panel"
3. Fill in event details (title, description, date)
4. Click "Create Event"

### Viewing Events
1. Go to Events page
2. See all events in card layout
3. Events sorted by date

### Deleting Events
1. Go to Admin Panel → Manage Events
2. Click "Delete" on any event
3. Confirm deletion

### Registering New User
1. Click "Register here" on login page
2. Enter email and password
3. Account created and can login

## 🔌 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@school.com"
  }
}
```

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@school.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully"
}
```

### Events

**Get All Events**
```http
GET /events/

Response:
[
  {
    "id": 1,
    "title": "School Assembly",
    "date": "2026-03-25 10:00:00",
    "description": "Annual assembly"
  }
]
```

**Create Event**
```http
POST /events/
Content-Type: application/json

{
  "title": "Science Fair",
  "date": "2026-04-01 08:00:00",
  "description": "Annual science fair"
}

Response:
{
  "success": true,
  "event": { ... }
}
```

**Delete Event**
```http
DELETE /events/1

Response:
{
  "success": true,
  "message": "Event deleted successfully"
}
```

## 🔐 Sample Users

The database comes pre-populated with two users:

| Email | Password | Role |
|-------|----------|------|
| admin@school.com | admin123 | Admin |
| student@school.com | student123 | Student |

**Note**: All users have access to create/delete events in this simplified version.

## 📱 Pages

### Login Page
- Simple login form
- Link to registration
- Clear error/success messages

### Registration Page
- Email and password fields
- Link to login page
- Automatic redirect after successful registration

### Events Page
- View all events in card layout
- Responsive grid
- Shows event title, date, and description
- Logout button
- Link to admin panel

### Admin Dashboard
- Create new events
- Manage existing events
- Delete events
- Tab navigation between sections

## 🎨 Design

- **Color Scheme**: Indigo/Blue primary colors
- **Font**: System fonts for fast loading
- **Layout**: Responsive grid-based design
- **Icons**: Text-based (no icon library)
- **CSS**: Vanilla CSS (no Bootstrap or tailwind)

## ⚙️ Configuration

### Backend (.env equivalent)
Open `backend/src/database.ts`:
```typescript
const pool = mysql.createPool({
  host: 'localhost',      // MySQL host
  user: 'root',           // MySQL user
  password: '',           // MySQL password (WAMP default is empty)
  database: 'school_events'
});
```

### Frontend API URL
Open `frontend/js/*.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Database connection error | Ensure WAMP is running and MySQL service is active |
| Backend won't compile | Run `npm install` in backend folder |
| Frontend page blank | Check browser console (F12) for errors |
| Port 5000 already in use | Kill Node.js process: `taskkill /F /IM node.exe` |
| CORS errors | Ensure backend is running on port 5000 |

## 📚 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🚀 Future Enhancements

- [ ] Password hashing with bcrypt
- [ ] JWT token authentication
- [ ] Email notifications
- [ ] Event categories
- [ ] Event attendance tracking
- [ ] Search and filter events
- [ ] User profile page
- [ ] Event analytics dashboard
- [ ] File upload for event images
- [ ] Calendar view

## 📝 Notes

- **Plain Text Passwords**: For learning purposes only. Use bcrypt in production.
- **No JWT Tokens**: Uses localStorage for session. Implement JWT for security.
- **CORS Enabled**: All origins allowed. Restrict in production.
- **TypeScript Frontend**: Files are `.ts` but run as JavaScript in browser.
- **Development Mode**: Not optimized for production.

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to extend this project with:
- Better error handling
- Password validation
- Email verification
- Event notifications
- Database migrations

## ❓ FAQ

**Q: Why plain text passwords?**
A: Simplified for learning. Always hash passwords in production.

**Q: Can I use this in production?**
A: No. Add proper authentication, validation, and security.

**Q: How do I change the database?**
A: Update connection in `backend/src/database.ts`

**Q: Can I host this online?**
A: Yes, deploy backend to Node.js hosting and frontend to static hosting.

---

**Created for educational purposes** 🎓
