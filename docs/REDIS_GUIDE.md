# Redis Caching Implementation

## Overview
Redis caching has been implemented with tenant-isolated keys and automatic cache invalidation.

## Features
- **Tenant Isolation**: Cache keys prefixed with `tenant_id` to prevent cross-tenant data leaks
- **Auto-Invalidation**: Cache cleared on CREATE/UPDATE/DELETE operations
- **5-minute TTL**: Default cache expiration of 300 seconds
- **GET-only Caching**: Only caches GET requests

## Files Added
- `server/src/config/redis.js` - Redis client configuration
- `server/src/middlewares/cache.js` - Cache middleware and invalidation

## Files Modified
- `server/src/routes/leads.routes.js` - Added cache to GET endpoints
- `server/src/routes/customers.routes.js` - Added cache to GET endpoints
- `server/src/services/leadService.js` - Added cache invalidation
- `server/.env` - Added Redis config
- `docker-compose.yml` - Added Redis service

## Usage

### Start Redis (Docker)
```bash
docker-compose up -d redis
```

### Start Redis (Local)
```bash
# Windows
# Download from https://github.com/microsoftarchive/redis/releases
redis-server

# Linux/Mac
redis-server
```

### Test Cache
```bash
# First request (cache miss)
curl http://localhost:3000/api/leads

# Second request (cache hit - faster)
curl http://localhost:3000/api/leads
```

### Monitor Redis
```bash
redis-cli monitor
```

## Cache Keys Format
```
{tenant_id}:/api/leads?page=1&limit=10
{tenant_id}:/api/customers/:id
```

## Invalidation Strategy
- **Create Lead/Customer**: Clears all `/api/leads*` or `/api/customers*` for tenant
- **Update Lead/Customer**: Clears all `/api/leads*` or `/api/customers*` for tenant
- **Delete Lead/Customer**: Clears all `/api/leads*` or `/api/customers*` for tenant

## Add Cache to Other Routes
```javascript
const { cache } = require('../middlewares/cache');

// Add to GET routes
router.get('/tasks', cache(300), taskController.getTasks);
```

## Add Invalidation to Services
```javascript
const { invalidateCache } = require('../middlewares/cache');

// After mutations
await invalidateCache(tenant_id, '/api/tasks*');
```

## Environment Variables
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```
