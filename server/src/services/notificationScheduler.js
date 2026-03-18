const cron = require('node-cron');
const db = require('../config/db');
const NotificationService = require('./notificationService');

class NotificationScheduler {
    static init() {
        // Run every hour to check for overdue tasks
        cron.schedule('0 * * * *', async () => {
            console.log('🔔 Checking for overdue tasks...');
            await this.checkOverdueTasks();
        });

        // Run daily at 9 AM to send daily summary
        cron.schedule('0 9 * * *', async () => {
            console.log('📊 Sending daily summaries...');
            await this.sendDailySummaries();
        });

        console.log('✅ Notification scheduler initialized');
    }

    static async checkOverdueTasks() {
        try {
            // Find overdue tasks that haven't been notified about in the last 24 hours
            const [overdueTasks] = await db.query(`
                SELECT t.task_id, t.task_name, t.tenant_id, t.assigned_to, t.due_date,
                       u.user_name, u.user_email
                FROM tasks t
                LEFT JOIN users u ON t.assigned_to = u.user_id
                WHERE t.due_date < NOW() 
                AND t.status != 'completed'
                AND t.task_id NOT IN (
                    SELECT DISTINCT entity_id 
                    FROM notifications 
                    WHERE entity_type = 'task' 
                    AND type = 'warning'
                    AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
                    AND entity_id = t.task_id
                )
            `);

            for (const task of overdueTasks) {
                if (task.assigned_to) {
                    await NotificationService.notifyTaskOverdue(
                        task.tenant_id,
                        task.assigned_to,
                        task.task_id,
                        task.task_name
                    );
                }
            }

            console.log(`📋 Processed ${overdueTasks.length} overdue task notifications`);
        } catch (error) {
            console.error('Error checking overdue tasks:', error);
        }
    }

    static async sendDailySummaries() {
        try {
            // Get summary for each tenant
            const [tenants] = await db.query('SELECT DISTINCT tenant_id FROM users WHERE user_role IN ("admin", "manager")');

            for (const tenant of tenants) {
                const [stats] = await db.query(`
                    SELECT 
                        (SELECT COUNT(*) FROM leads WHERE tenant_id = ? AND DATE(created_at) = CURDATE()) as new_leads,
                        (SELECT COUNT(*) FROM tasks WHERE tenant_id = ? AND due_date < NOW() AND status != 'completed') as overdue_tasks,
                        (SELECT COUNT(*) FROM tasks WHERE tenant_id = ? AND status = 'completed' AND DATE(updated_at) = CURDATE()) as completed_tasks
                `, [tenant.tenant_id, tenant.tenant_id, tenant.tenant_id]);

                const summary = stats[0];
                
                if (summary.new_leads > 0 || summary.overdue_tasks > 0 || summary.completed_tasks > 0) {
                    let message = 'Daily Summary: ';
                    const parts = [];
                    
                    if (summary.new_leads > 0) parts.push(`${summary.new_leads} new leads`);
                    if (summary.completed_tasks > 0) parts.push(`${summary.completed_tasks} tasks completed`);
                    if (summary.overdue_tasks > 0) parts.push(`${summary.overdue_tasks} tasks overdue`);
                    
                    message += parts.join(', ');

                    await NotificationService.createNotification({
                        tenant_id: tenant.tenant_id,
                        title: 'Daily Summary',
                        message,
                        type: summary.overdue_tasks > 0 ? 'warning' : 'info',
                        entity_type: 'system'
                    });
                }
            }

            console.log(`📊 Sent daily summaries to ${tenants.length} tenants`);
        } catch (error) {
            console.error('Error sending daily summaries:', error);
        }
    }
}

module.exports = NotificationScheduler;