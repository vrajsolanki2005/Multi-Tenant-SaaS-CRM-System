const db = require('../config/db');

class NotificationService {
    // Create a new notification
    static async createNotification({
        tenant_id,
        user_id = null, // null means notification for all users in tenant
        title,
        message,
        type = 'info',
        entity_type = 'system',
        entity_id = null
    }) {
        try {
            const [result] = await db.query(
                `INSERT INTO notifications (tenant_id, user_id, title, message, type, entity_type, entity_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [tenant_id, user_id, title, message, type, entity_type, entity_id]
            );
            return result.insertId;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    // Get notifications for a user
    static async getUserNotifications(tenant_id, user_id, limit = 20, offset = 0) {
        try {
            const [notifications] = await db.query(
                `SELECT n.*, 
                        CASE 
                            WHEN n.entity_type = 'lead' THEN l.title
                            WHEN n.entity_type = 'customer' THEN c.name
                            WHEN n.entity_type = 'task' THEN t.task_name
                            WHEN n.entity_type = 'user' THEN u.user_name
                            ELSE NULL
                        END as entity_name
                 FROM notifications n
                 LEFT JOIN leads l ON n.entity_type = 'lead' AND n.entity_id = l.lead_id
                 LEFT JOIN customers c ON n.entity_type = 'customer' AND n.entity_id = c.customer_id
                 LEFT JOIN tasks t ON n.entity_type = 'task' AND n.entity_id = t.task_id
                 LEFT JOIN users u ON n.entity_type = 'user' AND n.entity_id = u.user_id
                 WHERE n.tenant_id = ? AND (n.user_id = ? OR n.user_id IS NULL)
                 ORDER BY n.created_at DESC
                 LIMIT ? OFFSET ?`,
                [tenant_id, user_id, limit, offset]
            );
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    // Get unread notification count
    static async getUnreadCount(tenant_id, user_id) {
        try {
            const [result] = await db.query(
                `SELECT COUNT(*) as count FROM notifications 
                 WHERE tenant_id = ? AND (user_id = ? OR user_id IS NULL) AND is_read = FALSE`,
                [tenant_id, user_id]
            );
            return result[0].count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            throw error;
        }
    }

    // Mark notification as read
    static async markAsRead(notification_id, tenant_id, user_id) {
        try {
            await db.query(
                `UPDATE notifications SET is_read = TRUE, read_at = NOW() 
                 WHERE id = ? AND tenant_id = ? AND (user_id = ? OR user_id IS NULL)`,
                [notification_id, tenant_id, user_id]
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    static async markAllAsRead(tenant_id, user_id) {
        try {
            await db.query(
                `UPDATE notifications SET is_read = TRUE, read_at = NOW() 
                 WHERE tenant_id = ? AND (user_id = ? OR user_id IS NULL) AND is_read = FALSE`,
                [tenant_id, user_id]
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    }

    // Auto-generate notifications for common events
    static async notifyLeadCreated(tenant_id, lead_id, lead_title, created_by_name) {
        return this.createNotification({
            tenant_id,
            title: 'New Lead Created',
            message: `${created_by_name} created a new lead: ${lead_title}`,
            type: 'success',
            entity_type: 'lead',
            entity_id: lead_id
        });
    }

    static async notifyTaskOverdue(tenant_id, user_id, task_id, task_name) {
        return this.createNotification({
            tenant_id,
            user_id,
            title: 'Task Overdue',
            message: `Task "${task_name}" is overdue and requires attention`,
            type: 'warning',
            entity_type: 'task',
            entity_id: task_id
        });
    }

    static async notifyLeadConverted(tenant_id, lead_id, lead_title, converted_by_name) {
        return this.createNotification({
            tenant_id,
            title: 'Lead Converted',
            message: `${converted_by_name} converted lead "${lead_title}" to customer`,
            type: 'success',
            entity_type: 'lead',
            entity_id: lead_id
        });
    }

    static async notifyNewUser(tenant_id, user_id, user_name, added_by_name) {
        return this.createNotification({
            tenant_id,
            title: 'New Team Member',
            message: `${added_by_name} added ${user_name} to the team`,
            type: 'info',
            entity_type: 'user',
            entity_id: user_id
        });
    }

    static async notifyTaskAssigned(tenant_id, user_id, task_id, task_name, assigned_by_name) {
        return this.createNotification({
            tenant_id,
            user_id,
            title: 'Task Assigned',
            message: `${assigned_by_name} assigned you a task: ${task_name}`,
            type: 'info',
            entity_type: 'task',
            entity_id: task_id
        });
    }

    static async notifyLeadAssigned(tenant_id, user_id, lead_id, lead_title, assigned_by_name) {
        return this.createNotification({
            tenant_id,
            user_id,
            title: 'Lead Assigned',
            message: `${assigned_by_name} assigned you a lead: ${lead_title}`,
            type: 'info',
            entity_type: 'lead',
            entity_id: lead_id
        });
    }
}

module.exports = NotificationService;