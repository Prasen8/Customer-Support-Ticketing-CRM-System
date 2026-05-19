# Support CRM Project - Complete Working Guide

## 📋 Project Overview

This is a **Support CRM (Customer Relationship Management)** application with a **FastAPI backend** and **React frontend**. It allows users to create, manage, and track customer support tickets.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)              │
│  - Home Page (List all tickets)                         │
│  - Create Ticket Page                                   │
│  - Ticket Detail Page                                   │
└────────────────────┬────────────────────────────────────┘
                     │ (Axios HTTP Requests)
                     │ http://127.0.0.1:8000
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (FastAPI + SQLAlchemy)             │
│  - RESTful API endpoints                                │
│  - Database management (SQLite)                         │
│  - CRUD operations                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  SQLite Database       │
        │  (support_crm.db)      │
        └────────────────────────┘
```

---

## 🗂️ Project Structure

```
Support-crm/
├── backend/
│   ├── main.py           (FastAPI app & all endpoints)
│   ├── models.py         (Database models)
│   ├── schemas.py        (Pydantic validation schemas)
│   ├── crud.py           (Database operations)
│   ├── database.py       (SQLAlchemy config)
│   └── requirements.txt  (Python dependencies)
│
└── frontend/
    ├── src/
    │   ├── App.jsx              (Main router component)
    │   ├── App.css              (Styling)
    │   ├── main.jsx             (Entry point)
    │   ├── index.css            (Global styles)
    │   ├── services/
    │   │   └── api.js           (Axios API client)
    │   ├── pages/
    │   │   ├── Home.jsx         (Ticket list page)
    │   │   ├── CreateTicket.jsx (Create new ticket)
    │   │   └── TicketDetail.jsx (View/edit ticket)
    │   └── components/
    │       ├── Header.jsx       (Navigation header)
    │       ├── StatusBadge.jsx  (Status display)
    │       └── Toast.jsx        (Notifications)
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 📊 Database Schema

### Table: `tickets`

| Column | Type | Description |
|--------|------|-------------|
| `id` | Integer (PK) | Internal database ID |
| `ticket_id` | String (Unique) | Unique ticket identifier (TKT-XXXX format) |
| `customer_name` | String | Name of the customer |
| `customer_email` | String | Email of the customer |
| `subject` | String | Ticket subject line |
| `description` | Text | Full ticket description |
| `status` | String | Current status: Open, In Progress, Closed |
| `notes` | Text | Internal notes about ticket |
| `created_at` | DateTime | Ticket creation timestamp |
| `updated_at` | DateTime | Last update timestamp |

---

## 🔌 API Endpoints

### Base URL: `http://127.0.0.1:8000`

All API endpoints are prefixed with `/api/` except the root endpoint.

---

### 1. **Health Check**
```
GET /
```
**Purpose:** Verify API is running

**Response:**
```json
{
  "message": "Support CRM API Running",
  "version": "1.0.0"
}
```

**Status Code:** `200 OK`

---

### 2. **Create a New Ticket** ⭐
```
POST /api/tickets
```

**Request Body:**
```json
{
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "subject": "Cannot login to account",
  "description": "I'm unable to log in to my account. Getting an error message."
}
```

**Required Fields:**
- `customer_name` (string)
- `customer_email` (valid email)
- `subject` (string)
- `description` (string)

**Response (201 Created):**
```json
{
  "ticket_id": "TKT-4829",
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "subject": "Cannot login to account",
  "description": "I'm unable to log in to my account. Getting an error message.",
  "status": "Open",
  "notes": null,
  "created_at": "2026-05-19T10:30:45.123456",
  "updated_at": "2026-05-19T10:30:45.123456"
}
```

**Used By:** CreateTicket page on form submission

---

### 3. **Get All Tickets** ⭐
```
GET /api/tickets
```

**Query Parameters (optional):**
- `status` - Filter by status (Open, In Progress, Closed)
- `search` - Search keyword (searches: customer_name, customer_email, subject, ticket_id)

