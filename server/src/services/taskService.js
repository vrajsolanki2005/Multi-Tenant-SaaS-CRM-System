const db = require('../config/db');

exports.createTask = async (tenant_id, data) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.execute(
            `INSERT INTO tasks (task_name, description, status, priority, due_date, lead_id, assigned_to, tenant_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.task_name, data.description, data.status || 'pending', data.priority || 'medium', 
             data.due_date, data.lead_id, data.assigned_to, tenant_id]
        );
        await conn.commit();
        return result.insertId;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.getTasks = async (tenant_id, filters = {}) => {
    const conn = await db.getConnection();
    try {
        const { status, priority, assigned_to, overdue, page = 1, limit = 20 } = filters;
        const offset = (page - 1) * limit;
        
        let query = 'SELECT *, CASE WHEN due_date < NOW() AND status != "completed" THEN 1 ELSE 0 END as is_overdue FROM tasks WHERE tenant_id = ?';
        const params = [tenant_id];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND priority = ?';
            params.push(priority);
        }
        if (assigned_to) {
            query += ' AND assigned_to = ?';
            params.push(assigned_to);
        }
        if (overdue === 'true') {
            query += ' AND due_date < NOW() AND status != "completed"';
        }
        
        query += ` ORDER BY priority DESC, due_date ASC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        
        const [rows] = await conn.query(query, params);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.getTaskById = async (tenant_id, task_id) => {
    const conn = await db.getConnection();
    try {
        const [rows] = await conn.execute(
            'SELECT *, CASE WHEN due_date < NOW() AND status != "completed" THEN 1 ELSE 0 END as is_overdue FROM tasks WHERE task_id = ? AND tenant_id = ?',
            [task_id, tenant_id]
        );
        return rows[0];
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.updateTask = async (tenant_id, task_id, data, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        const updates = [];
        const values = [];
        
        if (data.task_name) {
            updates.push('task_name = ?');
            values.push(data.task_name);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.status) {
            updates.push('status = ?');
            values.push(data.status);
        }
        if (data.priority) {
            updates.push('priority = ?');
            values.push(data.priority);
        }
        if (data.due_date !== undefined) {
            updates.push('due_date = ?');
            values.push(data.due_date);
        }
        if (data.assigned_to !== undefined) {
            updates.push('assigned_to = ?');
            values.push(data.assigned_to);
        }
        
        if (updates.length === 0) return null;
        
        values.push(tenant_id, task_id);
        
        let query = `UPDATE tasks SET ${updates.join(', ')} WHERE tenant_id = ? AND task_id = ?`;
        
        if (role === 'user' && user_id) {
            query += ' AND assigned_to = ?';
            values.push(user_id);
        }
        
        const [result] = await conn.execute(query, values);
        
        await conn.commit();
        return result.affectedRows === 0 ? null : true;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};

exports.deleteTask = async (tenant_id, task_id, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        let query = 'DELETE FROM tasks WHERE tenant_id = ? AND task_id = ?';
        const params = [tenant_id, task_id];
        
        if (role === 'user' && user_id) {
            query += ' AND assigned_to = ?';
            params.push(user_id);
        }
        
        const [result] = await conn.execute(query, params);
        await conn.commit();
        return result.affectedRows === 0 ? null : true;
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
};
