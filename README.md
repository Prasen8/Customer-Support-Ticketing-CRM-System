Customer Support Ticketing CRM System
Live Application

🚀 Frontend Live Demo
Customer Support Ticketing CRM System

🌐 Backend API Documentation (Swagger UI)
Replace with your actual Render URL if different:

https://customer-support-ticketing-crm-system.onrender.com/docs
Project Overview

Customer Support Ticketing CRM System is a full-stack web application designed to help organizations manage customer support operations efficiently.

The platform allows customers to:

register/login
create support tickets
track ticket status
manage their own support requests

At the same time, administrators can:

access all customer tickets
update ticket status
manage support workflows
monitor ticket statistics

The system simulates a real-world support management workflow similar to professional CRM platforms.

Problem Statement

Many organizations handle customer complaints through:

emails
spreadsheets
chat messages
manual tracking

This creates problems such as:

lost tickets
poor issue tracking
lack of workflow management
delayed customer support

This project solves those problems by creating a centralized ticket management system.

Features
Authentication & Authorization
Customer Features
Register account
Login securely
Create support tickets
View only personal tickets
Track ticket status
Admin Features
Admin login
Access all customer tickets
Update ticket status
Add notes/comments
Delete tickets
View support statistics
Ticket Management
Create support requests
Search tickets
Filter by ticket status
Ticket categories
Ticket priorities
Real-time status updates
Ticket Status Workflow

Tickets can move through different stages:

Open → In Progress → Closed
Technical Stack
Frontend
React.js
React Router
Axios
CSS3
Context API
Backend
FastAPI
Python
JWT Authentication
REST APIs
Database
SQLite
Deployment
Frontend → Vercel
Backend → Render
Project Architecture
Frontend (React + Vercel)
            ↓
Backend API (FastAPI + Render)
            ↓
SQLite Database
Authentication Flow
Customer Flow
Register
   ↓
Login
   ↓
Create Ticket
   ↓
Track Ticket Status
Admin Flow
Admin Login
      ↓
Access Dashboard
      ↓
View All Tickets
      ↓
Manage Support Workflow
Role-Based Access Control

The application uses role-based authorization.

Customer

Can:

create tickets
view own tickets

Cannot:

view other customer tickets
access admin dashboard
Admin

Can:

access all tickets
update ticket status
delete tickets
manage support system
API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
GET	/api/auth/me	Current user info
Customer APIs
Method	Endpoint	Description
POST	/api/tickets	Create ticket
GET	/api/tickets/my-tickets	View customer tickets
GET	/api/tickets/{ticket_id}	View single ticket
Admin APIs
Method	Endpoint	Description
GET	/api/admin/tickets	View all tickets
PUT	/api/admin/tickets/{ticket_id}	Update ticket
DELETE	/api/admin/tickets/{ticket_id}	Delete ticket
GET	/api/admin/stats	Dashboard statistics
Admin Access

To create an admin account:

Register using:

Email: superadmin@gmail.com

Any user registered with this email automatically receives:

Role = admin
Sample Admin Credentials
Username: admin
Email: superadmin@gmail.com
Password: admin123
Sample Customer Credentials
Username: prasen
Email: prasen@gmail.com
Password: 123456
Security Features
JWT Authentication
Password Hashing using bcrypt
Protected Routes
Role-Based Access Control
Secure API Authorization
Challenges Faced

During development, several challenges were solved:

Frontend-backend integration
CORS configuration
JWT authentication
Role-based authorization
Deployment issues
API routing
React Router refresh handling
Deployment Challenges Solved
CORS Errors

Resolved using FastAPI CORS middleware configuration.

React Router 404 on Refresh

Resolved using:

vercel.json

rewrite configuration.

Authentication Issues

Solved using bcrypt password hashing and JWT token management.

Future Improvements

Possible future enhancements:

Email notifications
File attachments
Ticket priority automation
Real-time chat support
Analytics dashboard
PostgreSQL migration
Docker deployment
Multi-admin support
Learning Outcomes

This project helped demonstrate:

Full-stack development
REST API development
Authentication systems
Database management
Frontend-backend integration
Deployment workflows
Production-style architecture
Installation Guide
Backend Setup
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
Frontend Setup
cd frontend

npm install

npm run dev
Environment Variables

Example:

SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///./support_crm.db
Deployment Links
Frontend

Live CRM Application

Backend Swagger API
https://customer-support-ticketing-crm-system.onrender.com/docs
Conclusion

The Customer Support Ticketing CRM System is a production-style support management application built to simulate real-world customer support workflows.

The project demonstrates:

scalable backend architecture
role-based authentication
RESTful APIs
frontend integration
deployment workflows

while focusing on practical usability, clean architecture, and real-world problem-solving.
