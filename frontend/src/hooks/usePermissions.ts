import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface Permissions {
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewAuditLogs: boolean;
  canManageLeads: boolean;
  canManageTasks: boolean;
  canManageCustomers: boolean;
  canAssignLeads: boolean;
  canDeleteLeads: boolean;
  canDeleteCustomers: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isSuperAdmin: boolean;
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
  superAdmin: 4,
  admin: 3,
  manager: 2,
  sales: 1,
};

export function usePermissions(): Permissions {
  const { user } = useAuth();

  return useMemo(() => {
    if (!user) {
      return {
        canViewUsers: false,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canViewAuditLogs: false,
        canManageLeads: false,
        canManageTasks: false,
        canManageCustomers: false,
        canAssignLeads: false,
        canDeleteLeads: false,
        canDeleteCustomers: false,
        isAdmin: false,
        isManager: false,
        isSuperAdmin: false,
      };
    }

    const roleLevel = ROLE_HIERARCHY[user.role];
    const isSuperAdmin = user.role === 'superAdmin';
    const isAdmin = roleLevel >= ROLE_HIERARCHY.admin;
    const isManager = roleLevel >= ROLE_HIERARCHY.manager;

    return {
      // User management
      canViewUsers: isManager,
      canCreateUsers: isAdmin,
      canEditUsers: isAdmin,
      canDeleteUsers: isSuperAdmin,

      // Audit logs
      canViewAuditLogs: isAdmin,

      // Lead management
      canManageLeads: isManager,
      canAssignLeads: isAdmin,
      canDeleteLeads: isAdmin,

      // Task management
      canManageTasks: true, // All users can manage tasks

      // Customer management
      canManageCustomers: isManager,
      canDeleteCustomers: isAdmin,

      // Role checks
      isAdmin,
      isManager,
      isSuperAdmin,
    };
  }, [user]);
}

export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
