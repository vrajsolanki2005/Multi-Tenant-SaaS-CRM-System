const db = require('../config/db');

exports.createTask = async (tenant_id, data) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();
        
        const [result] = await conn.execute(
            `INSERT INTO tasks (task_name, description, status, priority, due_date, lead_id, assigned_to, tenant_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.task_name, 
                data.description, 
                data.status || 'pending', 
                data.priority || 'medium', 
                data.due_date, 
                data.lead_id, 
                data.assigned_to,
                tenant_id
            ]
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

exports.getTasks = async (tenant_id, filters = {}, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        const { status, priority, assigned_to, overdue, page = 1, limit = 20 } = filters;
        const offset = (page - 1) * limit;
        
        let query = `SELECT t.*, 
                     CASE WHEN t.due_date < NOW() AND t.status != "completed" THEN 1 ELSE 0 END as is_overdue,
                     l.title as lead_title, l.status as lead_status, l.value as lead_value
                     FROM tasks t 
                     LEFT JOIN leads l ON t.lead_id = l.lead_id AND t.tenant_id = l.tenant_id
                     WHERE t.tenant_id = ?`;
        const params = [tenant_id];
        
        // Sales users can only see tasks assigned to them
        if (role === 'sales' && user_id) {
            query += ' AND t.assigned_to = ?';
            params.push(user_id);
        }
        
        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }
        if (priority) {
            query += ' AND t.priority = ?';
            params.push(priority);
        }
        if (assigned_to && role !== 'sales') { // Don't apply this filter for sales users as they're already filtered
            query += ' AND t.assigned_to = ?';
            params.push(assigned_to);
        }
        if (overdue === 'true') {
            query += ' AND t.due_date < NOW() AND t.status != "completed"';
        }
        
        query += ` ORDER BY t.priority DESC, t.due_date ASC LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        
        const [rows] = await conn.query(query, params);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        conn.release();
    }
};

exports.getTaskById = async (tenant_id, task_id, user_id = null, role = null) => {
    const conn = await db.getConnection();
    try {
        let query = `SELECT t.*, 
                     CASE WHEN t.due_date < NOW() AND t.status != "completed" THEN 1 ELSE 0 END as is_overdue,
                     l.title as lead_title, l.status as lead_status, l.value as lead_value
                     FROM tasks t 
                     LEFT JOIN leads l ON t.lead_id = l.lead_id AND t.tenant_id = l.tenant_id
                     WHERE t.task_id = ? AND t.tenant_id = ?`;
        const params = [task_id, tenant_id];
        
        // Sales users can only see tasks assigned to them
        if (role === 'sales' && user_id) {
            query += ' AND t.assigned_to = ?';
            params.push(user_id);
        }
        
        const [rows] = await conn.execute(query, params);
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
        
        // Check if task is completed and trying to change status
        if (data.status) {
            const [currentTask] = await conn.execute(
                'SELECT status FROM tasks WHERE task_id = ? AND tenant_id = ?',
                [task_id, tenant_id]
            );
            
            if (currentTask.length > 0 && currentTask[0].status === 'completed' && data.status !== 'completed') {
                await conn.rollback();
                throw new Error('Cannot change status of a completed task');
            }
        }
        
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
        if (data.lead_id !== undefined) {
            updates.push('lead_id = ?');
            values.push(data.lead_id);
        }
        
        if (updates.length === 0) return null;
        
        values.push(tenant_id, task_id);
        
        let query = `UPDATE tasks SET ${updates.join(', ')} WHERE tenant_id = ? AND task_id = ?`;
        
        // Sales users can only update tasks assigned to them
        if (role === 'sales' && user_id) {
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
        
        // Sales users can only delete tasks assigned to them
        if (role === 'sales' && user_id) {
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
