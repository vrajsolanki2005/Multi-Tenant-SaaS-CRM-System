# Quick Start Guide - Secure Setup

## Prerequisites
- Node.js 14+ installed
- MySQL 8+ installed and running
- Git installed

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Multi-Tenant-SaaS-CRM-System
```

### 2. Backend Setup

#### 2.1 Install Dependencies
```bash
cd server
npm install
```

#### 2.2 Generate Secure JWT Secret ⚠️ CRITICAL
```bash
node generate-jwt-secret.js
```

Copy the generated secret (it will look like a long random string).

#### 2.3 Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update these values:
# - DB_HOST=localhost (or your MySQL host)
# - DB_USER=root (or your MySQL user)
# - DB_PASSWORD=your_mysql_password
# - DB_NAME=saas_crm
# - JWT_SECRET=<paste the generated secret here>
# - NODE_ENV=development
```

#### 2.4 Initialize Database
```bash
# Login to MySQL
mysql -u root -p

# Run the initialization script
source database/init-all.sql

# Or manually:
# CREATE DATABASE saas_crm;
# USE saas_crm;
# source database/tables/org.sql
# source database/tables/users.sql
# source database/tables/customers.sql
# source database/tables/leads.sql
# source database/tables/tasks.sql
# source database/tables/audit_logs.sql
# source database/tables/notifications.sql
# source database/indexing.sql
```

#### 2.5 Start Backend Server
```bash
npm start
```

You should see:
```
✓ Environment variables validated
✓ Database Connected Successfully!
✓ Server is running on port 3000
✓ Task scheduler started
✓ Notification scheduler started
```

### 3. Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../frontend
npm install
```

#### 3.2 Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Test the Application

#### 4.1 Create an Organization
```bash
curl -X POST http://localhost:3000/api/auth/create-org \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Organization",
    "adminName": "Admin User",
    "email": "admin@test.com",
    "password": "SecurePass123"
  }'
```

#### 4.2 Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123"
  }'
```

Save the returned token for authenticated requests.

#### 4.3 Access the UI
Open your browser and navigate to:
```
http://localhost:5173
```

Login with:
- Email: `admin@test.com`
- Password: `SecurePass123`

## Common Issues

### Issue: "JWT_SECRET must be configured"
**Solution**: You forgot to generate and set the JWT secret. Run:
```bash
cd server
node generate-jwt-secret.js
```
Then update your `.env` file with the generated secret.

### Issue: "Database connection failed"
**Solution**: 
1. Ensure MySQL is running: `mysql -u root -p`
2. Check your `.env` database credentials
3. Verify the database exists: `SHOW DATABASES;`

### Issue: "Too many login attempts"
**Solution**: Rate limiting is working! Wait 15 minutes or restart the server to reset.

### Issue: Port 3000 or 5173 already in use
**Solution**: 
```bash
# For backend (port 3000)
PORT=3001 npm start

# For frontend (port 5173)
# Edit vite.config.ts and change the port
```

## Security Checklist

Before deploying to production:

- [ ] Generated a secure JWT secret (minimum 32 characters)
- [ ] Changed all default passwords
- [ ] Updated CORS origins in `server/src/app.js`
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enabled HTTPS/SSL
- [ ] Configured firewall rules
- [ ] Set up database backups
- [ ] Reviewed [SECURITY_FIXES.md](SECURITY_FIXES.md)

## Next Steps

1. Read [SECURITY_FIXES.md](SECURITY_FIXES.md) for critical security information
2. Review [API_REFERENCE.md](API_REFERENCE.md) for API documentation
3. Check [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for integration details
4. Explore the codebase and customize as needed

## Development Workflow

```bash
# Backend development with auto-reload
cd server
npm run dev

# Frontend development with hot reload
cd frontend
npm run dev

# Run both simultaneously (use two terminals)
```

## Production Deployment

See [SECURITY_FIXES.md](SECURITY_FIXES.md) for production deployment checklist.

For Docker deployment, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md) (if available).

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Review the security documentation

## Important Files

- `server/.env` - Environment configuration (DO NOT COMMIT)
- `server/generate-jwt-secret.js` - JWT secret generator
- `SECURITY_FIXES.md` - Critical security information
- `README.md` - Project overview
- `API_REFERENCE.md` - API documentation
