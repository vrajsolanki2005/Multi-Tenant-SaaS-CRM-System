# Frontend-Backend Integration Guide

## ✅ Integration Status

All frontend pages are now fully integrated with the backend APIs.

---

## 🔐 Authentication Flow

### Register (Create Organization)
- **Frontend**: `RegisterPage.tsx` → `api/auth.ts` → `createOrg()`
- **Backend**: `POST /api/auth/create-org`
- **Controller**: `authController.createOrg`
- **Service**: `authService.createOrg`
- **Flow**:
  1. User fills form (org name, admin name, email, password)
  2. Creates organization in `org` table
  3. Creates admin user in `users` table
  4. Returns `orgId` and `userId`
  5. Redirects to login page

### Login
- **Frontend**: `LoginPage.tsx` → `api/auth.ts` → `login()`
- **Backend**: `POST /api/auth/login`
- **Controller**: `authController.login`
- **Service**: `authService.login`
- **Flow**:
  1. User enters email and password
  2. Backend validates credentials
  3. Returns JWT token (stored in localStorage + httpOnly cookie)
  4. Token contains: `user_id`, `tenant_id`, `user_role`
  5. Frontend decodes token and stores user info
  6. Redirects to dashboard

### Protected Routes
- **Frontend**: `ProtectedRoute.tsx` checks `AuthContext`
- **Backend**: `authMiddleware.js` validates JWT on every request
- **Token Sources**: Cookie OR `Authorization: Bearer <token>` header

---

## 📊 Dashboard

### Stats API
- **Frontend**: `DashboardPage.tsx` → `api/dashboard.ts` → `getDashboardStats()`
- **Backend**: `GET /api/dashboard/stats`
- **Controller**: `dashboardController.getDashboardStats`
- **Returns**:
  ```json
  {
    "counts": {
      "leads": 45,
      "customers": 120,
      "openTasks": 12,
      "completedTasks": 38,
      "users": 8
    },
    "leadStatusDist": {
      "new": 15,
      "contacted": 10,
      "qualified": 8,
      "converted": 12
    },
    "recentLeads": [...],
    "recentTasks": [...],
    "overdueTasks": [...]
  }
  ```

---

## 👥 Contacts (Customers)

### List Customers
- **Frontend**: `ContactsPage.tsx` → `api/customers.ts` → `getCustomers(page)`
- **Backend**: `GET /api/customers?page=1&limit=15`
- **Controller**: `customerController.getCustomers`
- **Access**: All authenticated users

### Create Customer
- **Frontend**: Modal form → `createCustomer(data)`
- **Backend**: `POST /api/customers`
- **Body**: `{ name, email, phone }`
- **Access**: Admin, Manager only

### Update Customer
- **Frontend**: Edit modal → `updateCustomer(id, data)`
- **Backend**: `PUT /api/customers/:id`
- **Access**: Admin, Manager only

### Delete Customer
- **Frontend**: Delete button → `deleteCustomer(id)`
- **Backend**: `DELETE /api/customers/:id`
- **Access**: Admin only

---

## 🎯 Leads

### List Leads
- **Frontend**: `LeadsPage.tsx` → `api/leads.ts` → `getLeads(page, status)`
- **Backend**: `GET /api/leads?page=1&limit=15&status=new`
- **Controller**: `leadController.getLeads`
- **Access**: All authenticated users

### Create Lead
- **Frontend**: Modal form → `createLead(data)`
- **Backend**: `POST /api/leads`
- **Body**: `{ title, status, value, customer_id }`
- **Access**: Admin, Manager only

### Update Lead
- **Frontend**: Edit modal → `updateLead(id, data)`
- **Backend**: `PUT /api/leads/:id`
- **Body**: `{ title, newStatus, value, customer_id }`
- **Access**: Admin, Manager only

### Assign Lead
- **Frontend**: Assign dropdown → `assignLead(id, user_id)`
- **Backend**: `PUT /api/leads/:id/assign`
- **Body**: `{ user_id }`
- **Access**: Admin only

### Delete Lead
- **Frontend**: Delete button → `deleteLead(id)`
- **Backend**: `DELETE /api/leads/:id`
- **Access**: Admin only

---

## ✅ Tasks

### List Tasks
- **Frontend**: `TasksPage.tsx` → `api/tasks.ts` → `getTasks(params)`
- **Backend**: `GET /api/tasks?page=1&limit=15&status=pending`
- **Controller**: `taskController.getTasks`
- **Access**: All authenticated users

### Create Task
- **Frontend**: Modal form → `createTask(data)`
- **Backend**: `POST /api/tasks`
- **Body**: `{ task_name, description, status, priority, due_date, lead_id, assigned_to }`
- **Access**: Admin, Manager only

### Update Task
- **Frontend**: Edit modal → `updateTask(id, data)`
- **Backend**: `PUT /api/tasks/:id`
- **Access**: Admin, Manager only

### Delete Task
- **Frontend**: Delete button → `deleteTask(id)`
- **Backend**: `DELETE /api/tasks/:id`
- **Access**: Admin only

---

## 👤 Users

### List Users
- **Frontend**: `UsersPage.tsx` → `api/users.ts` → `getUsers(params)`
- **Backend**: `GET /api/users?page=1&limit=15`
- **Controller**: `userController.getAllUsers`
- **Access**: All authenticated users

### Create User
- **Frontend**: Modal form → `createUser(data)`
- **Backend**: `POST /api/create-user`
- **Body**: `{ user_name, user_email, user_password, user_role }`
- **Access**: Admin, Manager only

### Update User
- **Frontend**: Edit modal → `updateUser(id, data)`
- **Backend**: `PUT /api/users/:id`
- **Body**: `{ user_name, user_email, user_role, is_active }`
- **Access**: Admin, Manager only

