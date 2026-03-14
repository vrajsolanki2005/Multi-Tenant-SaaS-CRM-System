# Multi-Tenant SaaS CRM System

A production-ready multi-tenant CRM system built with Node.js, Express, and MySQL.

## Week 1 Progress ✅

- ✅ **Real Relational Database** - MYSQL with proper schema design
- ✅ **Multi-Tenant Base** - Tenant isolation with tenant_id in all tables
- ✅ **JWT Authentication** - Secure token-based auth system
- ✅ **Role-Based Protection** - Middleware for role-based access control
- ✅ **Proper Backend Structure** - MVC architecture with clean separation
- ✅ **Clean SQL Usage** - Parameterized queries and proper database patterns
- ✅ **Industry-Level User API** - Validation, pagination, filtering, security

## 🗓️ WEEK-2 PLAN (CORE MULTI-TENANT LOGIC)

- ✅ Customers table
- ✅ Leads table
- ✅ Tenant-based filtering
- ✅ CRUD APIs
- ✅ Pagination
- ✅ Basic validation

## 🗓️ WEEK-3 PROGRESS (FRONTEND INTEGRATION)

- ✅ React + TypeScript frontend
- ✅ Authentication pages (Login/Register)
- ✅ Dashboard with real-time stats
- ✅ Contacts management (Customers)
- ✅ Leads management
- ✅ Tasks management
- ✅ Users management
- ✅ Audit logs viewer
- ✅ Settings page
- ✅ Full API integration
- ✅ Role-based UI controls
- ✅ Protected routes
- ✅ Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Architecture**: MVC Pattern
- **UI**: Custom CSS with modern design system
- **Deployment**: Docker & Docker Compose

## Project Structure

```
server/
├── database/          # SQL schemas and migrations
├── docs/             # API documentation
├── src/
│   ├── config/       # Database and app configuration
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Auth, validation, and RBAC middleware
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── app.js        # Express app setup

frontend/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── context/      # React context (Auth)
│   ├── pages/        # Page components
│   └── App.tsx       # Main app component
```

## Getting Started

### 🐳 Docker Deployment (Recommended)

The easiest way to run the entire application:

```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# Access the application
open http://localhost
```

For detailed Docker instructions, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

### Manual Setup

#### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables in `server/.env`

3. Initialize database:
```bash
mysql -u root -p < database/create_db.sql
```

4. Start server:
```bash
npm start
# Server runs on http://localhost:3000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

3. Open browser and navigate to `http://localhost:5173`

## Features

### Core Features
- Multi-tenant data isolation
- JWT-based authentication
- Role-based access control (SuperAdmin, Admin, Manager, Sales)
- RESTful API design
- Secure password hashing (bcrypt)
- Token verification middleware
- Real-time dashboard statistics
- Responsive modern UI

### Frontend Features
- ✅ Authentication (Login/Register)
- ✅ Dashboard with charts and metrics
- ✅ Customer management (CRUD)
- ✅ Lead management with status tracking
- ✅ Task management with priorities
- ✅ User management
- ✅ Audit log viewer
- ✅ Profile settings
- ✅ Password management
- ✅ Role-based UI controls
- ✅ Search and filtering
- ✅ Pagination
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

### User Management API
- ✅ Input validation & sanitization
- ✅ Pagination & filtering
- ✅ Search functionality
- ✅ Password strength enforcement
- ✅ Duplicate prevention
- ✅ Self-deletion protection
- ✅ Status management (active/inactive)

## API Documentation

- **Integration Guide**: See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **API Reference**: See [API_REFERENCE.md](API_REFERENCE.md)
- **User API**: See [docs/USER_API.md](docs/USER_API.md)
- **Quick Reference**: See [docs/USER_API_QUICK_REF.md](docs/USER_API_QUICK_REF.md)

## Security Features

- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Tenant isolation
- Input validation on all endpoints
- Rate limiting support (optional)
