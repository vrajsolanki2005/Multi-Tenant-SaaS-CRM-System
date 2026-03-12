import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../api/auth';

export type UserRole = 'superAdmin' | 'admin' | 'manager' | 'sales';

export interface AuthUser {
  userId: number;
  orgId: number;
  role: UserRole;
  email: string;
  name: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('crm_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const { token, orgId, userId } = res.data;

    // Decode role from JWT payload (base64 middle segment)
    let role: UserRole = 'sales';
    let name = email;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.user_role ?? 'sales';
      name = payload.user_name ?? payload.user_email ?? email;
    } catch {}

    const u: AuthUser = { userId, orgId, role, email, name };
    setUser(u);
    localStorage.setItem('crm_user', JSON.stringify(u));
    // Token is also set as httpOnly cookie by the server
    localStorage.setItem('crm_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
  };

  const updateUser = (patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem('crm_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin   = user?.role === 'admin'   || user?.role === 'superAdmin';
  const isManager = isAdmin || user?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
