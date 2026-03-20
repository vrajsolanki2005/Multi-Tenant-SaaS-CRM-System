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
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gemini');
        
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
