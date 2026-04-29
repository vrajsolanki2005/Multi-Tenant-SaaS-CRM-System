const jwt = require('jsonwebtoken');

class SessionService {
    constructor() {
        this.activeSessions = new Map(); // In production, use Redis
    }

    // Create session with unique identifier
    createSession(userId, tenantId, userRole, userName, userEmail) {
        const sessionId = this.generateSessionId();
        const jwtSecret = process.env.JWT_SECRET;
        
        if (!jwtSecret || jwtSecret === 'gemini' || jwtSecret === 'CHANGE_THIS_TO_SECURE_RANDOM_STRING_MIN_32_CHARS') {
            throw new Error('JWT_SECRET must be configured with a secure random string');
        }
        
        const token = jwt.sign(
            { 
                user_id: userId, 
                tenant_id: tenantId, 
                user_role: userRole,
                user_name: userName,
                user_email: userEmail,
                session_id: sessionId
            },
            jwtSecret,
            { expiresIn: '24h' }
        );

        // Store session metadata
        this.activeSessions.set(sessionId, {
            userId,
            tenantId,
            userRole,
            createdAt: new Date(),
            lastActivity: new Date()
        });

        return { token, sessionId };
    }

    // Validate session
    validateSession(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) return false;

        // Update last activity
        session.lastActivity = new Date();
        return true;
    }

    // Invalidate session
    invalidateSession(sessionId) {
        return this.activeSessions.delete(sessionId);
    }

    // Get user sessions
    getUserSessions(userId) {
        const sessions = [];
        for (const [sessionId, session] of this.activeSessions) {
            if (session.userId === userId) {
                sessions.push({ sessionId, ...session });
            }
        }
        return sessions;
    }

    // Generate unique session ID
    generateSessionId() {
        return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Cleanup expired sessions
    cleanupExpiredSessions() {
        const now = new Date();
        const expireTime = 24 * 60 * 60 * 1000; // 24 hours

        for (const [sessionId, session] of this.activeSessions) {
            if (now - session.lastActivity > expireTime) {
                this.activeSessions.delete(sessionId);
            }
        }
    }
}

module.exports = new SessionService();