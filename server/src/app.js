const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware


// Routes


// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

module.exports = app;