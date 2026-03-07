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

✅ Customers table
✅ Leads table
✅ Tenant-based filtering
✅ CRUD APIs
✅ Pagination
✅ Basic validation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Architecture**: MVC Pattern

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
```

## Getting Started

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
```

## Features

### Core Features
- Multi-tenant data isolation
- JWT-based authentication
- Role-based access control (SuperAdmin, Admin, Manager, Sales)
- RESTful API design
- Secure password hashing (bcrypt)
- Token verification middleware

### User Management API
- ✅ Input validation & sanitization
- ✅ Pagination & filtering
- ✅ Search functionality
- ✅ Password strength enforcement
- ✅ Duplicate prevention
- ✅ Self-deletion protection
- ✅ Status management (active/inactive)

## API Documentation

- **User API**: See [docs/USER_API.md](docs/USER_API.md)
- **Quick Reference**: See [docs/USER_API_QUICK_REF.md](docs/USER_API_QUICK_REF.md)
- **Improvements**: See [docs/USER_API_IMPROVEMENTS.md](docs/USER_API_IMPROVEMENTS.md)

## Security Features

- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Tenant isolation
- Input validation on all endpoints
- Rate limiting support (optional)
