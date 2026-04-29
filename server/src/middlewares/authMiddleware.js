const jwt = require('jsonwebtoken');
const sessionService = require('../services/sessionService');

exports.authMiddleware = (req, res, next) => {
    let token = req.cookies.token;
    
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Access Denied! No token provided' });
    }
    
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret || jwtSecret === 'gemini' || jwtSecret === 'CHANGE_THIS_TO_SECURE_RANDOM_STRING_MIN_32_CHARS') {
            console.error('CRITICAL SECURITY ERROR: JWT_SECRET not properly configured!');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        const decoded = jwt.verify(token, jwtSecret);
        
        // Validate session
        if (decoded.session_id && !sessionService.validateSession(decoded.session_id)) {
            return res.status(401).json({ message: 'Session expired or invalid' });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Error:', error);
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
