const db = require('../config/db');
const NotificationService = require('../services/notificationService');

exports.getDashboardStats = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;

        if (!tenant_id) {
            return res.status(400).json({ message: 'Tenant ID not found' });
        }

        // Get counts
        const [leadCount] = await db.query('SELECT COUNT(*) as count FROM leads WHERE tenant_id = ?', [tenant_id]);
        const [customerCount] = await db.query('SELECT COUNT(*) as count FROM customers WHERE tenant_id = ?', [tenant_id]);
        const [openTaskCount] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ? AND status != "completed"', [tenant_id]);
        const [completedTaskCount] = await db.query('SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ? AND status = "completed"', [tenant_id]);
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE tenant_id = ?', [tenant_id]);

        // Lead status distribution
        const [statusDist] = await db.query('SELECT status, COUNT(*) as count FROM leads WHERE tenant_id = ? GROUP BY status', [tenant_id]);
        const leadStatusDist = {};
        statusDist.forEach(row => { leadStatusDist[row.status] = row.count; });

        // Recent leads
        const [recentLeads] = await db.query('SELECT lead_id, title, status, value FROM leads WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 5', [tenant_id]);

        // Recent tasks
        const [recentTasks] = await db.query('SELECT task_id, task_name, status, priority FROM tasks WHERE tenant_id = ? ORDER BY created_at DESC LIMIT 5', [tenant_id]);

        // Overdue tasks
        const [overdueTasks] = await db.query('SELECT task_id, task_name, due_date FROM tasks WHERE tenant_id = ? AND due_date < NOW() AND status != "completed" ORDER BY due_date ASC LIMIT 5', [tenant_id]);

        // Get recent notifications
        const notifications = await NotificationService.getUserNotifications(tenant_id, req.user.user_id, 5, 0);
        const unreadCount = await NotificationService.getUnreadCount(tenant_id, req.user.user_id);

        return res.json({
            counts: {
                leads: leadCount[0].count,
                customers: customerCount[0].count,
                openTasks: openTaskCount[0].count,
                completedTasks: completedTaskCount[0].count,
                users: userCount[0].count
            },
            leadStatusDist,
            recentLeads,
            recentTasks,
            overdueTasks,
            notifications,
            unreadNotificationCount: unreadCount
        });
    } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        return res.status(500).json({ message: 'Database error: ' + err.message });
    }
};
