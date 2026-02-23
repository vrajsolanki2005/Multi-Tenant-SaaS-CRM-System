const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/auth.routes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes)

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

module.exports = app;