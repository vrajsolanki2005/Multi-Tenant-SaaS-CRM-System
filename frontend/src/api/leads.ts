import api from './axios';

export const getLeads = (page = 1, status?: string) =>
  api.get('/leads', { params: { page, limit: 15, status } });

export const getLeadById = (id: number) => api.get(`/leads/${id}`);

export const createLead = (data: {
  title: string; status?: string; value?: number; customer_id?: number | null; assigned_to?: number | null;
}) => api.post('/leads', data);

export const updateLead = (id: number, data: {
  title?: string; newStatus?: string; value?: number; customer_id?: number | null; assigned_to?: number | null;
}) => api.put(`/leads/${id}`, data);

export const deleteLead = (id: number) => api.delete(`/leads/${id}`);

export const assignLead = (id: number, user_id: number) =>
  api.put(`/leads/${id}/assign`, { user_id });
