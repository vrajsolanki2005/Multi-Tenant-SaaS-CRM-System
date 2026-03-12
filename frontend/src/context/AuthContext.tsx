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
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  // Restore session on mount and fetch profile
  useEffect(() => {
    const stored = localStorage.getItem('crm_user');
    const token = localStorage.getItem('crm_token');
    
    console.log('AuthContext: Stored user:', stored);
    console.log('AuthContext: Has token:', !!token);
    
    if (stored && token) {
      try { 
        const parsedUser = JSON.parse(stored);
        console.log('AuthContext: Parsed user:', parsedUser);
        setUser(parsedUser); 
        // Fetch fresh profile data
        getMyProfile()
          .then(res => {
            console.log('AuthContext: Profile response:', res.data);
            const profile = res.data.data;
            if (profile) {
              console.log('AuthContext: Profile data:', profile);
              const updated: AuthUser = {
                userId: profile.user_id,
                orgId: profile.tenant_id,
                role: profile.user_role,
                email: profile.user_email,
                name: profile.user_name
              };
              console.log('AuthContext: Updated user object:', updated);
              setUser(updated);
              localStorage.setItem('crm_user', JSON.stringify(updated));
            }
          })
          .catch(err => console.error('Failed to fetch profile:', err));
      } catch {}
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
      console.log('JWT Payload:', payload); // Debug log
      role = payload.user_role ?? 'sales';
      // Try different possible name fields from JWT
      name = payload.user_name || payload.userName || payload.name || payload.user_email || email;
    } catch (err) {
      console.error('Error decoding JWT:', err);
    }

    const u: AuthUser = { userId, orgId, role, email, name };
    setUser(u);
    localStorage.setItem('crm_user', JSON.stringify(u));
    // Token is also set as httpOnly cookie by the server
    localStorage.setItem('crm_token', token);
    
    // Fetch fresh profile to get actual user_name
    try {
      const profileRes = await getMyProfile();
      const profile = profileRes.data.data;
      if (profile) {
        const updated: AuthUser = {
          userId: profile.user_id,
          orgId: profile.tenant_id,
          role: profile.user_role,
          email: profile.user_email,
          name: profile.user_name
        };
        setUser(updated);
        localStorage.setItem('crm_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Failed to fetch profile after login:', err);
    }
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
