# Multi-Tenant-SaaS-CRM-System
server/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   ├── redis.js
│   │   └── env.js
│   │
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Organization.model.js
│   │   ├── Lead.model.js
│   │   ├── Customer.model.js
│   │   ├── Task.model.js
│   │   └── AuditLog.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── org.routes.js
│   │   ├── user.routes.js
│   │   ├── lead.routes.js
│   │   ├── customer.routes.js
│   │   ├── task.routes.js
│   │   └── analytics.routes.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── org.controller.js
│   │   ├── user.controller.js
│   │   ├── lead.controller.js
│   │   ├── customer.controller.js
│   │   ├── task.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── tenant.service.js
│   │   ├── lead.service.js
│   │   ├── analytics.service.js
│   │   └── audit.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── tenant.middleware.js
│   │   ├── rbac.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   ├── constants.js
│   │   └── logger.js
│   │
│   └── validations/
│       ├── auth.validation.js
│       ├── lead.validation.js
│       └── user.validation.js
│
├── Dockerfile
├── package.json
└── .env
