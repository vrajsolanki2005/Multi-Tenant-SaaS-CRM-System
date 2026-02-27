# Multi-Tenant SaaS CRM System

A production-ready multi-tenant CRM system built with Node.js, Express, and PostgreSQL.

## Week 1 Progress ✅

- ✅ **Real Relational Database** - PostgreSQL with proper schema design
- ✅ **Multi-Tenant Base** - Tenant isolation with tenant_id in all tables
- ✅ **JWT Authentication** - Secure token-based auth system
- ✅ **Role-Based Protection** - Middleware for role-based access control
- ✅ **Proper Backend Structure** - MVC architecture with clean separation
- ✅ **Clean SQL Usage** - Parameterized queries and proper database patterns

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: MVC Pattern

## Project Structure

```
server/
├── database/          # SQL schemas and migrations
├── src/
│   ├── config/       # Database and app configuration
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Auth and validation middleware
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
psql -U postgres -f database/create_db.sql
```

4. Start server:
```bash
npm start
```

## Features

- Multi-tenant data isolation
- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- RESTful API design
- Secure password hashing
- Token verification middleware
