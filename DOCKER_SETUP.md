# Docker Setup Guide

## Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Desktop running

## Quick Start

### 1. Start the Database
```bash
# From project root
docker-compose up -d
```

This will:
- Pull MySQL 8.0 image
- Create `saas_crm` database
- Initialize all tables (org, users, customers, leads, tasks, audit_logs)
- Create indexes
- Expose MySQL on port 3306

### 2. Verify Database is Running
```bash
docker-compose ps
```

You should see `saas_crm_db` with status "Up"

### 3. Update Backend .env File
```bash
cd server
cp .env.example .env
```

Make sure your `.env` has:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=saas_crm
DB_PORT=3306
JWT_SECRET=your_jwt_secret_here
```

### 4. Start Backend
```bash
cd server
npm install
npm start
```

### 5. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Useful Docker Commands

### Stop Database
```bash
docker-compose down
```

### Reset Database (Fresh Start)
```bash
docker-compose down -v
docker-compose up -d
```

### View Database Logs
```bash
docker-compose logs -f mysql
```

### Access MySQL Shell
```bash
docker exec -it saas_crm_db mysql -u root -proot123 saas_crm
```

### Check Database Health
```bash
docker-compose ps
```

## Troubleshooting

### Port 3306 Already in Use
If you have MySQL Workbench or local MySQL running:

**Option 1:** Stop local MySQL
```bash
# Windows
net stop MySQL80

# Or stop from Services
```

**Option 2:** Change Docker port in `docker-compose.yml`
```yaml
ports:
  - "3307:3306"  # Use 3307 instead
```

Then update `.env`:
```env
DB_PORT=3307
```

### Database Not Initializing
```bash
# Remove volumes and restart
docker-compose down -v
docker volume prune
docker-compose up -d
```

### Connection Refused
Wait 10-15 seconds after `docker-compose up` for MySQL to fully start.

## For Your Friend

### First Time Setup
```bash
# 1. Clone repository
git clone <your-repo-url>
cd Multi-Tenant-SaaS-CRM-System

# 2. Start database
docker-compose up -d

# 3. Setup backend
cd server
npm install
cp .env.example .env
npm start

# 4. Setup frontend (in new terminal)
cd frontend
npm install
npm run dev
```

### Daily Workflow
```bash
# Start everything
docker-compose up -d
cd server && npm start
# In another terminal: cd frontend && npm run dev

# Stop everything
docker-compose down
```

## Benefits of This Setup

✅ **Same database version** - Both use MySQL 8.0  
✅ **No installation needed** - Just Docker  
✅ **Consistent data** - Same schema, same structure  
✅ **Easy reset** - `docker-compose down -v` for fresh start  
✅ **Isolated** - Won't conflict with other projects  
✅ **Version controlled** - Schema changes tracked in Git  

## Database Credentials

- **Host:** localhost
- **Port:** 3306
- **User:** root
- **Password:** root123
- **Database:** saas_crm

## Notes

- Database data persists in Docker volume `mysql_data`
- Schema is in `server/database/init-all.sql`
- Changes to `init-all.sql` require database reset to apply
