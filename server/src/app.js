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

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

module.exports = app;