# School Event Notification System - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js installed
- MongoDB running locally or MongoDB Atlas account
- A code editor

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MongoDB URI and a JWT secret
# Example:
# MONGODB_URI=mongodb://localhost:27017/school-events
# JWT_SECRET=mySecretKey123
```

### Step 2: Start Backend (1 minute)

```bash
# From backend directory
npm run dev
```

You'll see: `Server is running on http://localhost:5000`

### Step 3: Frontend Setup (1 minute)

```bash
# Open new terminal, navigate to frontend
cd frontend

# Start a simple server (choose one):

# Option A: Python
python -m http.server 8000

# Option B: Node.js
npm install -g http-server
http-server

# Option C: VS Code Live Server
# Install extension and right-click index.html → Open with Live Server
```

### Step 4: Access the App (1 minute)

1. Open browser to `http://localhost:8000`
2. You'll be redirected to login page
3. Click "Register here" to create account
4. Choose "student" role for testing

### Test the Application

**Register a Student Account:**
- Email: student1@school.com
- Password: test12345
- First Name: John
- Last Name: Doe

**Access Student Features:**
- View upcoming events
- Enable push notifications

**Create Admin Account:**
- Register another account
- Manually change role to 'admin' in MongoDB:
  ```bash
  db.users.updateOne({email: "admin@school.com"}, {$set: {role: "admin"}})
  ```
- Login as admin
- Create events from the admin dashboard
- All subscribed students receive notifications

## Troubleshooting

### Backend won't start?
- Check MongoDB is running: `mongod`
- Verify port 5000 isn't in use
- Check .env file is created properly

### Frontend shows "Cannot GET /"?
- Make sure you're on correct port (8000 or whatever your server uses)
- Check backend is running on port 5000

### Notifications not working?
- Service Workers require HTTPS in production
- For development on localhost, should work fine
- Check browser DevTools for errors

### Login fails?
- Verify backend is running
- Check network tab in DevTools for API errors
- Ensure MongoDB connection is working

## Next Steps

1. **Customize Branding**
   - Update colors in `frontend/css/styles.css`
   - Change app name in HTML files

2. **Add Push Notifications**
   - Generate VAPID keys: `web-push generate-vapid-keys`
   - Add keys to backend `.env`
   - Update public key in `frontend/js/notifications.ts`

3. **Deploy**
   - Backend: Heroku, AWS, or DigitalOcean
   - Frontend: Netlify, Vercel, or GitHub Pages
   - Database: MongoDB Atlas

4. **Add Features**
   - Event categories
   - User profiles
   - Email notifications
   - Event search

## File Descriptions

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Main server entry point |
| `backend/src/models/*` | Database schemas |
| `backend/src/controllers/*` | Business logic |
| `backend/src/routes/*` | API endpoint definitions |
| `frontend/login.html` | Login page |
| `frontend/events.html` | Student events view |
| `frontend/admin.html` | Admin dashboard |
| `frontend/js/api.ts` | API client helper |
| `frontend/sw.js` | Service worker for notifications |

## API Quick Reference

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"student@school.com",
    "password":"test12345",
    "firstName":"John",
    "lastName":"Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@school.com","password":"test12345"}'
```

### Get Events
```bash
curl http://localhost:5000/api/events
```

### Create Event (Admin Only)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"School Assembly",
    "description":"Annual school assembly",
    "date":"2026-04-15T14:00:00",
    "location":"Main Hall"
  }'
```

## Getting Help

Check the main README.md for:
- Detailed feature documentation
- Full API documentation
- Database schema information
- Production deployment guide
- Security best practices

---

**Ready to develop?** Start with the quick setup above, then explore the codebase!
