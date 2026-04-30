# Multi-Tenant SaaS CRM System

Developed a Multi-Tenant SaaS CRM system with role-based access control, tenant-isolated relational database design, workflow management, and production-ready architecture using MERN stack and MySQL.

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

### **Phase 5: System Enhancement & Production Readiness**
*Duration: Week 5*
 
* **API Standardization & Error Handling:** Standardized API response format across all endpoints; implemented global error handling middleware for centralized exception management and meaningful error responses.
* **Improved Security:**
   * JWT expiry handling with token refresh mechanisms.
   * Input validation across all API endpoints to prevent malicious data injection.
   * CORS and security headers for cross-origin request protection.
* **Optimized Performance:**
   * Query tuning with efficient filtering and pagination.
   * Strategic indexing on frequently queried columns (lead_id, customer_id, status).
   * Rate limiting to prevent API abuse and ensure system stability.
* **Milestone:** Achieved production-level backend improvements with a robust, maintainable system ready for deployment.

---

### **Phase 6: Redis Caching & Docker Deployment**
*Duration: Week 6*
 
* **Redis Caching Implementation:**
   * Integrated Redis 7 for high-performance caching layer.
   * Implemented tenant-isolated cache keys to maintain multi-tenant data separation.
   * Built automatic cache invalidation on CREATE/UPDATE/DELETE operations.
   * Applied 5-minute TTL (Time-To-Live) for optimal cache freshness.
   * Achieved sub-100ms response times on cached endpoints.
* **Docker Containerization:**
   * Created multi-stage Dockerfile for frontend with Nginx production server.
   * Built optimized backend Dockerfile with health checks and wait logic.
   * Configured Docker Compose orchestration for MySQL, Redis, Backend, and Frontend.
   * Implemented Nginx reverse proxy for API routing and static file serving.
   * Established persistent volumes for MySQL and Redis data.
* **Milestone:** Production-ready deployment with containerized architecture and performance-optimized caching system.

---

## Tech Stack

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0
- **Cache**: Redis 7
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Architecture**: MVC Pattern
- **Deployment**: Docker & Docker Compose
- **Web Server**: Nginx (Production)

## Project Structure

```
server/
├── database/          # SQL schemas and migrations
├── docs/             # API documentation
├── src/
│   ├── config/       # Database, Redis, and app configuration
│   ├── controllers/  # Request handlers
│   ├── middlewares/  # Auth, validation, RBAC, and cache middleware
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── app.js        # Express app setup
├── Dockerfile        # Backend container
└── docker-entrypoint.sh  # Startup script

frontend/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── context/      # React context (Auth)
│   ├── pages/        # Page components
│   └── App.tsx       # Main app component
├── Dockerfile        # Frontend container
└── nginx.conf        # Nginx configuration

docker-compose.yml    # Service orchestration
```

## Getting Started

### ⚠️ CRITICAL: Security Setup Required

**Before running the application, you MUST generate a secure JWT secret:**

```bash
cd server
node generate-jwt-secret.js
```

Copy the generated secret to your `.env` file. See [SECURITY_FIXES.md](SECURITY_FIXES.md) for details.

### 🎯 Quick Start for Live Demo

**Want to present this project? It's ready!**

```bash
# One-click startup (Windows)
START-LIVE-DEMO.bat

# Or manually:
cd server && npm start
cd frontend && npm run dev
```

**Demo Accounts:**
- Acme Admin: `admin@acme.com` / `Demo@123`
- TechCorp Admin: `admin@techcorp.com` / `Demo@123`

📖 **See [LIVE-DEMO-GUIDE.md](LIVE-DEMO-GUIDE.md) for complete presentation script**

### 🐳 Docker Deployment (Recommended)

The easiest way to run the entire application:

```bash
# 1. Generate JWT Secret
cd server
node generate-jwt-secret.js

# 2. Add secret to root .env file
# Edit .env: JWT_SECRET=your_generated_secret

# 3. Start all services (MySQL, Redis, Backend, Frontend)
cd ..
docker-compose up -d

# 4. Access the application
open http://localhost
```

**Services Started:**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost:3000
- MySQL: localhost:3306
- Redis: localhost:6379

For detailed Docker instructions, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

### Manual Setup

#### Prerequisites
- Node.js 18+
- MySQL 8.0
- Redis 7 (optional for caching)

#### Backend Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Set up environment variables in `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=saas_crm
DB_PORT=3306
JWT_SECRET=your_generated_secret
REDIS_HOST=localhost
REDIS_PORT=6379
NODE_ENV=development
```

3. Initialize database:
```bash
mysql -u root -p < database/create_db.sql
```

4. Start Redis (optional):
```bash
redis-server
```

5. Start server:
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
- ✅ **Redis caching** with tenant isolation
- ✅ **Docker containerization** for easy deployment

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

### Performance Features
- ✅ Redis caching (5-minute TTL)
- ✅ Tenant-isolated cache keys
- ✅ Automatic cache invalidation
- ✅ Database indexing on critical columns
- ✅ Query optimization with pagination
- ✅ Sub-100ms response times

## Documentation

- **Docker Guide**: See [DOCKER_GUIDE.md](DOCKER_GUIDE.md) 🐳 **Deployment Instructions**
- **Redis Guide**: See [REDIS_GUIDE.md](REDIS_GUIDE.md) ⚡ **Caching Implementation**
- **Security Fixes**: See [SECURITY_FIXES.md](SECURITY_FIXES.md) ⚠️ **READ THIS FIRST**
- **Integration Guide**: See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
- **API Reference**: See [API_REFERENCE.md](API_REFERENCE.md)
- **User API**: See [docs/USER_API.md](docs/USER_API.md)
- **Quick Reference**: See [docs/USER_API_QUICK_REF.md](docs/USER_API_QUICK_REF.md)

## Security Features

- ✅ SQL injection prevention (parameterized queries)
- ✅ Rate limiting on authentication endpoints
- ✅ Secure JWT secret enforcement
- ✅ Global error handler
- ✅ XSS prevention (input sanitization)
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication with session management
- ✅ Role-based access control
- ✅ Tenant isolation (data & cache)
- ✅ Input validation on all endpoints
- ✅ Environment variable validation
- ✅ CORS and security headers

**See [SECURITY_FIXES.md](SECURITY_FIXES.md) for details on recent critical security updates.**

## Performance Optimizations

- ✅ Redis caching with automatic invalidation
- ✅ Tenant-isolated cache keys
- ✅ Strategic database indexing
- ✅ Connection pooling (MySQL)
- ✅ Query optimization with pagination
- ✅ Docker multi-stage builds
- ✅ Nginx static file serving

## Quick Commands

```bash
# Docker
docker-compose up -d              # Start all services
docker-compose logs -f            # View logs
docker-compose down               # Stop services
docker-compose down -v            # Reset database

# Development
npm run dev                       # Start dev server
npm start                         # Start production server
node generate-jwt-secret.js       # Generate JWT secret

# Redis
redis-cli monitor                 # Monitor cache
redis-cli FLUSHALL                # Clear cache
```
