// Customer Entity
export interface Customer {
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

// Lead Entity
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';

export interface Lead {
  lead_id: number;
  title: string;
  status: LeadStatus;
  value: number | null;
  customer_id: number | null;
  assigned_to?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateLeadDto {
  title: string;
  status?: LeadStatus;
  value?: number;
  customer_id?: number;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  newStatus?: LeadStatus;
}

// Task Entity
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  task_id: number;
  task_name: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  lead_id?: number | null;
  assigned_to?: number | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateTaskDto {
  task_name: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  lead_id?: number;
  assigned_to?: number;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

// User Entity
export type UserRole = 'superAdmin' | 'admin' | 'manager' | 'sales';

export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: UserRole;
  is_active: boolean;
  tenant_id: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateUserDto {
  user_name: string;
  user_email: string;
  user_password: string;
  user_role: UserRole;
}

export interface UpdateUserDto {
  user_name?: string;
  user_email?: string;
  user_role?: UserRole;
  is_active?: boolean;
}

// Auth User (for context)
export interface AuthUser {
  userId: number;
  orgId: number;
  role: UserRole;
  email: string;
  name: string;
}

// Audit Log
export interface AuditLog {
  log_id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  details?: string;
  created_at: string;
}

// Dashboard Stats
export interface DashboardStats {
  counts: {
    leads: number;
    customers: number;
    openTasks: number;
    completedTasks: number;
    users: number;
  };
  leadStatusDist: Record<LeadStatus, number>;
  recentLeads: Lead[];
  recentTasks: Task[];
  overdueTasks: Task[];
}
