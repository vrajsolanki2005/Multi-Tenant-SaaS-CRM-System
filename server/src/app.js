const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes')
const testRoutes = require('./routes/test.routes');
const customerRoutes = require('./routes/customers.routes');
const leadRoutes = require('./routes/leads.routes');
const taskRoutes = require('./routes/tasks.routes');
const auditRoutes = require('./routes/audit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const notificationRoutes = require('./routes/notifications.routes');
const landingRoutes = require('./routes/landing.routes');

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/', userRoutes)
app.use('/api/test', testRoutes)
app.use('/api', customerRoutes)
app.use('/api', leadRoutes)
app.use('/api', taskRoutes)
app.use('/api/audit-logs', auditRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/landing', landingRoutes)

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    
    // Default error status and message
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    
    // Don't leak stack traces in production
    const response = {
        success: false,
        message: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    };
    
    // Handle specific error types
    if (err.code === 'ER_DUP_ENTRY') {
        response.message = 'Duplicate entry: Resource already exists';
        return res.status(409).json(response);
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        response.message = 'Invalid reference: Related resource does not exist';
        return res.status(400).json(response);
    }
    
    if (err.name === 'ValidationError') {
        return res.status(400).json(response);
    }
    
    if (err.name === 'JsonWebTokenError') {
        response.message = 'Invalid authentication token';
        return res.status(401).json(response);
    }
    
    if (err.name === 'TokenExpiredError') {
        response.message = 'Authentication token expired';
        return res.status(401).json(response);
    }
    
    // Generic error response
    res.status(statusCode).json(response);
});

module.exports = app;