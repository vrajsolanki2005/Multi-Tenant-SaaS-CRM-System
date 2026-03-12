import api from './axios';

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const createOrg = (name: string, adminName: string, email: string, password: string) =>
  api.post('/auth/create-org', { name, adminName, email, password });
