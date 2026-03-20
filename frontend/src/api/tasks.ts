import api from './axios';

export const getTasks = (params?: Record<string, any>) =>
  api.get('/tasks', { params: { limit: 15, ...params } });

export const getTaskById = (id: number) => api.get(`/tasks/${id}`);

export const createTask = (data: {
  task_name: string; description?: string; status?: string;
  priority?: string; due_date?: string; lead_id?: number | null; assigned_to?: number | null;
}) => api.post('/tasks', data);

export const updateTask = (id: number, data: Partial<{
  task_name: string; description: string; status: string;
  priority: string; due_date: string; lead_id: number | null; assigned_to: number | null;
}>) => api.put(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
