# Docker Deployment Guide

## Prerequisites

- Docker installed (version 20.10+)
- Docker Compose installed (version 2.0+)

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d
```

This will start:
- **MySQL Database** on port 3306
- **Backend API** on port 3000
- **Frontend** on port 80

### 2. Access the Application

Open your browser and navigate to:
```
http://localhost
```

The frontend will automatically proxy API requests to the backend.

### 3. Check Service Status

```bash
docker-compose ps
```

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

## Database Initialization

The database is automatically initialized with the schema from `server/database/init-all.sql` when the MySQL container starts for the first time.

## Environment Variables

Backend environment variables are configured in `docker-compose.yml`:

- `DB_HOST`: MySQL host (default: mysql)
- `DB_USER`: Database user (default: root)
- `DB_PASSWORD`: Database password (default: rootpassword)
- `DB_NAME`: Database name (default: saas_crm)
- `DB_PORT`: Database port (default: 3306)
- `JWT_SECRET`: JWT secret key (default: gemini)

**⚠️ IMPORTANT**: Change these values for production deployment!

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## Rebuilding After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` and change:
- `MYSQL_ROOT_PASSWORD`
- `DB_PASSWORD`
- `JWT_SECRET`

### 2. Use Production Build

The Dockerfiles are already optimized for production:
- Backend: Uses `npm ci --only=production`
- Frontend: Multi-stage build with nginx

### 3. Enable HTTPS

For production, add an nginx reverse proxy or use a service like:
- AWS Application Load Balancer
- Cloudflare
- Let's Encrypt with Certbot

## Troubleshooting

### Backend can't connect to database

```bash
# Check if MySQL is healthy
docker-compose ps

# Check MySQL logs
docker-compose logs mysql

# Restart services
docker-compose restart backend
```

### Frontend shows connection errors

```bash
# Check backend logs
docker-compose logs backend

# Verify backend is running
curl http://localhost:3000/api/health
```

### Database data persistence

Database data is stored in a Docker volume named `mysql_data`. To backup:

```bash
# Backup
docker exec crm-mysql mysqldump -u root -prootpassword saas_crm > backup.sql

# Restore
docker exec -i crm-mysql mysql -u root -prootpassword saas_crm < backup.sql
```

## Development Mode

For development with hot-reload:

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ http://localhost
       ▼
┌─────────────┐
│  Frontend   │ (nginx on port 80)
│  Container  │
└──────┬──────┘
       │ /api → http://backend:3000
       ▼
┌─────────────┐
│   Backend   │ (Node.js on port 3000)
│  Container  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    MySQL    │ (port 3306)
│  Container  │
└─────────────┘
```

## Useful Commands

```bash
# Enter backend container
docker exec -it crm-backend sh

# Enter MySQL container
docker exec -it crm-mysql mysql -u root -p

# View resource usage
docker stats

# Clean up unused images
docker system prune -a
```
