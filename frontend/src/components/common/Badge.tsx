import React from 'react';
import { LeadStatus, TaskStatus, TaskPriority } from '../../types';
import { LEAD_STATUS_COLORS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../../constants';

type BadgeStatus = LeadStatus | TaskStatus | TaskPriority;

interface BadgeProps {
  status: BadgeStatus;
  type?: 'lead' | 'task' | 'priority';
}

export function Badge({ status, type = 'lead' }: BadgeProps) {
  const getColors = () => {
    switch (type) {
      case 'lead':
        return LEAD_STATUS_COLORS[status as LeadStatus] || { color: '#94a3b8', bg: '#f1f5f9' };
      case 'task':
        return TASK_STATUS_COLORS[status as TaskStatus] || { color: '#94a3b8', bg: '#f1f5f9' };
      case 'priority':
        return TASK_PRIORITY_COLORS[status as TaskPriority] || { color: '#94a3b8', bg: '#f1f5f9' };
      default:
        return { color: '#94a3b8', bg: '#f1f5f9' };
    }
  };

  const { color, bg } = getColors();

  return (
    <span className="badge" style={{ color, background: bg }}>
      {status.replace('_', ' ')}
    </span>
  );
}