**Examples:**
```
GET /api/tickets                                    (all tickets)
GET /api/tickets?status=Open                       (open tickets only)
GET /api/tickets?search=john                       (tickets matching "john")
GET /api/tickets?status=In%20Progress&search=bug  (combined filters)
```

**Response (200 OK):**
```json
[
  {
    "ticket_id": "TKT-4829",
    "customer_name": "John Smith",
    "customer_email": "john@example.com",
    "subject": "Cannot login to account",
    "description": "I'm unable to log in to my account. Getting an error message.",
    "status": "Open",
    "notes": null,
    "created_at": "2026-05-19T10:30:45.123456",
    "updated_at": "2026-05-19T10:30:45.123456"
  },
  {
    "ticket_id": "TKT-5192",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com",
    "subject": "Billing issue",
    "description": "I was charged twice for my subscription.",
    "status": "In Progress",
    "notes": "Investigating duplicate charge",
    "created_at": "2026-05-18T14:22:10.654321",
    "updated_at": "2026-05-19T09:15:30.654321"
  }
]
```

**Sorting:** Results are sorted by `created_at` in descending order (newest first)

**Used By:** Home page to display ticket list

---

### 4. **Get Single Ticket Details** ⭐
```
GET /api/tickets/{ticket_id}
```

**Path Parameter:**
- `ticket_id` - The ticket ID (e.g., TKT-4829)

**Example:**
```
GET /api/tickets/TKT-4829
```

**Response (200 OK):**
```json
{
  "ticket_id": "TKT-4829",
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "subject": "Cannot login to account",
  "description": "I'm unable to log in to my account. Getting an error message.",
  "status": "Open",
  "notes": null,
  "created_at": "2026-05-19T10:30:45.123456",
  "updated_at": "2026-05-19T10:30:45.123456"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Ticket not found"
}
```

**Used By:** Ticket Detail page on load

---

### 5. **Update Ticket Status & Notes** ⭐
```
PUT /api/tickets/{ticket_id}
```

**Path Parameter:**
- `ticket_id` - The ticket ID (e.g., TKT-4829)

**Request Body:**
```json
{
  "status": "In Progress",
  "notes": "Customer confirmed the issue. Working on solution."
}
```

**Fields:**
- `status` (string, required): Open, In Progress, or Closed
- `notes` (string, optional): Internal notes

**Response (200 OK):**
```json
{
  "ticket_id": "TKT-4829",
  "customer_name": "John Smith",
  "customer_email": "john@example.com",
  "subject": "Cannot login to account",
  "description": "I'm unable to log in to my account. Getting an error message.",
  "status": "In Progress",
  "notes": "Customer confirmed the issue. Working on solution.",
  "created_at": "2026-05-19T10:30:45.123456",
  "updated_at": "2026-05-19T10:35:22.789456"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Ticket not found"
}
```

**Used By:** Ticket Detail page when updating status and notes

---

### 6. **Delete a Ticket** ⭐
```
DELETE /api/tickets/{ticket_id}
```

**Path Parameter:**
- `ticket_id` - The ticket ID (e.g., TKT-4829)

**Example:**
```
DELETE /api/tickets/TKT-4829
```

**Response (200 OK):**
```json
{
  "message": "Ticket deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Ticket not found"
}
```

**Used By:** Ticket Detail page's delete confirmation dialog

---

### 7. **Get Dashboard Statistics** ⭐
```
GET /api/stats
```

**Purpose:** Get counts of tickets by status for dashboard statistics

**Response (200 OK):**
```json
{
  "total": 15,
  "open": 7,
  "in_progress": 5,
  "closed": 3
}
```

**Used By:** Home page dashboard stats cards

---

## 🌐 Frontend Pages & Their API Usage

### **Page 1: Home Page** (`/`)
**File:** [frontend/src/pages/Home.jsx](frontend/src/pages/Home.jsx)

