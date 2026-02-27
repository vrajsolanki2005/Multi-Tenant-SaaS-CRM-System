# Multi-Tenant-SaaS-CRM-System
# backend
server/
│
├── src/
│   │
│   ├── server.js               # Entry point
│   ├── app.js                  # Express config
│   │
│   ├── config/
│   │   ├── db.js               # MySQL pool connection
│   │   └── env.js              # Environment loader
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── lead.routes.js
│   │   └── customer.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── lead.controller.js
│   │   └── customer.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── lead.service.js
│   │   └── customer.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── rbac.middleware.js
│   │   ├── tenant.middleware.js
│   │   ├── error.middleware.js
│   │   └── rateLimit.middleware.js
│   │
│   ├── queries/                 # SQL query files (optional but clean)
│   │   ├── user.queries.js
│   │   ├── lead.queries.js
│   │   └── customer.queries.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── hash.js
│   │   ├── logger.js
│   │   └── constants.js
│   │
│   └── validations/
│       ├── auth.validation.js
│       ├── user.validation.js
│       └── lead.validation.js
│
├── .env
├── package.json
└── nodemon.json

# client
client/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.js
│   │   ├── auth.api.js
│   │   ├── user.api.js
│   │   └── lead.api.js
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   └── crm/
│   │       ├── LeadCard.jsx
│   │       └── LeadForm.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── RegisterOrg.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Leads.jsx
│   │   ├── Customers.jsx
│   │   └── Settings.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useRole.js
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── utils/
│   │   └── roleHelper.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js (or CRA config)
