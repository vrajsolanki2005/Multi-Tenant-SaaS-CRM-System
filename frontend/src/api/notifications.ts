import api from './axios';

export const getNotifications = (limit = 20, offset = 0) => {
  return api.get(`/notifications?limit=${limit}&offset=${offset}`);
};

export const getUnreadCount = () => {
  return api.get('/notifications/unread-count');
};

export const markAsRead = (notificationId: number) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = () => {
  return api.patch('/notifications/mark-all-read');
};