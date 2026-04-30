# System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                     http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pages      │  │  Components  │  │   Context    │          │
│  │              │  │              │  │              │          │
│  │ • Login      │  │ • Layout     │  │ • Auth       │          │
│  │ • Register   │  │ • Sidebar    │  │              │          │
│  │ • Dashboard  │  │ • Protected  │  │              │          │
│  │ • Contacts   │  │   Route      │  │              │          │
│  │ • Leads      │  │              │  │              │          │
│  │ • Tasks      │  │              │  │              │          │
│  │ • Users      │  │              │  │              │          │
│  │ • Audit      │  │              │  │              │          │
│  │ • Settings   │  │              │  │              │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────┐           │
│  │              API Layer (Axios)                   │           │
│  │  • auth.ts      • customers.ts   • tasks.ts     │           │
│  │  • dashboard.ts • leads.ts       • users.ts     │           │
│  │  • audit.ts     • axios.ts (interceptors)       │           │
│  └─────────────────────┬───────────────────────────┘           │
│                        │                                         │
└────────────────────────┼─────────────────────────────────────────┘
                         │
                         │ HTTP Requests (JSON)
                         │ Authorization: Bearer <JWT>
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
│                     http://localhost:3000                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Middleware Layer                       │  │
│  │  • CORS           • Cookie Parser   • JSON Parser        │  │
│  │  • Auth Middleware • RBAC Middleware • Validation        │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Routes Layer                         │  │
│  │  /api/auth          /api/customers    /api/tasks         │  │
│  │  /api/dashboard     /api/leads        /api/users         │  │
│  │  /api/audit-logs                                          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Controllers Layer                       │  │
│  │  • authController      • customerController              │  │
│  │  • dashboardController • leadController                  │  │
│  │  • taskController      • userController                  │  │
│  │  • auditController                                        │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
│                         ▼                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Services Layer                         │  │
│  │  • authService      • customerService                    │  │
│  │  • leadService      • taskService                        │  │
│  │  • userService      • auditService                       │  │
│  │  • taskScheduler                                          │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          │ SQL Queries
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (MySQL)                           │
│                         saas_crm                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   org    │  │  users   │  │customers │  │  leads   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │  tasks   │  │  notes   │  │audit_logs│                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                   │
│  All tables have tenant_id/org_id for multi-tenant isolation    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete User Flow: Login to Dashboard

```
┌─────────────┐
│   User      │
│ Opens App   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 1. Frontend: LoginPage.tsx                              │
│    • User enters email & password                       │
│    • Form validation                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 2. API Call: api/auth.ts → login(email, password)      │
│    • POST /api/auth/login                               │
│    • Body: { email, password }                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Backend: authController.login                        │
│    • Validates input                                    │
│    • Calls authService.login                            │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Service: authService.login                           │
│    • Query: SELECT * FROM users WHERE email = ?         │
│    • Compare password with bcrypt                       │
│    • Generate JWT token                                 │
│    • Token payload: { user_id, tenant_id, user_role }   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Response to Frontend                                 │
│    • { token, orgId, userId }                           │
│    • Set httpOnly cookie                                │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Frontend: AuthContext                                │
│    • Decode JWT token                                   │
│    • Extract user info (role, name, email)              │
│    • Store in localStorage                              │
│    • Update context state                               │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 7. Navigate to Dashboard                                │
│    • ProtectedRoute checks auth                         │
│    • Renders DashboardLayout + DashboardPage            │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 8. Dashboard Loads Data                                 │
│    • API Call: getDashboardStats()                      │
│    • GET /api/dashboard/stats                           │
│    • Authorization: Bearer <token>                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 9. Backend: authMiddleware                              │
│    • Extract token from header/cookie                   │
│    • Verify JWT signature                               │
│    • Decode payload → req.user                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 10. Backend: dashboardController.getDashboardStats      │
│     • Extract tenant_id from req.user                   │
│     • Query counts for leads, customers, tasks, users   │
│     • Query lead status distribution                    │
│     • Query recent leads & tasks                        │
│     • Query overdue tasks                               │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 11. Response with Stats                                 │
│     • { counts, leadStatusDist, recentLeads, ... }      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ 12. Frontend: DashboardPage renders                     │
│     • Display animated counters                         │
│     • Render pie chart with Recharts                    │
│     • Show recent leads & tasks                         │
│     • Display overdue tasks alerts                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 CRUD Flow: Creating a Lead

```
User clicks "Add Lead" button
         │
         ▼
