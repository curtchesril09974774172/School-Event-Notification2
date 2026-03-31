# API Specification for EVENT-MANAGEMENT

## Endpoints

### GET /api/events
**Description:** Retrieve all events

**Request:**
- Method: GET
- Headers:
  - Authorization: Bearer <token>

**Response:**
- Status: 200 OK
- Body:
```json
[
  {
    "id": 1,
    "title": "School Assembly",
    "description": "Monthly assembly",
    "date": "2026-04-01",
    "time": "10:00",
    "location": "Auditorium"
  }
]
```

### POST /api/events
**Description:** Create a new event

**Request:**
- Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <token>
- Body:
```json
{
  "title": "string",
  "description": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "location": "string"
}
```

**Response:**
- Status: 201 Created
- Body: Event object

**Error Responses:**
- 400 Bad Request: Invalid data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not admin

### PUT /api/events/:id
**Description:** Update an existing event

**Request:**
- Method: PUT
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer <token>
- Body: Partial event object

**Response:**
- Status: 200 OK
- Body: Updated event object

### DELETE /api/events/:id
**Description:** Delete an event

**Request:**
- Method: DELETE
- Headers:
  - Authorization: Bearer <token>

**Response:**
- Status: 204 No Content

## Data Models

### Event
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "date": "string",
  "time": "string",
  "location": "string"
}
```