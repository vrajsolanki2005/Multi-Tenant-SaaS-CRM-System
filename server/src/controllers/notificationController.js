const NotificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
    try {
        const { tenant_id, user_id } = req.user;
        const { limit = 20, offset = 0 } = req.query;

        const notifications = await NotificationService.getUserNotifications(
            tenant_id, 
            user_id, 
            parseInt(limit), 
            parseInt(offset)
        );

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications'
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const { tenant_id, user_id } = req.user;
        
        const count = await NotificationService.getUnreadCount(tenant_id, user_id);
        
        res.json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch unread count'
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { tenant_id, user_id } = req.user;
        const { id } = req.params;

        await NotificationService.markAsRead(parseInt(id), tenant_id, user_id);

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read'
        });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const { tenant_id, user_id } = req.user;

        await NotificationService.markAllAsRead(tenant_id, user_id);

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read'
        });
    }
};