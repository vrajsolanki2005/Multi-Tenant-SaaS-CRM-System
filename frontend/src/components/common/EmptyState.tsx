import React, { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div style={{ opacity: 0.35 }}>{icon}</div>}
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: icon ? 12 : 0 }}>
        {title}
      </p>
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}