**Features:**
- Display all tickets in a searchable, filterable table
- Show dashboard statistics (Total, Open, In Progress, Closed)
- Filter by status
- Search by customer name, email, subject, or ticket ID
- Click ticket row to view details
- "New Ticket" button to create ticket

**API Calls:**
```javascript
// On page load and when filters change:
GET /api/tickets?status={status}&search={search}
GET /api/stats
```

---

### **Page 2: Create Ticket** (`/create`)
**File:** [frontend/src/pages/CreateTicket.jsx](frontend/src/pages/CreateTicket.jsx)

**Features:**
- Form to create new support ticket
- Client-side validation (required fields, email validation)
- Submit ticket to backend
- Redirect to home page on success
- Toast notification on success/error

**API Calls:**
```javascript
POST /api/tickets
{
  "customer_name": "...",
  "customer_email": "...",
  "subject": "...",
  "description": "..."
}
```

---

### **Page 3: Ticket Detail** (`/ticket/:ticket_id`)
**File:** [frontend/src/pages/TicketDetail.jsx](frontend/src/pages/TicketDetail.jsx)

**Features:**
- View full ticket information
- Update ticket status and notes
- Delete ticket (with confirmation dialog)
- Display creation and update timestamps
- Status badge with color coding

**API Calls:**
```javascript
// On page load:
GET /api/tickets/{ticket_id}

// When updating:
PUT /api/tickets/{ticket_id}
{
  "status": "...",
  "notes": "..."
}

// When deleting:
DELETE /api/tickets/{ticket_id}
```

---

## 🚀 How to Run the Project

### **Backend Setup**

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# or source venv/bin/activate  # Mac/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
uvicorn main:app --reload
```

Server runs on: `http://127.0.0.1:8000`

**API Documentation available at:**
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

### **Frontend Setup**

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

Application runs on: `http://localhost:5173`

---

## 📱 UI Components

### **Header Component**
- Navigation header with app logo
- Links to Home and Create pages

### **StatusBadge Component**
- Displays ticket status with color coding
- Open (blue), In Progress (orange), Closed (green)

### **Toast Component**
- Success/error notifications
- Auto-dismiss after 3 seconds
- Used for user feedback on all operations

---

## 🔄 Data Flow Example

### **Creating a New Ticket**

```
User fills form in CreateTicket page
    ↓
User clicks "Submit"
    ↓
Frontend validates form (client-side)
    ↓
POST request to /api/tickets with ticket data
    ↓
Backend receives request in main.py
    ↓
crud.create_ticket() generates unique ticket_id (TKT-XXXX)
    ↓
Ticket saved to SQLite database
    ↓
Response sent back to frontend with ticket_id
    ↓
Toast notification shows success message
    ↓
User redirected to Home page
```

---

## 🛠️ Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.136.1 | Web framework |
| SQLAlchemy | 2.0.49 | ORM for database |
| Pydantic | 2.13.4 | Data validation |
| Uvicorn | 0.47.0 | ASGI server |
| email-validator | 2.3.0 | Email validation |
| python-multipart | 0.0.29 | Form data handling |

---

## 🛠️ Frontend Dependencies

| Package | Purpose |
|---------|---------|
| React | UI library |
| React Router | Page routing |
| Axios | HTTP client |
| Vite | Build tool |

---

## 💾 Database

- **Type:** SQLite
- **File:** `backend/support_crm.db`
- **Location:** Created automatically in backend folder on first run
- **Tables:** `tickets` (single table with ticket data)

---

## 🔒 CORS Configuration

