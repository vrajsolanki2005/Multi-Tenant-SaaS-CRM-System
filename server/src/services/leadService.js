const db = require('../config/db');

exports.createLead = async (tenant_id, created_by, data) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'INSERT INTO leads (tenant_id, title, status, value, customer_id, assigned_to) VALUES (?,?,?,?,?,?)',
            [tenant_id, data.title, data.status || 'new', data.value, data.customer_id, created_by]
        );
        await conn.commit();
        return { lead_id: result.insertId, ...data };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getLeads = async (tenant_id, filters) => {
    const conn = await db.getConnection();
    try {
        const { page = 1, limit = 10, status } = filters;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM leads WHERE tenant_id = ?';
        const params = [tenant_id];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ` ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        
        const [result] = await conn.query(query, params);
        return result;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.getLeadById = async (tenant_id, lead_id) => {
    const conn = await db.getConnection();
    try {
        const [result] = await conn.execute(
            'SELECT * FROM leads WHERE tenant_id = ? AND lead_id = ?',
            [tenant_id, lead_id]
        );
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.updateLead = async (tenant_id, lead_id, data) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        const updates = [];
        const values = [];
        
        if (data.title) {
            updates.push('title = ?');
            values.push(data.title);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.value !== undefined) {
            updates.push('value = ?');
            values.push(data.value);
        }
        if (data.customer_id !== undefined) {
            updates.push('customer_id = ?');
            values.push(data.customer_id);
        }
        
        if (updates.length === 0) return null;
        
        values.push(tenant_id, lead_id);
        
        const [result] = await conn.execute(
            `UPDATE leads SET ${updates.join(', ')} WHERE tenant_id = ? AND lead_id = ?`,
            values
        );
        
        await conn.commit();
        return result.affectedRows === 0 ? null : { lead_id, ...data };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.deleteLead = async (tenant_id, lead_id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'DELETE FROM leads WHERE tenant_id = ? AND lead_id = ?',
            [tenant_id, lead_id]
        );
        await conn.commit();
        return result.affectedRows === 0 ? null : true;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.assignLead = async (lead_id, tenant_id, user_id) => {
    await db.execute(
        'UPDATE leads SET assigned_to = ? WHERE id = ? AND tenant_id = ?',
        [user_id, lead_id, tenant_id]
    )
}

exports.updateAssignment = async (lead_id, tenant_id, user_id) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.execute(
            'UPDATE leads SET assigned_to = ? WHERE lead_id = ? AND tenant_id = ?',
            [user_id, lead_id, tenant_id]
        );
        await conn.commit();
        return result.affectedRows > 0;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};