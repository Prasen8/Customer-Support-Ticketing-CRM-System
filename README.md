# 🎫 Customer Support Ticketing CRM System

## 🚀 Live Application

### 🌐 Frontend Live Demo
https://customer-support-ticketing-crm-syst.vercel.app/login

### 📘 Backend API Documentation (Swagger UI)
https://customer-support-ticketing-crm-system.onrender.com/docs

---

# 📌 Project Overview

Customer Support Ticketing CRM System is a full-stack web application designed to help organizations manage customer support operations efficiently.

The platform allows customers to:
- Register/Login securely
- Create support tickets
- Track ticket status
- Manage their own support requests

At the same time, administrators can:
- Access all customer tickets
- Update ticket status
- Manage support workflows
- Monitor ticket statistics

The system simulates a real-world support management workflow similar to professional CRM platforms.

---

# ❗ Problem Statement

Many organizations handle customer complaints through:
- Emails
- Spreadsheets
- Chat messages
- Manual tracking systems

This creates problems such as:
- Lost tickets
- Poor issue tracking
- Lack of workflow management
- Delayed customer support

This project solves those problems by creating a centralized ticket management system.

---

# ✨ Features

## 🔐 Authentication & Authorization

### 👤 Customer Features
- Register account
- Secure login system
- Create support tickets
- View only personal tickets
- Track ticket status

### 👨‍💼 Admin Features
- Admin login
- Access all customer tickets
- Update ticket status
- Add notes/comments
- Delete tickets
- View dashboard statistics

---

# 🎫 Ticket Management

- Create support requests
- Search tickets
- Filter tickets by status
- Ticket categories
- Ticket priorities
- Real-time ticket status updates

---

# 🔄 Ticket Status Workflow

```text
Open → In Progress → Closed
```

---

# 🛠️ Technical Stack

## 🎨 Frontend
- React.js
- React Router
- Axios
- CSS3
- Context API

## ⚙️ Backend
- FastAPI
- Python
- JWT Authentication
- REST APIs

## 🗄️ Database
- SQLite

## ☁️ Deployment
- Frontend → Vercel
- Backend → Render

---

# 🏗️ Project Architecture

```text
Frontend (React + Vercel)
            ↓
Backend API (FastAPI + Render)
            ↓
SQLite Database
```

---

# 🔑 Authentication Flow

## 👤 Customer Flow

```text
Register
   ↓
Login
   ↓
Create Ticket
   ↓
Track Ticket Status
```

## 👨‍💼 Admin Flow

```text
Admin Login
      ↓
Access Dashboard
      ↓
View All Tickets
      ↓
Manage Support Workflow
```

---

# 🛡️ Role-Based Access Control

The application uses role-based authorization.

## 👤 Customer

### Can:
- Create tickets
- View own tickets

### Cannot:
- View other customer tickets
- Access admin dashboard

---

## 👨‍💼 Admin

### Can:
- Access all tickets
- Update ticket status
- Delete tickets
- Manage support system

---

# 🔌 API Endpoints

## 🔐 Authentication APIs

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Current user info |

---

## 👤 Customer APIs

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/my-tickets` | View customer tickets |
| GET | `/api/tickets/{ticket_id}` | View single ticket |

---

## 👨‍💼 Admin APIs

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/admin/tickets` | View all tickets |
| PUT | `/api/admin/tickets/{ticket_id}` | Update ticket |
| DELETE | `/api/admin/tickets/{ticket_id}` | Delete ticket |
| GET | `/api/admin/stats` | Dashboard statistics |

---

# 👨‍💼 Admin Access

To create an admin account:

Register using:

```text
Email: superadmin@gmail.com
```

Any user registered with this email automatically receives:

```text
Role = admin
```

---

# 🔐 Sample Credentials

## 👨‍💼 Admin

```text
Username: admin
Email: superadmin@gmail.com
Password: admin123
```

## 👤 Customer

```text
Username: prasen
Email: prasen@gmail.com
Password: 123456
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Role-Based Access Control
- Secure API Authorization

---

# ⚡ Challenges Faced

During development, several challenges were solved:

- Frontend-backend integration
- CORS configuration
- JWT authentication
- Role-based authorization
- Deployment issues
- API routing
- React Router refresh handling

---

# 🧩 Deployment Challenges Solved

## ✅ CORS Errors
Resolved using FastAPI CORS middleware configuration.

## ✅ React Router 404 on Refresh
Resolved using:

```json
vercel.json
```

rewrite configuration.

## ✅ Authentication Issues
Solved using bcrypt password hashing and JWT token management.

---

# 🚀 Future Improvements

Possible future enhancements:

- Email notifications
- File attachments
- Ticket priority automation
- Real-time chat support
- Analytics dashboard
- PostgreSQL migration
- Docker deployment
- Multi-admin support

---

# 📚 Learning Outcomes

This project helped demonstrate:

- Full-stack development
- REST API development
- Authentication systems
- Database management
- Frontend-backend integration
- Deployment workflows
- Production-style architecture

---

# ⚙️ Installation Guide

## 🔧 Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

---

## 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Example:

```env
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./support_crm.db
```

---

# 🌍 Deployment Links

## 🚀 Frontend
https://customer-support-ticketing-crm-syst.vercel.app/login

## 📘 Backend Swagger API
https://customer-support-ticketing-crm-system.onrender.com/docs

---

# 🏁 Conclusion

The Customer Support Ticketing CRM System is a production-style support management application built to simulate real-world customer support workflows.

The project demonstrates:
- Scalable backend architecture
- Role-based authentication
- RESTful APIs
- Frontend integration
- Deployment workflows

while focusing on practical usability, clean architecture, and real-world problem-solving.