┌─────────────────────────────────────────┐
│ Frontend: LeadsPage.tsx                 │
│ • Opens modal                           │
│ • User fills form (title, status, etc) │
│ • Clicks "Create Lead"                  │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ API: createLead(data)                   │
│ • POST /api/leads                       │
│ • Body: { title, status, value, ... }   │
│ • Header: Authorization: Bearer <token> │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Middleware: authMiddleware              │
│ • Verify JWT token                      │
│ • Set req.user = decoded token          │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Middleware: allowRoles('admin','mgr')   │
│ • Check req.user.user_role              │
│ • Allow or reject (403)                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Controller: leadController.createLead   │
│ • Validate input                        │
│ • Extract tenant_id from req.user       │
│ • Call leadService.createLead           │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Service: leadService.createLead         │
│ • INSERT INTO leads                     │
│   (org_id, title, status, value, ...)   │
│ • VALUES (tenant_id, ?, ?, ?, ...)      │
│ • Return insertId                       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Audit: Log action                       │
│ • INSERT INTO audit_logs                │
│ • (org_id, user_id, action, entity)     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Response: { success, lead_id, ... }     │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Frontend: LeadsPage.tsx                 │
│ • Close modal                           │
│ • Refresh lead list                     │
│ • Show success toast                    │
└─────────────────────────────────────────┘
```

---

## 🔒 Multi-Tenant Isolation Flow

```
┌──────────────────────────────────────────────────────────┐
│ Organization A (tenant_id = 1)                           │
│                                                           │
│  User Login → JWT Token                                  │
│  { user_id: 5, tenant_id: 1, user_role: 'admin' }       │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │ Every API Request                              │     │
│  │ • Token decoded → req.user.tenant_id = 1       │     │
│  │                                                 │     │
│  │ Database Queries:                              │     │
│  │ • SELECT * FROM leads WHERE org_id = 1         │     │
│  │ • SELECT * FROM customers WHERE org_id = 1     │     │
│  │ • SELECT * FROM tasks WHERE org_id = 1         │     │
│  │                                                 │     │
│  │ Result: Only sees Org A data                   │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Organization B (tenant_id = 2)                           │
│                                                           │
│  User Login → JWT Token                                  │
│  { user_id: 12, tenant_id: 2, user_role: 'manager' }    │
│                                                           │
│  ┌────────────────────────────────────────────────┐     │
│  │ Every API Request                              │     │
│  │ • Token decoded → req.user.tenant_id = 2       │     │
│  │                                                 │     │
│  │ Database Queries:                              │     │
│  │ • SELECT * FROM leads WHERE org_id = 2         │     │
│  │ • SELECT * FROM customers WHERE org_id = 2     │     │
│  │ • SELECT * FROM tasks WHERE org_id = 2         │     │
│  │                                                 │     │
│  │ Result: Only sees Org B data                   │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────┘

