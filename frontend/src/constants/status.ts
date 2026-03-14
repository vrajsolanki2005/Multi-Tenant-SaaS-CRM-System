import { LeadStatus, TaskStatus, TaskPriority } from '../types';

// Lead Status
export const LEAD_STATUS: Record<string, LeadStatus> = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  CLOSED: 'closed',
} as const;

export const LEAD_STATUS_COLORS: Record<LeadStatus, { color: string; bg: string }> = {
  new: { color: '#6366f1', bg: '#e0e7ff' },
  contacted: { color: '#3b82f6', bg: '#dbeafe' },
  qualified: { color: '#f59e0b', bg: '#fef3c7' },
  converted: { color: '#22c55e', bg: '#dcfce7' },
  closed: { color: '#94a3b8', bg: '#f1f5f9' },
};

export const LEAD_STATUS_FLOW: Record<LeadStatus, LeadStatus[]> = {
  new: ['contacted', 'closed'],
  contacted: ['qualified', 'closed'],
  qualified: ['converted', 'closed'],
  converted: [],
  closed: ['new'],
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  converted: 'Converted',
  closed: 'Closed',
};

// Task Status
export const TASK_STATUS: Record<string, TaskStatus> = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const TASK_STATUS_COLORS: Record<TaskStatus, { color: string; bg: string }> = {
  pending: { color: '#94a3b8', bg: '#f1f5f9' },
  in_progress: { color: '#3b82f6', bg: '#dbeafe' },
  completed: { color: '#22c55e', bg: '#dcfce7' },
  cancelled: { color: '#ef4444', bg: '#fee2e2' },
};

// Task Priority
export const TASK_PRIORITY: Record<string, TaskPriority> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const TASK_PRIORITY_COLORS: Record<TaskPriority, { color: string; bg: string }> = {
  low: { color: '#94a3b8', bg: '#f1f5f9' },
  medium: { color: '#3b82f6', bg: '#dbeafe' },
  high: { color: '#f59e0b', bg: '#fef3c7' },
  urgent: { color: '#ef4444', bg: '#fee2e2' },
};

// Chart Colors (for dashboard)
export const CHART_COLORS: Record<LeadStatus, string> = {
  new: '#22c55e',
  contacted: '#3b82f6',
  qualified: '#f59e0b',
  converted: '#10b981',
  closed: '#da3633',
};
