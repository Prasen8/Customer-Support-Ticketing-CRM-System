# Support CRM - Authentication & Role-Based Access Control

## Overview

This document outlines the complete authentication and role-based access control (RBAC) system for the Support CRM application.

---

## 📋 Architecture

### Users Table
The system stores user credentials with hashed passwords:
- `id` - Unique user identifier
- `username` - Unique username for login
- `email` - Unique email address
- `hashed_password` - Bcrypt hashed password
- `role` - User role: `customer` or `admin`
- `created_at` - Account creation timestamp

### Tickets Table (Updated)
- `customer_id` - Foreign key to `users.id` (ticket owner)
- Other fields: ticket_id, subject, description, status, notes, timestamps

---

## 🔐 Authentication Flow

### 1. **Registration**
```
User registers → Validation → Hash password → Create user → Return user data
```

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "customer",
  "created_at": "2026-05-19T10:00:00"
}
```

---

### 2. **Login**
```
User enters username/password → Verify credentials → Generate JWT → Return token
```

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "username": "john_doe",
  "password": "secure_password_123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "username": "john_doe",
  "role": "customer"
}
```

---

### 3. **JWT Token**
- **Algorithm:** HS256
- **Expires:** 24 hours (configurable)
- **Contains:**
  - `sub` (user_id)
  - `role` (user role)
  - `exp` (expiration time)

**Token Usage:**
All API requests must include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 👥 User Roles

### **Customer Role**
**Access:** Read and create their own tickets only

**Permissions:**
- ✅ Register account
- ✅ Login
- ✅ Create support tickets
- ✅ View only their own tickets
- ✅ View their own ticket details (read-only)
- ✅ Logout

**Restrictions:**
- ❌ Cannot update ticket status
- ❌ Cannot add notes
- ❌ Cannot delete tickets
- ❌ Cannot view other customers' tickets
- ❌ Cannot access admin endpoints

**Customer Endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/tickets                    (Create own ticket)
GET    /api/tickets/my-tickets         (View own tickets)
GET    /api/tickets/{ticket_id}        (View own ticket only)
```

---

### **Admin Role**
**Access:** Full control over all tickets

**Permissions:**
- ✅ Login only (no registration)
- ✅ View all tickets
- ✅ Update ticket status (Open, In Progress, Closed)
- ✅ Add and edit internal notes
- ✅ Delete tickets
- ✅ View customer information
- ✅ View dashboard statistics

**Restrictions:**
- ❌ Cannot create tickets as customers
- ❌ Cannot register themselves
- ❌ Cannot access customer pages

**Admin Endpoints:**
```
POST   /api/auth/login
GET    /api/auth/me
GET    /api/admin/tickets              (View all tickets)
GET    /api/admin/tickets/{ticket_id}  (View any ticket)
PUT    /api/admin/tickets/{ticket_id}  (Update status & notes)
DELETE /api/admin/tickets/{ticket_id}  (Delete ticket)
GET    /api/admin/stats                (Dashboard stats)
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `400 Bad Request` - Username or email already exists
- `422 Unprocessable Entity` - Validation error

---

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Status Codes:**
- `200 OK` - Login successful, token returned
- `401 Unauthorized` - Invalid credentials
- `422 Unprocessable Entity` - Validation error

---

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

**Status Codes:**
- `200 OK` - User info returned
- `401 Unauthorized` - Invalid/expired token

---

### Customer Ticket Endpoints

#### Create Ticket
```
POST /api/tickets
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Cannot login to account",
  "description": "I'm unable to log in. Getting an error message."
}
```

**Status Codes:**
- `201 Created` - Ticket created
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not a customer

---

#### Get My Tickets
```
GET /api/tickets/my-tickets?status=Open&search=login
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - Filter by status (optional)
- `search` - Search by subject/description/ticket_id (optional)

**Status Codes:**
- `200 OK` - List of user's tickets
- `401 Unauthorized` - Not authenticated

---

#### Get Ticket Detail
```
GET /api/tickets/{ticket_id}
Authorization: Bearer <token>
```

**Status Codes:**
- `200 OK` - Ticket details returned
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not the ticket owner
- `404 Not Found` - Ticket doesn't exist

---

### Admin Endpoints

#### Get All Tickets
```
GET /api/admin/tickets?status=Open&search=urgent
Authorization: Bearer <token>
```

**Status Codes:**
- `200 OK` - All tickets returned
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin

---

#### Update Ticket
```
PUT /api/admin/tickets/{ticket_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "notes": "Investigating the issue. Will update soon."
}
```

**Status Codes:**
- `200 OK` - Ticket updated
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `404 Not Found` - Ticket doesn't exist

---

#### Delete Ticket
```
DELETE /api/admin/tickets/{ticket_id}
Authorization: Bearer <token>
```

**Status Codes:**
- `200 OK` - Ticket deleted
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not an admin
- `404 Not Found` - Ticket doesn't exist

---

#### Get Statistics
```
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total": 15,
  "open": 7,
  "in_progress": 5,
  "closed": 3
}
```

---

## 💻 Frontend Implementation

### AuthContext
Manages authentication state globally:
```javascript
const { user, token, isAuthenticated, isAdmin, isCustomer, login, logout } = useAuth();
```

### Protected Routes
Requires authentication and optionally specific role:
```javascript
<ProtectedRoute requiredRole="customer">
  <MyTickets />
