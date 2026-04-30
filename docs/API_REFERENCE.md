# API Endpoints Quick Reference

## 🔐 Authentication (Public)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/create-org` | Create organization | `{ name, adminName, email, password }` |
| POST | `/api/auth/login` | Login | `{ email, password }` |

---

## 📊 Dashboard (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | All |

---

## 👥 Customers (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/customers` | List customers | All |
| GET | `/api/customers/:id` | Get customer by ID | All |
| POST | `/api/customers` | Create customer | Admin, Manager |
| PUT | `/api/customers/:id` | Update customer | Admin, Manager |
| DELETE | `/api/customers/:id` | Delete customer | Admin |

**Query Params**: `?page=1&limit=15`

---

## 🎯 Leads (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leads` | List leads | All |
| GET | `/api/leads/:id` | Get lead by ID | All |
| POST | `/api/leads` | Create lead | Admin, Manager |
| PUT | `/api/leads/:id` | Update lead | Admin, Manager |
| PUT | `/api/leads/:id/assign` | Assign lead to user | Admin |
| DELETE | `/api/leads/:id` | Delete lead | Admin |

**Query Params**: `?page=1&limit=15&status=new`

---

## ✅ Tasks (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | List tasks | All |
| GET | `/api/tasks/:id` | Get task by ID | All |
| POST | `/api/tasks` | Create task | Admin, Manager |
| PUT | `/api/tasks/:id` | Update task | Admin, Manager |
| DELETE | `/api/tasks/:id` | Delete task | Admin |

**Query Params**: `?page=1&limit=15&status=pending&priority=high`

---

## 👤 Users (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List users | All |
| GET | `/api/users/:id` | Get user by ID | All |
| POST | `/api/create-user` | Create user | Admin, Manager |
| PUT | `/api/users/:id` | Update user | Admin, Manager |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PUT | `/api/me` | Update own profile | Self |
| PUT | `/api/me/password` | Change password | Self |
| DELETE | `/api/me` | Delete own account | Self |

**Query Params**: `?page=1&limit=15&role=sales&status=active`

---

## 📝 Audit Logs (Protected)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/audit-logs` | List audit logs | Admin |

**Query Params**: `?page=1&limit=20&action=CREATE&entity=leads`

---

## 🔑 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

Or token in httpOnly cookie (automatically sent by browser).

---

## 📦 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 15,
    "total": 120,
    "totalPages": 8
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

---

## 🎯 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 500 | Internal Server Error |

---

## 🔒 Role Permissions

| Role | Create | Read | Update | Delete |
|------|--------|------|--------|--------|
| **Admin** | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ❌ |
| **Sales** | ❌ | ✅ | ❌ | ❌ |

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/create-org \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp","adminName":"John Doe","email":"john@acme.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@acme.com","password":"password123"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:3000/api/dashboard/stats \
  -H "Authorization: Bearer <your_token>"
```

### Create Customer
```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com","phone":"+1234567890"}'
```

### Create Lead
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Business Opportunity","status":"new","value":50000}'
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{"task_name":"Follow up with client","priority":"high","due_date":"2024-12-31"}'
```

---

## 🌐 Frontend API Calls

All API calls are in `frontend/src/api/` directory:

- `auth.ts` - Authentication
- `dashboard.ts` - Dashboard stats
- `customers.ts` - Customer operations
- `leads.ts` - Lead operations
- `tasks.ts` - Task operations
- `users.ts` - User operations
- `audit.ts` - Audit logs
- `axios.ts` - Axios configuration with interceptors
