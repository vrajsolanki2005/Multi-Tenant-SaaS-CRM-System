# Multi-Tenant SaaS CRM System

A production-ready multi-tenant CRM system built with Node.js, Express, and MySQL.

## 🛠 Development Roadmap & Sprint Progress

### **Phase 1: Architecture & Multi-Tenant Authentication**
*Duration: Week 1*
* **Core Infrastructure:** Initialized backend repository using Node.js/Express; configured MySQL connection lifecycle using `mysql2`.
* **Database Design:** Engineered a relational schema for `organizations` and `users` featuring a global `tenant_id` for logical data partitioning.
* **Security Layer:** * Implemented **Stateless Authentication** via JWT (JSON Web Tokens).
    * Integrated **Bcrypt** for one-way password hashing and salted storage.
    * Developed custom **RBAC (Role-Based Access Control)** middleware to enforce permission-based API access.
* **Milestone:** Successfully deployed a secure onboarding flow for new organizations.

---

### **Phase 2: CRM Core & Data Isolation**
*Duration: Week 2*
* **Business Logic:** Designed and implemented the `customers` and `leads` data models.
* **Tenant Integrity:** Engineered an abstraction layer for all database queries to ensure 100% tenant-based data isolation (No-Leak Policy).
* **Data Handling:** * Built CRUD APIs for lead management with server-side **Pagination** (Limit/Offset).
    * Implemented a dynamic **Lead Pipeline Status** system for workflow tracking.
* **Performance:** Applied strategic **Database Indexing** on `tenant_id` and search columns to ensure sub-100ms query responses.

---

### **Phase 3: System Integrity & Audit Workflows**
*Duration: Week 3*
* **Operational Features:** Developed a `tasks` engine for follow-ups and a centralized `audit_logs` system to track sensitive data mutations.
* **Advanced Backend:** * Built lead assignment logic to distribute workloads across organization users.
    * Refined search functionality with multi-parameter filtering.
* **Validation:** Conducted rigorous **Edge-Case Testing** to verify that users cannot access resources outside of their assigned organization ID.
* **Milestone:** Backend stabilized for enterprise-level task orchestration.

---

### **Phase 4: Frontend Architecture & Integration**
*Duration: Week 4*
* **React Environment:** Scaled the frontend using **Vite**; implemented **Axios** interceptors for centralized API error handling and token injection.
* **UI/UX Implementation:** * Developed a modular Sidebar/Navbar layout with **Role-Based Rendering** (Admin vs. User views).
    * Built dynamic Data Tables and Forms for Lead/Customer management.
* **State Management:** Implemented **Protected Routing** to secure the Dashboard, ensuring unauthorized users are redirected to the login flow.
* **Milestone:** Achieved full end-to-end integration between the React UI and MySQL Backend.

---

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
