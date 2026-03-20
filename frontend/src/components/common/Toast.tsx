import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={16} />;
      case 'error': return <AlertCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return { background: 'var(--green-bg)', border: '1px solid var(--green-border)', color: 'var(--green)' };
      case 'error': return { background: 'var(--red-bg)', border: '1px solid var(--red-border)', color: 'var(--red)' };
      case 'warning': return { background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)' };
      default: return { background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', color: 'var(--primary)' };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 1000,
        padding: '12px 16px',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out',
        ...getStyles()
      }}
    >
      {getIcon()}
      <span>{message}</span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'inherit',
          marginLeft: 8
        }}
      >
        <X size={14} />
      </button>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}