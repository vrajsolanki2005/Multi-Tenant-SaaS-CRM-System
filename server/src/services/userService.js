const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.createUser = async (tenant_id, userData) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [existing] = await conn.execute(
            'SELECT user_id FROM users WHERE tenant_id = ? AND user_email = ?',
            [tenant_id, userData.user_email]
        );
        
        if (existing.length > 0) {
            const error = new Error('User with this email already exists');
            error.code = 'DUPLICATE_USER';
            throw error;
        }

        const hashedPassword = await bcrypt.hash(userData.user_password, 10);

        const [result] = await conn.execute(
            'INSERT INTO users (tenant_id, user_name, user_email, user_password, user_role) VALUES (?,?,?,?,?)',
            [tenant_id, userData.user_name, userData.user_email, hashedPassword, userData.user_role || 'sales']
        );
        
        await conn.commit();
        return result.insertId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}
exports.getAllUsers = async (tenant_id, filters = {}) => {
    const { page = 1, limit = 10, search, role, is_active } = filters;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    
    let query = 'SELECT user_id, user_name, user_email, user_role, is_active, created_at FROM users WHERE tenant_id = ?';
    const params = [tenant_id];
    
    if (search) {
        query += ' AND (user_name LIKE ? OR user_email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    
    if (role) {
        query += ' AND user_role = ?';
        params.push(role);
    }
    
    if (is_active !== undefined) {
        query += ' AND is_active = ?';
        params.push(is_active);
    }
    
    const countQuery = query.replace('SELECT user_id, user_name, user_email, user_role, is_active, created_at', 'SELECT COUNT(*) as total');
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNum, offset);
    
    const [users] = await db.execute(query, params);
    
    return {
        users,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum)
        }
    };
}
exports.getUserById = async (tenant_id, user_id) => {
    const [rows] = await db.execute(
        'SELECT user_id, user_name, user_email, user_role, is_active, created_at, updated_at FROM users WHERE tenant_id = ? AND user_id = ?',
        [tenant_id, user_id]
    );
    return rows.length > 0 ? rows[0] : null;
}
exports.updateUser = async (tenant_id, user_id, updateData) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [existing] = await conn.execute(
            'SELECT user_id FROM users WHERE tenant_id = ? AND user_id = ?',
            [tenant_id, user_id]
        );
        
        if (existing.length === 0) {
            return null;
        }

        if (updateData.user_email) {
            const [duplicate] = await conn.execute(
                'SELECT user_id FROM users WHERE tenant_id = ? AND user_email = ? AND user_id != ?',
                [tenant_id, updateData.user_email, user_id]
            );
            if (duplicate.length > 0) {
                const error = new Error('Email already in use');
                error.code = 'DUPLICATE_EMAIL';
                throw error;
            }
        }

        const updates = [];
        const values = [];

        if (updateData.user_name) {
            updates.push('user_name = ?');
            values.push(updateData.user_name);
        }
        if (updateData.user_email) {
            updates.push('user_email = ?');
            values.push(updateData.user_email);
        }
        if (updateData.user_role) {
            updates.push('user_role = ?');
            values.push(updateData.user_role);
        }
        if (updateData.is_active !== undefined) {
            updates.push('is_active = ?');
            values.push(updateData.is_active);
        }
        if (updateData.user_password) {
            const hashedPassword = await bcrypt.hash(updateData.user_password, 10);
            updates.push('user_password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return null;
        }

        values.push(tenant_id, user_id);

        await conn.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE tenant_id = ? AND user_id = ?`,
            values
        );

        await conn.commit();
        
        const [updated] = await conn.execute(
            'SELECT user_id, user_name, user_email, user_role, is_active FROM users WHERE tenant_id = ? AND user_id = ?',
            [tenant_id, user_id]
        );
        
        return updated[0];
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

exports.deleteUser = async (tenant_id, user_id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const [result] = await conn.execute(
            'DELETE FROM users WHERE tenant_id = ? AND user_id = ?',
            [tenant_id, user_id]
        );

        await conn.commit();
        return result.affectedRows > 0;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}
