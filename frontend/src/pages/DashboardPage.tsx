import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Contact, CheckSquare, Users,
  TrendingUp, Clock, AlertCircle, Zap, ArrowRight, Activity, Plus, Bell, X
} from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import { getNotifications, markAsRead, markAllAsRead } from '../api/notifications';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  new: '#22c55e', contacted: '#3b82f6', qualified: '#f59e0b',
  converted: '#10b981', closed: '#da3633',
};

function Shimmer({ w = '100%', h = 20, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
    }} />
  );
}

function AnimatedNumber({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return <span>{val.toLocaleString()}</span>;
}

// Premium Hover Card with Mouse-Tracking Glow
function HoverCard({ children, className = '', style = {}, onClick }: any) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left - 300, y: e.clientY - r.top - 300 });
  };

  return (
    <div 
      className={`hover-card ${className}`} 
      style={style}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      <div 
        className="hover-glow" 
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          opacity: hover ? 1 : 0 
        }} 
      />
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isManager } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  console.log('Dashboard: User object:', user);
  console.log('Dashboard: User name:', user?.name);
  console.log('Dashboard: User email:', user?.email);

  useEffect(() => {
    getDashboardStats()
      .then(res => { 
        setData(res.data); 
        setNotifications(res.data.notifications || []);
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Dashboard error:', err); 
        const msg = err.response?.data?.message || err.message || "Backend synchronization failed. Ensure server is running on port 3000.";
        setError(msg); 
        setLoading(false); 
      });
  }, []);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'var(--green)';
      case 'warning': return 'var(--accent)';
      case 'error': return 'var(--red)';
      default: return 'var(--primary)';
    }
  };

  const stats = data?.counts || { leads: 0, customers: 0, openTasks: 0, completedTasks: 0, users: 0 };
  
  // Format data for Recharts
  const chartData = data?.leadStatusDist 
    ? Object.keys(data.leadStatusDist).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: data.leadStatusDist[key],
        color: STATUS_COLORS[key] || '#8b949e'
      })) 
    : [];

  return (
    <div className="dashboard-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 32, paddingBottom: 60 }}>
      {/* Hero Section & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--primary)', marginBottom: 12 }}>
            <Zap size={18} fill="currentColor" />
            <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Status: Operational</span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 900, margin: 0, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{user?.name?.split(' ')[0] || 'User'}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>Here's what is happening in your workspace today.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Notification Bell */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="btn btn-secondary" 
              style={{ padding: '12px', borderRadius: 12, position: 'relative' }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  background: 'var(--red)',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 400,
                maxHeight: 500,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>Notifications</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                        style={{
                          padding: '16px 20px',
                          borderBottom: '1px solid var(--border)',
                          cursor: notification.is_read ? 'default' : 'pointer',
                          background: notification.is_read ? 'transparent' : 'rgba(34,197,94,0.05)',
                          borderLeft: notification.is_read ? 'none' : `3px solid ${getNotificationColor(notification.type)}`,
                          opacity: notification.is_read ? 0.7 : 1
                        }}
                      >
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <span style={{ fontSize: 16 }}>{getNotificationIcon(notification.type)}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--text-primary)' }}>
                              {notification.title}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                              {notification.message}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                              {new Date(notification.created_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link to="/leads?new=1" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 12 }}>
            <Plus size={16} /> Create Lead
          </Link>
          <Link to="/tasks?new=1" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 12 }}>
            <CheckSquare size={16} /> New Task
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', color: 'var(--red)', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Hero Stat Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {[
          { label: 'Total Leads', val: stats.leads, icon: <Target />, color: 'var(--primary)', bg: 'rgba(34,197,94,0.1)', link: '/leads' },
          { label: 'Contacts', val: stats.customers, icon: <Users />, color: 'var(--accent)', bg: 'rgba(245, 158, 11, 0.1)', link: '/contacts' },
          { label: 'Open Tasks', val: stats.openTasks, icon: <CheckSquare />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', link: '/tasks' },
          { label: 'Team Members', val: stats.users, icon: <Contact />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', link: '/users' },
        ].map((s, i) => (
          <HoverCard key={i} style={{ animationDelay: `${i * 0.1}s` }} className="staggered-fade">
            <Link to={s.link} style={{ display: 'flex', padding: 24, gap: 20, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.cloneElement(s.icon as any, { size: 24 })}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {loading ? <Shimmer w={60} h={32} /> : <AnimatedNumber target={s.val} />}
                </div>
              </div>
            </Link>
          </HoverCard>
        ))}
      </div>

      {/* Main Grid: Pipeline Chart & Overdue Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'stretch' }}>
        
        {/* Analytics Pipeline Chart */}
        <HoverCard style={{ padding: 24, minHeight: 380 }} className="staggered-fade">
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={20} color="var(--primary)" /> Lead Pipeline Distribution
          </h3>
          <div style={{ height: 280, width: '100%', position: 'relative' }}>
            {loading ? (
              <div className="loading-center"><Shimmer h={200} w={200} r={100} /></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius={80} outerRadius={110}
                    paddingAngle={5} dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 600, color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No pipeline data available.</div>
            )}
            
            {/* Center Metric */}
            {!loading && chartData.length > 0 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{stats.leads}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 4 }}>Total Leads</div>
              </div>
            )}
          </div>
        </HoverCard>

        {/* Critical Alerts panel */}
        <HoverCard style={{ padding: 24, border: '1px solid rgba(239, 68, 68, 0.2)' }} className="staggered-fade danger-glow">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--red)' }}>
              <AlertCircle size={18} /> Action Required
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading ? (
              [...Array(3)].map((_, i) => <Shimmer key={i} h={50} r={12} />)
            ) : !data?.overdueTasks?.length ? (
              <div style={{ padding: 24, textAlign: 'center', background: 'var(--surface-2)', borderRadius: 12 }}>
                <span style={{ color: 'var(--green)', fontSize: 13, fontWeight: 600 }}>All operations on schedule.</span>
              </div>
            ) : (
              data.overdueTasks.slice(0, 4).map((t: any) => (
                <Link key={t.task_id} to="/tasks" className="p-3" style={{ background: 'rgba(239,68,68,0.05)', borderRadius: 12, textDecoration: 'none', border: '1px solid rgba(239,68,68,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Clock size={16} color="var(--red)" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{t.task_name}</div>
                      <div style={{ fontSize: 11, color: 'var(--red)' }}>Overdue</div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </HoverCard>
      </div>

      {/* Recents Lists Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Recent Leads */}
        <HoverCard className="staggered-fade">
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={18} color="var(--primary)" /> Recent Leads
            </h3>
            <Link to="/leads" style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: 12 }}>
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} style={{ padding: 8 }}><Shimmer h={48} r={12} /></div>)
            ) : !data?.recentLeads?.length ? (
              <div className="empty-state">No recent leads.</div>
            ) : (
              data.recentLeads.map((l: any) => (
                <Link key={l.lead_id} to="/leads" className="nav-item" style={{ padding: '12px 16px', borderRadius: 12, margin: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="avatar" style={{ width: 36, height: 36, borderRadius: 10 }}>{l.title[0]}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{l.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>\${Number(l.value || 0).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="badge" style={{ background: 'var(--surface-2)', color: STATUS_COLORS[l.status], fontSize: 10, padding: '4px 10px' }}>{l.status}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </HoverCard>

        {/* Recent Tasks */}
        <HoverCard className="staggered-fade">
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckSquare size={18} color="#3b82f6" /> Recent Tasks
            </h3>
            <Link to="/tasks" style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ padding: 12 }}>
            {loading ? (
              [...Array(4)].map((_, i) => <div key={i} style={{ padding: 8 }}><Shimmer h={48} r={12} /></div>)
            ) : !data?.recentTasks?.length ? (
              <div className="empty-state">No recent tasks.</div>
            ) : (
              data.recentTasks.map((t: any) => (
                <Link key={t.task_id} to="/tasks" className="nav-item" style={{ padding: '12px 16px', borderRadius: 12, margin: '4px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.priority === 'high' || t.priority === 'urgent' ? 'var(--red)' : '#3b82f6', boxShadow: `0 0 10px ${t.priority === 'urgent' ? 'var(--red)' : 'transparent'}` }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{t.task_name}</div>
                        {t.lead_title && <div style={{ fontSize: 11, color: 'var(--primary)' }}>📋 {t.lead_title}</div>}
                      </div>
                    </div>
                    <div className="badge" style={{ background: 'var(--surface-2)', fontSize: 10, padding: '4px 10px' }}>{t.status}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </HoverCard>
      </div>

      <style>{`
        .dashboard-fade-in { animation: fadeIn 0.4s ease-out; }
        .staggered-fade { opacity: 0; animation: fadeUp 0.6s ease forwards; }
        .danger-glow .hover-glow { background: radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%); }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 1024px) {
           .dashboard-fade-in > div:nth-child(4) { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
