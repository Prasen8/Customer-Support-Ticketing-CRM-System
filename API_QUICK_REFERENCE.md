# 🚀 Quick API Reference & Testing Guide

## Quick Start Commands

### Start Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
**Server:** http://127.0.0.1:8000

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```
**App:** http://localhost:5173

---

## All API Endpoints with cURL Examples

### 1. Health Check
```bash
curl -X GET "http://127.0.0.1:8000/"
```

### 2. Create Ticket
```bash
curl -X POST "http://127.0.0.1:8000/api/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "subject": "Login issue",
    "description": "Cannot login to my account"
  }'
```

### 3. Get All Tickets
```bash
# All tickets
curl -X GET "http://127.0.0.1:8000/api/tickets"

# Filter by status
curl -X GET "http://127.0.0.1:8000/api/tickets?status=Open"

# Search
curl -X GET "http://127.0.0.1:8000/api/tickets?search=john"

# Combined
curl -X GET "http://127.0.0.1:8000/api/tickets?status=Open&search=john"
```

### 4. Get Single Ticket
```bash
curl -X GET "http://127.0.0.1:8000/api/tickets/TKT-1234"
```

### 5. Update Ticket
```bash
curl -X PUT "http://127.0.0.1:8000/api/tickets/TKT-1234" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress",
    "notes": "Working on solution"
  }'
```

### 6. Delete Ticket
```bash
curl -X DELETE "http://127.0.0.1:8000/api/tickets/TKT-1234"
```

### 7. Get Stats
```bash
curl -X GET "http://127.0.0.1:8000/api/stats"
```

---

## Test Endpoints in Browser

Open these URLs in your browser (GET requests only):

1. **Health Check:**
   - http://127.0.0.1:8000/

2. **All Tickets:**
   - http://127.0.0.1:8000/api/tickets

3. **Filtered Tickets:**
   - http://127.0.0.1:8000/api/tickets?status=Open
   - http://127.0.0.1:8000/api/tickets?search=john

4. **Single Ticket:**
   - http://127.0.0.1:8000/api/tickets/TKT-1234 (replace with real ticket ID)

5. **Statistics:**
   - http://127.0.0.1:8000/api/stats

---

## API Documentation Tools

### Swagger UI (Interactive)
```
http://127.0.0.1:8000/docs
```
- Test all endpoints
- See request/response schemas
- View parameter details

### ReDoc (Alternative)
```
http://127.0.0.1:8000/redoc
```
- Clean documentation view
- Endpoint details and examples

---

## Request/Response Formats

### Create Ticket Request
```json
{
  "customer_name": "string",
  "customer_email": "string (valid email)",
  "subject": "string",
  "description": "string"
}
```

### Update Ticket Request
```json
{
  "status": "string (Open, In Progress, or Closed)",
  "notes": "string or null"
}
```

### Ticket Response
```json
{
  "ticket_id": "TKT-1234",
  "customer_name": "string",
  "customer_email": "string",
  "subject": "string",
  "description": "string",
  "status": "string",
  "notes": "string or null",
  "created_at": "2026-05-19T10:30:45.123456",
  "updated_at": "2026-05-19T10:30:45.123456"
}
```

### Stats Response
```json
{
  "total": 15,
  "open": 7,
  "in_progress": 5,
  "closed": 3
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 404 | Ticket not found |
| 422 | Validation error (invalid data) |
| 500 | Server error |

---

## Common Error Messages

| Error | Cause |
|-------|-------|
| "Ticket not found" | Ticket ID doesn't exist |
| "validation error" | Missing/invalid field |
| "Connection refused" | Backend not running |

---

## Frontend API Calls (JavaScript)

### Using the API client
```javascript
import API from "../services/api";

// Create ticket
const response = await API.post("/api/tickets", {
  customer_name: "John Doe",
  customer_email: "john@example.com",
  subject: "Help needed",
  description: "Description here"
});

// Get tickets
const tickets = await API.get("/api/tickets", {
  params: { status: "Open" }
});

// Get single ticket
const ticket = await API.get(`/api/tickets/${ticketId}`);

// Update ticket
const updated = await API.put(`/api/tickets/${ticketId}`, {
  status: "In Progress",
  notes: "Working on it"
});

// Delete ticket
await API.delete(`/api/tickets/${ticketId}`);

// Get stats
const stats = await API.get("/api/stats");
```

---

## UI Pages & Functionality

### Home Page (/)
- ✅ View all tickets in table
- ✅ Search tickets
- ✅ Filter by status
- ✅ See dashboard stats
- ✅ Click to view ticket details
- ✅ "New Ticket" button

### Create Ticket (/create)
- ✅ Form with validation
- ✅ Submit new ticket
- ✅ Toast notification
- ✅ Redirect to home

### Ticket Detail (/ticket/TKT-XXXX)
- ✅ View full ticket info
- ✅ Update status & notes
- ✅ Delete ticket
- ✅ View timestamps
- ✅ Status badge

---

## Database

**File:** `backend/support_crm.db`

View/manage database using SQLite tools:
```bash
sqlite3 backend/support_crm.db
.tables
SELECT * FROM tickets;
```

---

## Troubleshooting

### Backend not starting?
```bash
# Make sure you're in backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with verbose output
uvicorn main:app --reload --log-level debug
```

### Frontend can't connect to backend?
- Ensure backend is running on http://127.0.0.1:8000
- Check frontend's api.js baseURL is correct
- Verify firewall isn't blocking port 8000

### Database errors?
- Delete `support_crm.db` to reset database
- Run backend again to recreate database

---

## Project Stats

- **Backend Files:** 5 (main.py, models.py, schemas.py, crud.py, database.py)
- **Frontend Pages:** 3 (Home, CreateTicket, TicketDetail)
- **Frontend Components:** 3 (Header, StatusBadge, Toast)
- **API Endpoints:** 7
- **Database Tables:** 1 (tickets)
- **Database Columns:** 9

