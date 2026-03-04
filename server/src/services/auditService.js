const db = require('../config/db');

const logAction = async (action, entity, entity_id, user_id, tenant_id) => {
    const query = `INSERT INTO audit_logs (action, entity, entity_id, user_id, tenant_id) VALUES (?, ?, ?, ?, ?)`;
    await db.query(query, [action, entity, entity_id, user_id, tenant_id]);
};

const getAuditLogs = async (tenant_id, filters = {}) => {
    const { page = 1, limit = 50, entity, user_id, start_date, end_date } = filters;
    const offset = (page - 1) * limit;
    
    let query = `SELECT al.*, u.user_name, u.user_email 
                 FROM audit_logs al 
                 LEFT JOIN users u ON al.user_id = u.user_id 
                 WHERE al.tenant_id = ?`;
    const params = [tenant_id];
    
    if (entity) {
        query += ` AND al.entity = ?`;
        params.push(entity);
    }
    
    if (user_id) {
        query += ` AND al.user_id = ?`;
        params.push(user_id);
    }
    
    if (start_date) {
        query += ` AND al.created_at >= ?`;
        params.push(start_date);
    }
    
    if (end_date) {
        query += ` AND al.created_at <= ?`;
        params.push(end_date);
    }
    
    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);
    
    const [logs] = await db.query(query, params);
    
    const countQuery = `SELECT COUNT(*) as total FROM audit_logs WHERE tenant_id = ?`;
    const [countResult] = await db.query(countQuery, [tenant_id]);
    
    return {
        logs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / limit)
        }
    };
};

module.exports = { logAction, getAuditLogs };