</ProtectedRoute>
```

### API Client
Automatically includes token in all requests:
```javascript
// Token is automatically added to Authorization header
API.get("/api/tickets/my-tickets")
```

### Frontend Pages

**For Customers:**
- `/login` - Login page
- `/register` - Registration page
- `/my-tickets` - List of user's tickets
- `/create-ticket` - Create new ticket form
- `/ticket/{ticket_id}` - View ticket details (read-only)

**For Admins:**
- `/login` - Login page (only)
- `/admin/dashboard` - View all tickets
- `/admin/ticket/{ticket_id}` - Manage ticket (update status/notes)

---

## 🔧 Setup Instructions

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Create demo users (optional):**
```bash
python seed.py
```

Output:
```
✅ Created customer: customer1
✅ Created admin: admin1

Demo Credentials:
  Customer: customer1 / password123
  Admin:    admin1 / password123
```

3. **Run backend:**
```bash
uvicorn main:app --reload
```

Backend: http://127.0.0.1:8000

---

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Run development server:**
```bash
npm run dev
```

Frontend: http://localhost:5173

---

## 🧪 Testing the Authentication

### Manual Testing

**Login as Customer:**
1. Go to http://localhost:5173/login
2. Enter username: `customer1`
3. Enter password: `password123`
4. Click "Login"
5. Redirected to `/my-tickets`

**Login as Admin:**
1. Go to http://localhost:5173/login
2. Enter username: `admin1`
3. Enter password: `password123`
4. Click "Login"
5. Redirected to `/admin/dashboard`

---

### cURL Examples

**Register:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer1",
    "password": "password123"
  }'
```

**Get My Tickets:**
```bash
curl -X GET http://127.0.0.1:8000/api/tickets/my-tickets \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 🔒 Security Considerations

### Implemented
- ✅ **Password Hashing:** Bcrypt with salt
- ✅ **JWT Tokens:** Signed with secret key
- ✅ **Role-Based Access:** Customers vs Admins
- ✅ **Token Expiration:** 24 hours
- ✅ **CORS:** Configured for frontend
- ✅ **Error Messages:** Generic error messages (don't leak usernames)

### Not Implemented (MVP)
- ⚠️ **Email Verification:** Not required for MVP
- ⚠️ **Refresh Tokens:** Using single 24-hour token
- ⚠️ **Password Reset:** Not implemented
- ⚠️ **2FA:** Not implemented
- ⚠️ **Rate Limiting:** Not implemented
- ⚠️ **Session Management:** Stateless JWT only

---

## 📝 Notes

- **Default Secret Key:** Change `SECRET_KEY` in `auth.py` for production
- **Token Expiration:** Configured in `auth.py` (currently 24 hours)
- **Admin Creation:** Admins must be created via database or seed script
- **Database:** SQLite for development (update DATABASE_URL for production)
- **CORS:** Currently allows all origins (update for production)

---

## 🚀 Production Recommendations

1. **Environment Variables:**
   - Store SECRET_KEY in environment variable
   - Use environment-specific DATABASE_URL

2. **Password Policy:**
   - Enforce minimum password length (8+ characters)
   - Require complexity (uppercase, lowercase, numbers, symbols)

3. **Rate Limiting:**
   - Limit login attempts (5 attempts per 15 minutes)
   - Limit registration from single IP

4. **HTTPS:**
   - Use HTTPS in production
   - Set secure flag on cookies

5. **Database:**
   - Use PostgreSQL instead of SQLite
   - Enable row-level security

6. **Tokens:**
   - Use refresh tokens for better security
   - Implement token blacklisting on logout

7. **Admin Panel:**
   - Create separate admin user management interface
   - Add audit logging for admin actions

