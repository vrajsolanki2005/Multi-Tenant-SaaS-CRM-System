const jwt = require('jsonwebtoken');

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
        const decoded = jwt.verify(token, 'gemini');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
