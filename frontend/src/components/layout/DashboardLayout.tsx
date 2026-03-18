import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  Target, 
  CheckSquare, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Bell,
  Search,
  Menu,
  X,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Intelligence Overview',
  '/leads':     'Capture Pipeline',
  '/contacts':  'Network Nodes',
  '/tasks':     'Operations',
  '/users':     'Team Structure',
  '/audit':     'System Logs',
  '/settings':  'Account Matrix',
};

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const title = PAGE_TITLES[pathname] ?? 'Mission Hub';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="app-shell">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 1001 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Responsive */}
      <div className={`sidebar-wrap ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="main-area">
        <header className="topbar glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button 
              className="btn-icon mobile-only" 
              onClick={() => setSidebarOpen(true)}
              style={{ border: 'none', background: 'transparent' }}
            >
              <Menu size={22} />
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>
          
          <div className="topbar-right">
            {/* Global Search */}
            <div className="hide-mobile" style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                className="input" 
                placeholder="Search (press Enter)..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                style={{ paddingLeft: 36, width: 220, background: 'var(--surface-2)', border: '1px solid var(--border)', outline: 'none', color: '#fff' }}
              />
            </div>

            <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} className="hide-mobile" />

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" style={{ position: 'relative' }} onClick={() => setShowNotifs(!showNotifs)}>
                <Bell size={20} />
                <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
              </button>

              {showNotifs && (
                <>
                  <div className="fixed-overlay" onClick={() => setShowNotifs(false)} />
                  <div className="profile-dropdown glass dropdown-anim" style={{ width: 320, right: -40, padding: 0, overflow: 'hidden' }}>
                     <div className="dropdown-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px', background: 'rgba(255,255,255,0.02)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Notifications</div>
                     </div>
                     
                     <div className="dropdown-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {[
                          { title: "New Lead Assigned", desc: "You've been assigned the Acme Corp lead.", time: "10m ago", color: "#3B82F6", unread: true },
                          { title: "SLA Warning", desc: "Task 'Follow up' is due in 2 hours.", time: "1h ago", color: "#F59E0B", unread: true },
                          { title: "System Update", desc: "V2.4 deployed successfully.", time: "1d ago", color: "#10B981", unread: false },
                        ].map((n, i) => (
                          <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s', background: n.unread ? 'rgba(59,130,246,0.05)' : 'transparent' }}
                               onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                               onMouseLeave={e => (e.currentTarget.style.background = n.unread ? 'rgba(59,130,246,0.05)' : 'transparent')}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color }} />
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{n.title}</span>
                              </div>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</span>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 14 }}>{n.desc}</div>
                          </div>
                        ))}
                     </div>
                     <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                       <a href="#" style={{ fontSize: 12, color: '#00BFFF', textDecoration: 'none', fontWeight: 600 }}>Mark all as read</a>
                     </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <div 
                className="profile-trigger" 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
                  padding: '4px', borderRadius: 24, transition: 'all 0.2s',
                  background: showDropdown ? 'var(--surface-2)' : 'transparent'
                }}
                title={user?.name}
              >
                <div className="avatar" style={{ 
                  width: 36, height: 36, borderRadius: '50%', 
                  background: 'var(--brand-gradient)', color: '#000', 
                  fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
                }}>
                   {user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-muted)', transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>

              {showDropdown && (
                <>
                  <div className="fixed-overlay" onClick={() => setShowDropdown(false)} />
                  <div className="profile-dropdown glass dropdown-anim">
                     <div className="dropdown-header">
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                        <div className="role-chip">{user?.role}</div>
                     </div>
                     
                     <div className="dropdown-body">
                        <Link to="/settings" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <Settings size={16} />
                          <span>Account Settings</span>
                        </Link>
                        <button className="dropdown-item logout-btn" onClick={handleLogout}>
                          <LogOut size={16} />
                          <span>De-authenticate</span>
                        </button>
                     </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        .sidebar-wrap {
          width: var(--sidebar-w);
          height: 100vh;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1002;
        }
        @media (max-width: 1024px) {
          .sidebar-wrap {
            position: fixed;
            left: 0;
            top: 0;
            transform: translateX(-100%);
          }
          .sidebar-wrap.open { transform: translateX(0); }
          .mobile-only { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
        .mobile-only { display: none; }
        .fixed-overlay { position: fixed; inset: 0; z-index: 40; }
        
        .profile-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          width: 200px; z-index: 50; border-radius: 16px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          padding: 8px;
        }
        .dropdown-header { padding: 12px 12px 10px; border-bottom: 1px solid var(--glass-border); margin-bottom: 6px; }
        .role-chip {
           display: inline-block; padding: 2px 8px; border-radius: 6px; 
           background: var(--primary-light); color: var(--primary);
           font-size: 10px; font-weight: 800; text-transform: uppercase;
           letter-spacing: 0.05em; margin-top: 8px;
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px; padding: 10px 12px;
          border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--text-secondary);
          transition: all 0.2s; cursor: pointer; text-decoration: none; border: none; background: transparent; width: 100%; text-align: left;
        }
        .dropdown-item:hover { background: var(--surface-2); color: var(--text-primary); }
        .logout-btn { color: var(--red) !important; margin-top: 4px; }
        .logout-btn:hover { background: var(--red-bg) !important; }
        
        .dropdown-anim {
          animation: dropdownIn 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
