const db = require('../config/db');

exports.createLead = async (tenant_id, created_by, data) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        // Use assigned_to from data if provided, otherwise set to null (not created_by)
        const assignedTo = data.assigned_to !== undefined ? data.assigned_to : null;
        
        console.log('LeadService - Creating lead with assigned_to:', assignedTo);
        
        const [result] = await conn.execute(
            'INSERT INTO leads (tenant_id, title, status, value, customer_id, assigned_to) VALUES (?,?,?,?,?,?)',
            [tenant_id, data.title, data.status || 'new', data.value, data.customer_id, assignedTo]
        );
        await conn.commit();
        return { lead_id: result.insertId, ...data, assigned_to: assignedTo };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getLeads = async (tenant_id, filters, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        const { page = 1, limit = 10, status } = filters;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT * FROM leads WHERE tenant_id = ?';
        const params = [tenant_id];
        
        // Sales users can only see leads assigned to them
        if (role === 'sales' && user_id) {
            query += ' AND assigned_to = ?';
            params.push(user_id);
        }
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));
        
        const [result] = await conn.query(query, params);
        return result;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.getLeadById = async (tenant_id, lead_id, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        let query = 'SELECT * FROM leads WHERE tenant_id = ? AND lead_id = ?';
        const params = [tenant_id, lead_id];
        
        // Sales users can only see leads assigned to them
        if (role === 'sales' && user_id) {
            query += ' AND assigned_to = ?';
            params.push(user_id);
        }
        
        const [result] = await conn.execute(query, params);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.updateLead = async (tenant_id, lead_id, data, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        // Check if lead is converted/closed and trying to change status
        if (data.status) {
            const [currentLead] = await conn.execute(
                'SELECT status FROM leads WHERE lead_id = ? AND tenant_id = ?',
                [lead_id, tenant_id]
            );
            
            if (currentLead.length > 0 && 
                (currentLead[0].status === 'converted' || currentLead[0].status === 'closed') && 
                data.status !== currentLead[0].status) {
                await conn.rollback();
                throw new Error('Cannot change status of a converted or closed lead');
            }
        }
        
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
        if (data.assigned_to !== undefined) {
            updates.push('assigned_to = ?');
            values.push(data.assigned_to);
        }
        
        if (updates.length === 0) return null;
        
        values.push(tenant_id, lead_id);
        
        let query = `UPDATE leads SET ${updates.join(', ')} WHERE tenant_id = ? AND lead_id = ?`;
        
        // Sales users can only update leads assigned to them
        if (role === 'sales' && user_id) {
            query += ' AND assigned_to = ?';
            values.push(user_id);
        }
        
        const [result] = await conn.execute(query, values);
        
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
        'UPDATE leads SET assigned_to = ? WHERE lead_id = ? AND tenant_id = ?',
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