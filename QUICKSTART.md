# Quick Start Guide - Support CRM with Authentication

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

---

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Create Demo Users (Optional)
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

### Step 3: Start Backend Server
```bash
uvicorn main:app --reload
```

✅ **Backend Running:** http://127.0.0.1:8000

**API Documentation:**
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

---

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

✅ **Frontend Running:** http://localhost:5173

---

## 🧪 Test the Application

### Login as Customer
1. Go to http://localhost:5173/login
2. Username: `customer1`
3. Password: `password123`
4. Click Login

**What you can do:**
- ✅ View your tickets (My Tickets)
- ✅ Create new tickets
- ✅ View ticket details (read-only)
- ✅ See admin notes on your tickets

**What you cannot do:**
- ❌ Update ticket status
- ❌ View other customers' tickets
- ❌ Delete tickets

---

### Login as Admin
1. Go to http://localhost:5173/login
2. Username: `admin1`
3. Password: `password123`
4. Click Login

**What you can do:**
- ✅ View all tickets (Admin Dashboard)
- ✅ Update ticket status (Open, In Progress, Closed)
- ✅ Add/edit internal notes
- ✅ Delete tickets
- ✅ See customer information
- ✅ View dashboard statistics

---

## 📊 Test Scenarios

### Scenario 1: Create a Ticket as Customer
1. Login as `customer1`
2. Click "+ New Ticket"
3. Fill in:
   - Subject: "Cannot login to account"
   - Description: "Getting error code 401"
4. Click "Create Ticket"
5. Ticket ID is generated (e.g., TKT-1234)
6. Redirected to My Tickets

---

### Scenario 2: Manage Ticket as Admin
1. Login as `admin1`
2. See all customers' tickets in Admin Dashboard
3. Click "Manage" on any ticket
4. Update status to "In Progress"
5. Add internal note: "Investigating user's account"
6. Click "Save Changes"
7. Note is now visible to customer

---

### Scenario 3: Close a Ticket
1. Login as admin
2. Click "Manage" on a ticket
3. Change status to "Closed"
4. Click "Save Changes"
5. Customer can see the ticket is closed when they view it

---

## 📝 Key Files

### Backend
```
backend/
├── auth.py                    # JWT & password utilities
├── models.py                  # User & Ticket models
├── schemas.py                 # Request/response schemas
├── crud.py                    # Database operations
├── main.py                    # API endpoints
├── database.py                # Database configuration
├── seed.py                    # Create demo users
└── requirements.txt           # Python dependencies
```

### Frontend
```
frontend/src/
├── context/
│   └── AuthContext.jsx        # Authentication state
├── components/
│   ├── Header.jsx             # Navigation header
│   ├── ProtectedRoute.jsx     # Route protection
│   └── Toast.jsx              # Notifications
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── MyTickets.jsx          # Customer dashboard
│   ├── CreateTicket.jsx       # Create ticket form
│   ├── TicketDetail.jsx       # View ticket
│   ├── AdminDashboard.jsx     # Admin dashboard
│   └── AdminTicketDetail.jsx  # Admin ticket management
├── services/
│   └── api.js                 # API client with auth
└── App.jsx                    # Main router
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Create new account
POST   /api/auth/login         # Login & get token
GET    /api/auth/me            # Get current user
```

### Customer Endpoints
```
POST   /api/tickets            # Create ticket
GET    /api/tickets/my-tickets # Get my tickets
GET    /api/tickets/{id}       # Get my ticket
```

### Admin Endpoints
```
GET    /api/admin/tickets      # Get all tickets
GET    /api/admin/tickets/{id} # Get any ticket
PUT    /api/admin/tickets/{id} # Update ticket
DELETE /api/admin/tickets/{id} # Delete ticket
GET    /api/admin/stats        # Dashboard stats
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Connection refused" when starting backend**
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt

# Try running again
uvicorn main:app --reload
```

**Database locked error**
```bash
# Delete the SQLite database and restart
rm support_crm.db
python seed.py
```

---

### Frontend Issues

**"Cannot connect to backend" error**
```bash
# Make sure backend is running on http://127.0.0.1:8000
# Check API URL in frontend/src/services/api.js

# Restart frontend development server
npm run dev
```

**"Token expired" message**
```bash
# Simply logout and login again
# Token expires after 24 hours
```

---

## 🔒 Demo Credentials Reference

**Customer Account:**
- Username: `customer1`
- Email: `customer@example.com`
- Password: `password123`

**Admin Account:**
- Username: `admin1`
- Email: `admin@example.com`
- Password: `password123`

---

## 📚 Full Documentation

- [Authentication & RBAC Details](AUTHENTICATION.md)
- [API Reference](API_QUICK_REFERENCE.md)
- [Project Documentation](PROJECT_DOCUMENTATION.md)

---

## 🎯 Next Steps

1. **Customize demo credentials:** Edit `backend/seed.py`
2. **Change SECRET_KEY:** Update `SECRET_KEY` in `backend/auth.py`
3. **Deploy to production:** Use environment variables for sensitive config
4. **Add more features:** Email notifications, ticket comments, file attachments

---

## ✅ What's Included

✅ User registration and login
✅ JWT authentication (24-hour tokens)
✅ Role-based access control (Customer & Admin)
✅ Protected API endpoints
✅ Protected frontend routes
✅ Customer ticket dashboard
✅ Admin ticket management
✅ Status tracking (Open, In Progress, Closed)
✅ Internal notes for admins
✅ Responsive UI
✅ Toast notifications
✅ Complete documentation

---

## 📞 Support

For detailed information about each component, see:
- Backend auth logic: `backend/auth.py`
- Frontend auth context: `frontend/src/context/AuthContext.jsx`
- Full API docs (live): http://127.0.0.1:8000/docs

