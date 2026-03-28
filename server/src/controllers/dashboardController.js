const db = require('../config/db');
const NotificationService = require('../services/notificationService');

exports.getDashboardStats = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const user_id = req.user.user_id;
        const user_role = req.user.user_role;

        if (!tenant_id) {
            return res.status(400).json({ message: 'Tenant ID not found' });
        }

        // For sales users, filter data to show only their assigned items
        const isSales = user_role === 'sales';
        
        // Get counts
        let leadQuery = 'SELECT COUNT(*) as count FROM leads WHERE tenant_id = ?';
        let leadParams = [tenant_id];
        if (isSales) {
            leadQuery += ' AND assigned_to = ?';
            leadParams.push(user_id);
        }
        const [leadCount] = await db.query(leadQuery, leadParams);
        
        const [customerCount] = await db.query('SELECT COUNT(*) as count FROM customers WHERE tenant_id = ?', [tenant_id]);
        
        let taskQuery = 'SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ? AND status != "completed"';
        let taskParams = [tenant_id];
        if (isSales) {
            taskQuery += ' AND assigned_to = ?';
            taskParams.push(user_id);
        }
        const [openTaskCount] = await db.query(taskQuery, taskParams);
        
        let completedTaskQuery = 'SELECT COUNT(*) as count FROM tasks WHERE tenant_id = ? AND status = "completed"';
        let completedTaskParams = [tenant_id];
        if (isSales) {
            completedTaskQuery += ' AND assigned_to = ?';
            completedTaskParams.push(user_id);
        }
        const [completedTaskCount] = await db.query(completedTaskQuery, completedTaskParams);
        
        const [userCount] = await db.query('SELECT COUNT(*) as count FROM users WHERE tenant_id = ?', [tenant_id]);

        // Lead status distribution
        let statusDistQuery = 'SELECT status, COUNT(*) as count FROM leads WHERE tenant_id = ?';
        let statusDistParams = [tenant_id];
        if (isSales) {
            statusDistQuery += ' AND assigned_to = ?';
            statusDistParams.push(user_id);
        }
        statusDistQuery += ' GROUP BY status';
        const [statusDist] = await db.query(statusDistQuery, statusDistParams);
        const leadStatusDist = {};
        statusDist.forEach(row => { leadStatusDist[row.status] = row.count; });

        // Recent leads
        let recentLeadsQuery = 'SELECT lead_id, title, status, value FROM leads WHERE tenant_id = ?';
        let recentLeadsParams = [tenant_id];
        if (isSales) {
            recentLeadsQuery += ' AND assigned_to = ?';
            recentLeadsParams.push(user_id);
        }
        recentLeadsQuery += ' ORDER BY created_at DESC LIMIT 5';
        const [recentLeads] = await db.query(recentLeadsQuery, recentLeadsParams);

        // Recent tasks
        let recentTasksQuery = `SELECT t.task_id, t.task_name, t.status, t.priority,
                                l.title as lead_title, l.status as lead_status
                                FROM tasks t 
                                LEFT JOIN leads l ON t.lead_id = l.lead_id AND t.tenant_id = l.tenant_id
                                WHERE t.tenant_id = ?`;
        let recentTasksParams = [tenant_id];
        if (isSales) {
            recentTasksQuery += ' AND t.assigned_to = ?';
            recentTasksParams.push(user_id);
        }
        recentTasksQuery += ' ORDER BY t.created_at DESC LIMIT 5';
        const [recentTasks] = await db.query(recentTasksQuery, recentTasksParams);

        // Overdue tasks
        let overdueTasksQuery = 'SELECT task_id, task_name, due_date FROM tasks WHERE tenant_id = ? AND due_date < NOW() AND status != "completed"';
        let overdueTasksParams = [tenant_id];
        if (isSales) {
            overdueTasksQuery += ' AND assigned_to = ?';
            overdueTasksParams.push(user_id);
        }
        overdueTasksQuery += ' ORDER BY due_date ASC LIMIT 5';
        const [overdueTasks] = await db.query(overdueTasksQuery, overdueTasksParams);

        // Task priority distribution
        let taskPriorityQuery = 'SELECT priority, COUNT(*) as count FROM tasks WHERE tenant_id = ? AND status != "completed"';
        let taskPriorityParams = [tenant_id];
        if (isSales) {
            taskPriorityQuery += ' AND assigned_to = ?';
            taskPriorityParams.push(user_id);
        }
        taskPriorityQuery += ' GROUP BY priority';
        const [taskPriorityDist] = await db.query(taskPriorityQuery, taskPriorityParams);
        const taskPriorityData = {};
        taskPriorityDist.forEach(row => { taskPriorityData[row.priority] = row.count; });

        // Lead conversion trend (last 7 days)
        let conversionTrendQuery = `SELECT DATE(created_at) as date, 
                                    SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted,
                                    COUNT(*) as total
                                    FROM leads WHERE tenant_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
        let conversionTrendParams = [tenant_id];
        if (isSales) {
            conversionTrendQuery += ' AND assigned_to = ?';
            conversionTrendParams.push(user_id);
        }
        conversionTrendQuery += ' GROUP BY DATE(created_at) ORDER BY date ASC';
        const [conversionTrend] = await db.query(conversionTrendQuery, conversionTrendParams);

        // Task completion trend (last 7 days)
        let taskTrendQuery = `SELECT DATE(updated_at) as date, COUNT(*) as completed
                              FROM tasks WHERE tenant_id = ? AND status = 'completed' 
                              AND updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`;
        let taskTrendParams = [tenant_id];
        if (isSales) {
            taskTrendQuery += ' AND assigned_to = ?';
            taskTrendParams.push(user_id);
        }
        taskTrendQuery += ' GROUP BY DATE(updated_at) ORDER BY date ASC';
        const [taskTrend] = await db.query(taskTrendQuery, taskTrendParams);

        // Get recent notifications
        const notifications = await NotificationService.getUserNotifications(tenant_id, user_id, 5, 0);
        const unreadCount = await NotificationService.getUnreadCount(tenant_id, user_id);

        return res.json({
            counts: {
                leads: leadCount[0].count,
                customers: customerCount[0].count,
                openTasks: openTaskCount[0].count,
                completedTasks: completedTaskCount[0].count,
                users: userCount[0].count
            },
            leadStatusDist,
            taskPriorityData,
            conversionTrend,
            taskTrend,
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
