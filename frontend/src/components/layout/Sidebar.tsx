import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Target, CheckSquare,
  Contact, ClipboardList, LogOut, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user, logout, isAdmin, isManager, isSales } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-item${isActive ? ' active' : ''}`;

  return (
    <aside className="sidebar" style={{ background: 'rgba(17, 17, 24, 0.98)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--border)' }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 18 }}>
        <div className="sidebar-logo-icon" style={{ background: 'var(--brand-gradient)', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)' }}>
          <Zap size={18} color="#fff" strokeWidth={2.5} />
        </div>
        <span className="sidebar-logo-text" style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FlowCRM</span>
      </div>

      <div style={{ flex: 1, padding: '6px 0' }}>
        <div className="sidebar-section">Main</div>

        <NavLink to="/dashboard" className={navClass} onClick={handleLinkClick}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink to="/leads" className={navClass} onClick={handleLinkClick}>
          <Target size={16} />
          {isSales ? 'My Leads' : 'Leads'}
        </NavLink>

        <NavLink to="/contacts" className={navClass} onClick={handleLinkClick}>
          <Contact size={16} />
          Contacts
        </NavLink>

        <NavLink to="/tasks" className={navClass} onClick={handleLinkClick}>
          <CheckSquare size={16} />
          {isSales ? 'My Tasks' : 'Tasks'}
        </NavLink>

        {isManager && (
          <>
            <div className="sidebar-section" style={{ marginTop: 12 }}>Admin</div>
            <NavLink to="/users" className={navClass} onClick={handleLinkClick}>
              <Users size={16} />
              Users
            </NavLink>
          </>
        )}

        {isAdmin && (
          <NavLink to="/audit" className={navClass} onClick={handleLinkClick}>
            <ClipboardList size={16} />
            Audit Log
          </NavLink>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="nav-item" style={{ marginBottom: 6, cursor: 'default' }}>
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
        <button className="nav-item btn-icon" style={{ width: '100%', color: '#64748b' }} onClick={handleLogout}>
          <LogOut size={14} />
          <span style={{ fontSize: 12 }}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
