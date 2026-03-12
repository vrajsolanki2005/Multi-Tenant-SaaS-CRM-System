import api from './axios';

export const getAuditLogs = (params?: Record<string, any>) =>
  api.get('/audit-logs', { params: { limit: 20, ...params } });
