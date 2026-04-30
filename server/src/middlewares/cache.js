const redisClient = require('../config/redis');

const cache = (duration = 300) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') return next();

        const key = `${req.user.tenant_id}:${req.originalUrl}`;
        
        try {
            const cached = await redisClient.get(key);
            if (cached) {
                return res.json(JSON.parse(cached));
            }
            
            res.originalJson = res.json;
            res.json = function(data) {
                redisClient.setEx(key, duration, JSON.stringify(data));
                res.originalJson(data);
            };
            next();
        } catch (err) {
            console.error('Cache error:', err);
            next();
        }
    };
};

const invalidateCache = async (tenantId, pattern = '*') => {
    try {
        const keys = await redisClient.keys(`${tenantId}:${pattern}`);
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (err) {
        console.error('Cache invalidation error:', err);
    }
};

module.exports = { cache, invalidateCache };
