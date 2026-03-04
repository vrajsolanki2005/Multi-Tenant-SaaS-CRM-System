// Optional: Install express-rate-limit
// npm install express-rate-limit

const rateLimit = require('express-rate-limit');

// General API rate limiter
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for user creation
exports.createUserLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 user creations per hour
    message: {
        success: false,
        message: 'Too many accounts created, please try again later.'
    },
    skipSuccessfulRequests: false,
});

// Auth endpoints limiter
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 failed attempts
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.'
    },
    skipSuccessfulRequests: true,
});

// Usage in routes:
// const { apiLimiter, createUserLimiter } = require('../middlewares/rateLimiter');
// router.post('/create-user', createUserLimiter, authMiddleware, ...);
