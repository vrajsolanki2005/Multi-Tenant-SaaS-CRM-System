# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Generate JWT Secret
```bash
cd server
node generate-jwt-secret.js
```

Copy the generated secret and add it to `.env` in the root directory:
```env
JWT_SECRET=your_generated_secret_here
```

### 2. Start All Services
```bash
# From project root
docker-compose up -d
```

This starts:
- **MySQL** (port 3306)
- **Redis** (port 6379)
- **Backend** (port 3000)
- **Frontend** (port 80)

### 3. Access Application
```
http://localhost
```

## Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
docker-compose logs -f redis
```

### Rebuild After Code Changes
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Check Service Status
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend
docker-compose exec backend sh

# MySQL
docker-compose exec mysql mysql -u root -p

# Redis
docker-compose exec redis redis-cli
```

## Database Initialization

The database is automatically initialized on first run using scripts in `server/database/`:
- `create_db.sql` - Creates database and tables
- `init-all.sql` - Additional initialization

To reinitialize:
```bash
docker-compose down -v  # Remove volumes
docker-compose up -d    # Restart with fresh DB
```

## Environment Variables

### Backend (.env in root)
```env
JWT_SECRET=your_secure_secret_here
```

### Docker Compose (automatic)
- `DB_HOST=mysql`
- `DB_USER=root`
- `DB_PASSWORD=rootpassword`
- `DB_NAME=saas_crm`
- `REDIS_HOST=redis`
- `REDIS_PORT=6379`

## Troubleshooting

### Backend can't connect to MySQL
```bash
# Check MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Wait for MySQL to be ready (automatic with healthcheck)
```

### Frontend can't reach backend
```bash
# Check backend logs
docker-compose logs backend

# Verify backend is running
curl http://localhost:3000/api/health
```

### Port already in use
```bash
# Change ports in docker-compose.yml
ports:
  - "8080:80"  # Frontend
  - "3001:3000"  # Backend
```

### Clear all data and restart
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

### Update docker-compose.yml
```yaml
environment:
  DB_PASSWORD: ${DB_PASSWORD}  # Use secrets
  JWT_SECRET: ${JWT_SECRET}
  NODE_ENV: production
```

### Use Docker Secrets (Swarm)
```bash
echo "your_secret" | docker secret create jwt_secret -
```

### Enable HTTPS
Add Nginx reverse proxy or use Traefik for SSL termination.

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ :80
┌──────▼──────────┐
│  Frontend       │
│  (Nginx)        │
└──────┬──────────┘
       │ /api → :3000
┌──────▼──────────┐
│  Backend        │
│  (Node.js)      │
└──┬───────────┬──┘
   │           │
   │ :3306     │ :6379
┌──▼────┐  ┌──▼────┐
│ MySQL │  │ Redis │
└───────┘  └───────┘
```

## Volumes

Persistent data stored in Docker volumes:
- `mysql_data` - Database files
- `redis_data` - Cache data

View volumes:
```bash
docker volume ls
```

Remove volumes:
```bash
docker-compose down -v
```
