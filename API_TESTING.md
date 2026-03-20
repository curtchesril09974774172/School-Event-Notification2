# API Testing Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "student@school.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@school.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Login User
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "student@school.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "student@school.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }
}
```

### Get Profile
```bash
GET /auth/profile
Authorization: Bearer <token>

Response:
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "student@school.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "student",
  "createdAt": "2026-03-05T10:00:00Z",
  "updatedAt": "2026-03-05T10:00:00Z"
}
```

## Event Endpoints

### Get All Events
```bash
GET /events
Content-Type: application/json

Response:
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "School Assembly",
    "description": "Annual school assembly",
    "date": "2026-04-15T14:00:00Z",
    "location": "Main Hall",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@school.com"
    },
    "createdAt": "2026-03-05T10:00:00Z",
    "updatedAt": "2026-03-05T10:00:00Z"
  }
]
```

### Get Event by ID
```bash
GET /events/507f1f77bcf86cd799439012
Content-Type: application/json

Response:
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "School Assembly",
  "description": "Annual school assembly",
  "date": "2026-04-15T14:00:00Z",
  "location": "Main Hall",
  "createdBy": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com"
  },
  "createdAt": "2026-03-05T10:00:00Z",
  "updatedAt": "2026-03-05T10:00:00Z"
}
```

### Create Event (Admin Only)
```bash
POST /events
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "School Assembly",
  "description": "Annual school assembly",
  "date": "2026-04-15T14:00:00Z",
  "location": "Main Hall"
}

Response:
{
  "message": "Event created successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "School Assembly",
    "description": "Annual school assembly",
    "date": "2026-04-15T14:00:00Z",
    "location": "Main Hall",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-03-05T10:00:00Z",
    "updatedAt": "2026-03-05T10:00:00Z"
  }
}
```

### Update Event (Admin Only)
```bash
PUT /events/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Updated School Assembly",
  "description": "Updated description",
  "date": "2026-04-15T15:00:00Z",
  "location": "Updated Location"
}

Response:
{
  "message": "Event updated successfully",
  "event": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Updated School Assembly",
    "description": "Updated description",
    "date": "2026-04-15T15:00:00Z",
    "location": "Updated Location",
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2026-03-05T10:00:00Z",
    "updatedAt": "2026-03-05T10:05:00Z"
  }
}
```

### Delete Event (Admin Only)
```bash
DELETE /events/507f1f77bcf86cd799439012
Authorization: Bearer <admin_token>

Response:
{
  "message": "Event deleted successfully"
}
```

## Push Notification Endpoints

### Subscribe to Push Notifications
```bash
POST /push/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "base64_encoded_key",
      "auth": "base64_encoded_key"
    }
  }
}

Response:
{
  "message": "Successfully subscribed to push notifications",
  "subscription": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/...",
      "keys": {
        "p256dh": "base64_encoded_key",
        "auth": "base64_encoded_key"
      }
    },
    "createdAt": "2026-03-05T10:00:00Z"
  }
}
```

### Unsubscribe from Push Notifications
```bash
POST /push/unsubscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/..."
}

Response:
{
  "message": "Successfully unsubscribed from push notifications"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid credentials" or "No token provided" or "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required" or "Unauthorized to update this event"
}
```

### 404 Not Found
```json
{
  "message": "User not found" or "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error creating event",
  "error": {}
}
```

## Testing with cURL

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@school.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@school.com",
    "password": "password123"
  }'
```

### Get All Events
```bash
curl http://localhost:5000/api/events
```

### Create Event (replace TOKEN with actual token)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "School Assembly",
    "description": "Annual school assembly",
    "date": "2026-04-15T14:00:00Z",
    "location": "Main Hall"
  }'
```

## Testing with Postman

1. Import this collection into Postman
2. Create environment variables:
   - `base_url`: http://localhost:5000/api
   - `token`: [paste JWT token after login]
   - `admin_token`: [paste admin JWT token]
   - `event_id`: [paste event ID after creating]

3. Use pre-request scripts to automatically set token:
   ```javascript
   pm.environment.set("token", pm.response.json().token);
   ```

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Authentication Header Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoic3R1ZGVudEBzY2hvb2wuY29tIiwicm9sZSI6InN0dWRlbnQifQ.xxx
```

The token is obtained after successful login/registration and must be included in all protected endpoints.

---

**Testing Tips:**
1. Always save token after login for subsequent requests
2. Check the `createdAt` timestamp to verify request processing
3. Update requests should show modified `updatedAt` timestamp
4. Test with both student and admin accounts
5. Verify role-based access restrictions
