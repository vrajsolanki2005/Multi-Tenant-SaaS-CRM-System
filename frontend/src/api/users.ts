import api from './axios';

export const getUsers = (params?: Record<string, any>) =>
  api.get('/users', { params: { limit: 15, ...params } });

export const getUserById = (id: number) => api.get(`/users/${id}`);

export const createUser = (data: {
  user_name: string; user_email: string; user_password: string; user_role: string;
}) => api.post('/create-user', data);

export const updateUser = (id: number, data: Partial<{
  user_name: string; user_email: string; user_role: string; is_active: boolean;
}>) => api.put(`/users/${id}`, data);

export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// User settings
export const updateMe = (data: { user_name?: string; user_email?: string }) => 
  api.put('/me', data);

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => 
  api.put('/me/password', data);

export const deleteMe = () => api.delete('/me');