### Delete User
- **Frontend**: Delete button → `deleteUser(id)`
- **Backend**: `DELETE /api/users/:id`
- **Access**: Admin only

---

## 📝 Audit Logs

### List Audit Logs
- **Frontend**: `AuditPage.tsx` → `api/audit.ts` → `getAuditLogs(params)`
- **Backend**: `GET /api/audit-logs?page=1&limit=20`
- **Controller**: `auditController.getAuditLogs`
- **Access**: Admin only

---

## ⚙️ Settings

### Update Profile
- **Frontend**: `SettingsPage.tsx` → `api/users.ts` → `updateMe(data)`
- **Backend**: `PUT /api/me`
- **Body**: `{ user_name, user_email }`
- **Access**: Current user only

### Change Password
- **Frontend**: Password form → `updatePassword(data)`
- **Backend**: `PUT /api/me/password`
- **Body**: `{ oldPassword, newPassword }`
- **Access**: Current user only

### Delete Account
- **Frontend**: Delete button → `deleteMe()`
- **Backend**: `DELETE /api/me`
- **Access**: Current user only

---

## 🔒 Role-Based Access Control

### Roles Hierarchy
1. **SuperAdmin** - Full system access (not used in current implementation)
2. **Admin** - Full organization access
3. **Manager** - Can create/edit, cannot delete
4. **Sales** - Read-only access

### Frontend Role Checks
```typescript
const { isAdmin, isManager } = useAuth();

// Show create button only to managers+
{isManager && <button>Create</button>}

// Show delete button only to admins
{isAdmin && <button>Delete</button>}
```

### Backend Role Checks
```javascript
// In routes
router.post('/customers', allowRoles('admin', 'manager'), controller.create);
router.delete('/customers/:id', allowRoles('admin'), controller.delete);
```

---

## 🔄 Data Flow Example: Creating a Lead

1. **User Action**: Clicks "Add Lead" button in `LeadsPage.tsx`
2. **Frontend**: Opens modal, user fills form
3. **API Call**: `createLead({ title, status, value, customer_id })`
4. **Axios Interceptor**: Adds `Authorization: Bearer <token>` header
5. **Backend Route**: `POST /api/leads` → `authMiddleware` → `allowRoles('admin', 'manager')`
6. **Controller**: `leadController.createLead` validates input
7. **Service**: `leadService.createLead` inserts into database with `org_id` from token
8. **Response**: Returns created lead with `lead_id`
9. **Frontend**: Closes modal, refreshes lead list, shows success toast

---

## 🛡️ Security Features

### Multi-Tenant Isolation
- Every query includes `WHERE org_id = ?` or `WHERE tenant_id = ?`
- JWT token contains `tenant_id`
- Middleware automatically filters data by organization

### Authentication
- JWT tokens with 24-hour expiration
- Tokens stored in localStorage + httpOnly cookies
- Automatic logout on 401 responses

### Authorization
- Role-based middleware on all protected routes
- Frontend hides UI elements based on role
- Backend enforces permissions on every request

### Input Validation
- Frontend: Form validation before submission
- Backend: Express-validator on all endpoints
- SQL injection prevention: Parameterized queries

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd server
npm install
npm start
# Server runs on http://localhost:3000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Test Flow
1. Go to http://localhost:5173/register
2. Create organization (e.g., "Acme Corp")
3. Login with created credentials
4. Dashboard loads with stats
5. Navigate to Contacts, Leads, Tasks, Users
6. Create, edit, delete records (based on role)

---

## 📡 API Base URL

- **Development**: `http://localhost:3000/api`
- **Proxy**: Vite proxies `/api` to backend (configured in `vite.config.ts`)

---

## 🐛 Troubleshooting

### "ECONNREFUSED" Error
- **Cause**: Backend not running or wrong port
- **Fix**: Ensure backend is on port 3000, frontend proxy targets 3000

### "401 Unauthorized"
- **Cause**: Invalid/expired token
- **Fix**: Login again, check token in localStorage

### "403 Forbidden"
- **Cause**: Insufficient permissions
- **Fix**: Check user role, ensure proper RBAC middleware

### Empty Dashboard
- **Cause**: No data in database
- **Fix**: Create some leads, customers, tasks first

### CORS Errors
- **Cause**: Backend CORS not configured
- **Fix**: Check `app.js` has `cors({ origin: 'http://localhost:5173', credentials: true })`

---

## 📦 Dependencies

### Frontend
- React + TypeScript
- React Router (navigation)
- Axios (HTTP client)
- Lucide React (icons)
- Recharts (dashboard charts)

### Backend
- Express.js
- MySQL2
- JWT (jsonwebtoken)
- Bcrypt (password hashing)
- Express-validator
- Cookie-parser
- CORS

---

## ✨ Features Implemented

✅ Multi-tenant architecture
✅ JWT authentication
✅ Role-based access control
✅ Dashboard with real-time stats
✅ CRUD operations for all entities
✅ Pagination & filtering
✅ Search functionality
✅ Audit logging
✅ User management
✅ Profile settings
✅ Password management
✅ Responsive UI
✅ Loading states
✅ Error handling
✅ Toast notifications
✅ Modal forms
✅ Protected routes

---

## 🎯 Next Steps

- [ ] Add email notifications
- [ ] Implement file uploads
- [ ] Add export functionality (CSV/PDF)
- [ ] Real-time updates (WebSockets)
- [ ] Advanced filtering & sorting
- [ ] Bulk operations
- [ ] Activity timeline
- [ ] Reports & analytics
- [ ] Mobile app
- [ ] API rate limiting
