import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../api/auth';
import { getMyProfile } from '../api/users';

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
  loginWithToken: (token: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]         = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session on mount and fetch profile
  useEffect(() => {
    const stored = localStorage.getItem('crm_user');
    const token  = localStorage.getItem('crm_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        getMyProfile()
          .then(res => {
            const profile = res.data.data;
            if (profile) {
              const updated: AuthUser = {
                userId: profile.user_id,
                orgId:  profile.tenant_id,
                role:   profile.user_role,
                email:  profile.user_email,
                name:   profile.user_name,
              };
              setUser(updated);
              localStorage.setItem('crm_user', JSON.stringify(updated));
            }
          })
          .catch(() => {/* ignore refresh failure */});
      } catch { /* bad JSON */ }
    }
    setLoading(false);
  }, []);

  // ── Email/password login ──────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    const { token, orgId, userId } = res.data;

    let role: UserRole = 'sales';
    let name = email;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.user_role ?? 'sales';
      name = payload.user_name || payload.name || payload.user_email || email;
    } catch { /* ignore */ }

    const u: AuthUser = { userId, orgId, role, email, name };
    setUser(u);
    localStorage.setItem('crm_user', JSON.stringify(u));
    localStorage.setItem('crm_token', token);

    // Fetch fresh profile for accurate name
    try {
      const profileRes = await getMyProfile();
      const profile = profileRes.data.data;
      if (profile) {
        const updated: AuthUser = {
          userId: profile.user_id,
          orgId:  profile.tenant_id,
          role:   profile.user_role,
          email:  profile.user_email,
          name:   profile.user_name,
        };
        setUser(updated);
        localStorage.setItem('crm_user', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
  };

  // ── OAuth token login (called by OAuthCallbackPage) ───────────────
  const loginWithToken = (token: string) => {
    let role: UserRole = 'sales';
    let name = '';
    let email = '';
    let userId = 0;
    let orgId = 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role   = payload.user_role  ?? 'sales';
      name   = payload.user_name  || payload.name || '';
      email  = payload.user_email || '';
      userId = payload.user_id    || 0;
      orgId  = payload.tenant_id  || 0;
    } catch { /* ignore */ }
    const u: AuthUser = { userId, orgId, role, email, name };
    setUser(u);
    localStorage.setItem('crm_user', JSON.stringify(u));
    localStorage.setItem('crm_token', token);
  };

  // ── Logout ────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
  };

  // ── Patch user ────────────────────────────────────────────────────
  const updateUser = (patch: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem('crm_user', JSON.stringify(updated));
      return updated;
    });
  };

  const isAdmin   = user?.role === 'admin' || user?.role === 'superAdmin';
  const isManager = isAdmin || user?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithToken, logout, updateUser, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
