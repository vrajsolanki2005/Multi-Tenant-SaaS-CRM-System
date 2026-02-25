const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/auth.routes');
const testRoutes = require('./routes/test.routes');
const customerRoutes = require('./routes/customers.routes');

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
app.use('/api/test', testRoutes)
app.use('/api', customerRoutes)

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

module.exports = app;