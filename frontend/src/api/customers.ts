import api from './axios';

export const getCustomers = (page = 1) =>
  api.get('/customers', { params: { page, limit: 15 } });

export const getCustomerById = (id: number) => api.get(`/customers/${id}`);

export const createCustomer = (data: { name: string; email: string; phone: string }) =>
  api.post('/customers', data);

export const updateCustomer = (id: number, data: Partial<{ name: string; email: string; phone: string }>) =>
  api.put(`/customers/${id}`, data);

export const deleteCustomer = (id: number) => api.delete(`/customers/${id}`);
