const { getAuditLogs } = require('../services/auditService');

exports.getAuditLogs = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const { page, limit, entity, user_id, start_date, end_date } = req.query;
        
        const result = await getAuditLogs(tenant_id, { page, limit, entity, user_id, start_date, end_date });
        
        return res.status(200).json({
            success: true,
            data: result.logs,
            pagination: result.pagination
        });
    } catch (err) {
        console.error("Error fetching audit logs:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch audit logs" });
    }
};