The backend has CORS (Cross-Origin Resource Sharing) enabled:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # Allow all HTTP methods
    allow_headers=["*"],          # Allow all headers
)
```

This allows the frontend to make requests to the backend from a different port.

---

## ✅ Summary of All Working APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check |
| POST | `/api/tickets` | Create new ticket |
| GET | `/api/tickets` | Get all tickets (with filters) |
| GET | `/api/tickets/{ticket_id}` | Get single ticket details |
| PUT | `/api/tickets/{ticket_id}` | Update ticket status & notes |
| DELETE | `/api/tickets/{ticket_id}` | Delete a ticket |
| GET | `/api/stats` | Get dashboard statistics |

**Total: 7 Endpoints** ✅

---

## 🎯 Key Features

✅ Create support tickets with customer info
✅ View all tickets in a list with real-time stats
✅ Search tickets by customer name/email/subject/ID
✅ Filter tickets by status (Open, In Progress, Closed)
✅ View detailed ticket information
✅ Update ticket status and add internal notes
✅ Delete tickets
✅ Dashboard with ticket statistics
✅ Responsive UI with clean design
✅ Toast notifications for user feedback
✅ Form validation on frontend and backend

---

## 📝 Notes

- Ticket IDs are auto-generated in format: `TKT-XXXX` (4 random digits)
- Timestamps are stored in UTC format
- Search is case-insensitive and searches multiple fields
- Status changes don't affect creation/update timestamps (only `updated_at` is updated)
- Frontend API client is configured to use `http://127.0.0.1:8000` as base URL
- Both backend and frontend must be running for the application to work


# ------------------------------------------------------------#
Optimized tool selectionOptimized tool selectionI'll analyze the project structure and provide you with a complete working overview. Let me examine the backend and frontend files.      

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/main.py)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/database.py)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/frontend/src/services/api.js)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/models.py)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/schemas.py)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/crud.py)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/frontend/src/App.jsx)

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/frontend/src/pages/Home.jsx#1-1), lines 1 to 100

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/frontend/src/pages/CreateTicket.jsx#1-1), lines 1 to 100

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/frontend/src/pages/TicketDetail.jsx#1-1), lines 1 to 150

Read [](file:///c%3A/Users/Prasen/Desktop/Support-crm/backend/requirements.txt)

Now I'll create a comprehensive guide showing how the entire project works and all the APIs: 

Created [](file:///c%3A/Users/Prasen/Desktop/Support-crm/PROJECT_DOCUMENTATION.md)

Created [](file:///c%3A/Users/Prasen/Desktop/Support-crm/API_QUICK_REFERENCE.md)

Perfect! I've created comprehensive documentation for your Support CRM project. Here's a summary:

## 📊 **Project Overview**

Your **Support CRM** is a full-stack ticket management system with:
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Frontend:** React + Vite + Axios

---

## 🔌 **All 7 Working APIs**

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | GET | `/` | Health check |
| 2 | POST | `/api/tickets` | Create new ticket |
| 3 | GET | `/api/tickets` | Get all tickets (searchable, filterable) |
| 4 | GET | `/api/tickets/{ticket_id}` | Get single ticket details |
| 5 | PUT | `/api/tickets/{ticket_id}` | Update status & notes |
| 6 | DELETE | `/api/tickets/{ticket_id}` | Delete ticket |
| 7 | GET | `/api/stats` | Get dashboard statistics |

---

## 📱 **Frontend Pages**

| Page | Route | Features |
|------|-------|----------|
| **Home** | `/` | List tickets, search, filter, stats dashboard |
| **Create Ticket** | `/create` | Form to create new ticket with validation |
| **Ticket Detail** | `/ticket/:ticket_id` | View details, update status/notes, delete |

---

## 🚀 **How to Run**

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Server: http://127.0.0.1:8000

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

**API Documentation:** http://127.0.0.1:8000/docs (Swagger UI)

---

## 📝 **Two Documentation Files Created**

I've created two detailed guide files in your project root:

1. **PROJECT_DOCUMENTATION.md** - Complete working guide with:
   - Architecture diagram
   - Database schema
   - Full API endpoint details with examples
   - Data flow explanations
   - All features and components

2. **API_QUICK_REFERENCE.md** - Quick reference with:
   - cURL examples for all endpoints
   - Browser testing URLs
   - JavaScript code examples
   - Troubleshooting guide
   - Database commands

Both files are saved in your project root for easy access!

Made changes.