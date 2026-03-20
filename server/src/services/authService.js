const db = require('../config/db');
const bcrypt = require('bcrypt');
const sessionService = require('./sessionService');

//create-org
exports.createOrg = async(name, adminName, email, password) =>{
    const conn = await db.getConnection();
    try{
        await conn.beginTransaction();

        //generate hash pass
        const salt = await bcrypt.genSalt(10);
        const hp = await bcrypt.hash(password, salt);

        //create org
        const [orgresult] = await conn.execute('INSERT INTO org (name) VALUES (?)', [name]);
        const newOrgId = orgresult.insertId;

        //create/update user(admin) 
        const[userResult] = await conn.execute('INSERT INTO users (tenant_id, user_name, user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)',
             [newOrgId, adminName, email, hp, 'admin'])

        await conn.commit();

        return {id: newOrgId, user_id: userResult.insertId};
    }
    catch(error){
        await conn.rollback();
        throw error;
    }
    finally{
        conn.release();
    }
}

//login with session management
exports.login = async (email, password) => {
    const conn = await db.getConnection();
    try {
        // Explicitly select needed columns including user_name
        const [users] = await conn.execute(
            'SELECT user_id, tenant_id, user_name, user_email, user_password, user_role FROM users WHERE user_email = ?', 
            [email]
        );

        if (users.length === 0) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.user_password);
        
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Create session instead of direct JWT
        const { token, sessionId } = sessionService.createSession(
            user.user_id,
            user.tenant_id,
            user.user_role,
            user.user_name,
            user.user_email
        );

        return { 
            user_id: user.user_id, 
            org_id: user.tenant_id, 
            token,
            sessionId,
            user: {
                id: user.user_id,
                name: user.user_name,
                email: user.user_email,
                role: user.user_role,
                tenant_id: user.tenant_id
            }
        };
    } finally {
        conn.release();
    }
}

// Logout with session cleanup
exports.logout = async (sessionId) => {
    return sessionService.invalidateSession(sessionId);
}