✅ Complete Data Isolation
✅ No cross-tenant data leakage
✅ Enforced at database query level
```

---

## 🛡️ Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Request Flow                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 1: CORS                                            │
│ • Only allow http://localhost:5173                       │
│ • Credentials: true (cookies)                            │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Pass
       ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Authentication (authMiddleware)                 │
│ • Check JWT token in header or cookie                    │
│ • Verify signature with secret                           │
│ • Decode payload → req.user                              │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Valid Token
       ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 3: Authorization (allowRoles)                      │
│ • Check req.user.user_role                               │
│ • Compare with allowed roles                             │
│ • Reject if insufficient permissions                     │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Authorized
       ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 4: Input Validation                                │
│ • Express-validator rules                                │
│ • Sanitize inputs                                        │
│ • Check required fields                                  │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Valid Input
       ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 5: Multi-Tenant Isolation                          │
│ • Extract tenant_id from req.user                        │
│ • Add WHERE org_id = ? to all queries                    │
│ • Parameterized queries (SQL injection prevention)       │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Isolated Query
       ▼
┌─────────────────────────────────────────────────────────┐
│ Layer 6: Audit Logging                                   │
│ • Log all CREATE/UPDATE/DELETE actions                   │
│ • Store user_id, action, entity, timestamp               │
└──────┬──────────────────────────────────────────────────┘
       │ ✅ Logged
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Response                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌──────────────┐
│     org      │
│──────────────│
│ id (PK)      │◄─────────┐
│ name         │          │
│ created_at   │          │
└──────────────┘          │
                          │
                          │ tenant_id (FK)
                          │
        ┌─────────────────┼─────────────────┬─────────────────┐
        │                 │                 │                 │
        ▼                 ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    users     │  │  customers   │  │    leads     │  │    tasks     │
│──────────────│  │──────────────│  │──────────────│  │──────────────│
│ user_id (PK) │  │customer_id   │  │ lead_id (PK) │  │ task_id (PK) │
│ tenant_id    │  │ org_id       │  │ org_id       │  │ org_id       │
│ user_name    │  │ name         │  │ title        │  │ task_name    │
│ user_email   │  │ email        │  │ status       │  │ status       │
│ user_role    │  │ phone        │  │ value        │  │ priority     │
│ is_active    │  │ created_at   │  │ customer_id  │  │ due_date     │
└──────┬───────┘  └──────────────┘  └──────┬───────┘  │ assigned_to  │
       │                                    │          └──────┬───────┘
       │                                    │                 │
       │                                    │                 │
       └────────────────┬───────────────────┴─────────────────┘
                        │
                        ▼
                ┌──────────────┐
                │ audit_logs   │
                │──────────────│
                │ log_id (PK)  │
                │ org_id       │
                │ user_id      │
                │ action       │
                │ entity       │
                │ entity_id    │
                │ timestamp    │
                └──────────────┘
```

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                         │
│                   (AWS ALB / Nginx)                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend   │    │  Frontend   │    │  Frontend   │
│  (S3/CDN)   │    │  (S3/CDN)   │    │  (S3/CDN)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │ API Calls
       ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│                  (Rate Limiting)                         │
└──────┬──────────────────────────────────────────────────┘
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Backend    │    │  Backend    │    │  Backend    │
│  (EC2/ECS)  │    │  (EC2/ECS)  │    │  (EC2/ECS)  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │   Database      │
                │   (RDS MySQL)   │
                │   Multi-AZ      │
                └─────────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │  Read Replica   │
                │  (RDS MySQL)    │
                └─────────────────┘
```

---

## 📈 Performance Optimization Points

1. **Database Indexing**
   - Index on `org_id` in all tables
   - Composite index on `(org_id, created_at)`
   - Index on `user_email` for login

2. **Caching Strategy**
   - Redis for session storage
   - Cache dashboard stats (5 min TTL)
   - Cache user permissions

3. **Query Optimization**
   - Use pagination on all list endpoints
   - Limit result sets (default 15)
   - Use SELECT specific columns

4. **Frontend Optimization**
   - Code splitting by route
   - Lazy load components
   - Debounce search inputs
   - Virtual scrolling for large lists

5. **API Optimization**
   - Compress responses (gzip)
   - Rate limiting per user
   - Connection pooling (MySQL)
   - Batch operations where possible

---

## 🔍 Monitoring & Logging

```
┌─────────────────────────────────────────────────────────┐
│                    Application                           │
└──────┬──────────────────────────────────────────────────┘
       │
       ├─────────────────┬─────────────────┬───────────────┐
       ▼                 ▼                 ▼               ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐
│ Error Logs  │  │ Access Logs │  │ Audit Logs  │  │ Metrics  │
│ (Winston)   │  │ (Morgan)    │  │ (Database)  │  │ (Custom) │
└─────────────┘  └─────────────┘  └─────────────┘  └──────────┘
       │                 │                 │               │
       └─────────────────┴─────────────────┴───────────────┘
                          │
                          ▼
                ┌─────────────────┐
                │  Log Aggregator │
                │  (CloudWatch)   │
                └─────────────────┘
```

---

This architecture ensures:
✅ Scalability
✅ Security
✅ Multi-tenancy
✅ Performance
✅ Maintainability
