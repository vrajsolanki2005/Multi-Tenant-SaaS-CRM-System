import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Target, Contact, CheckSquare, Users,
  TrendingUp, Clock, AlertCircle, Zap, ArrowRight, Activity, Plus
} from 'lucide-react';
import { getDashboardStats } from '../api/dashboard';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, Legend } from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  new: '#22c55e', contacted: '#3b82f6', qualified: '#f59e0b',
  converted: '#10b981', closed: '#da3633',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: '#3b82f6', medium: '#f59e0b', high: '#ef4444', urgent: '#dc2626',
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


  console.log('Dashboard: User object:', user);
  console.log('Dashboard: User name:', user?.name);
  console.log('Dashboard: User email:', user?.email);

  useEffect(() => {
    getDashboardStats()
      .then(res => { 
        setData(res.data);
        setLoading(false); 
      })
      .catch(err => { 
        console.error('Dashboard error:', err); 
        const msg = err.response?.data?.message || err.message || "Backend synchronization failed. Ensure server is running on port 3000.";
        setError(msg); 
        setLoading(false); 
      });
  }, []);



  const stats = data?.counts || { leads: 0, customers: 0, openTasks: 0, completedTasks: 0, users: 0 };
  
  // Format data for Recharts
  const chartData = data?.leadStatusDist 
    ? Object.keys(data.leadStatusDist).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: data.leadStatusDist[key],
        color: STATUS_COLORS[key] || '#8b949e'
      })) 
    : [];

  // Task priority chart data
  const priorityData = data?.taskPriorityData
    ? Object.keys(data.taskPriorityData).map(key => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: data.taskPriorityData[key],
        color: PRIORITY_COLORS[key] || '#8b949e'
      }))
    : [];

  // Task completion trend data
  const taskTrendData = data?.taskTrend?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    completed: Number(item.completed) || 0
  })) || [];

  // Lead conversion trend data
  const conversionData = data?.conversionTrend?.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    converted: Number(item.converted) || 0,
    total: Number(item.total) || 0
  })) || [];

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
          <Link to="/leads?new=1" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: 12, boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
            <Plus size={16} /> Create Lead
          </Link>
          <Link to="/tasks?new=1" className="btn btn-secondary" style={{ padding: '12px 24px', borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
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
          { label: 'Total Leads', val: stats.leads, icon: <Target />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', link: '/leads' },
          { label: 'Contacts', val: stats.customers, icon: <Users />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', link: '/contacts' },
          { label: 'Open Tasks', val: stats.openTasks, icon: <CheckSquare />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', link: '/tasks' },
          { label: 'Team Members', val: stats.users, icon: <Contact />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', link: '/users' },
        ].map((s, i) => (
          <HoverCard key={i} style={{ animationDelay: `${i * 0.1}s`, border: '1px solid var(--border)', borderRadius: 20 }} className="staggered-fade">
            <Link to={s.link} style={{ display: 'flex', padding: 24, gap: 20, alignItems: 'center', textDecoration: 'none' }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 16px ${s.bg}` }}>
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
        <HoverCard style={{ padding: 24, minHeight: 380, border: '1px solid var(--border)', borderRadius: 20 }} className="staggered-fade">
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
        <HoverCard style={{ padding: 24, border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 20, background: 'rgba(239, 68, 68, 0.02)' }} className="staggered-fade danger-glow">
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

      {/* New Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Task Priority Distribution */}
        <HoverCard style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 20 }} className="staggered-fade">
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={20} color="#3b82f6" /> Task Priority Distribution
          </h3>
          <div style={{ height: 280, width: '100%', position: 'relative' }}>
            {loading ? (
              <div className="loading-center"><Shimmer h={200} w={200} r={100} /></div>
            ) : priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={100}
                    paddingAngle={5} dataKey="value"
                    stroke="none"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={{ stroke: 'var(--text-muted)', strokeWidth: 1 }}
                  >
                    {priorityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 600, color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No task priority data.</div>
            )}
          </div>
        </HoverCard>

        {/* Task Completion Trend */}
        <HoverCard style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 20 }} className="staggered-fade">
          <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={20} color="#10b981" /> Task Completion (7 Days)
          </h3>
          <div style={{ height: 280, width: '100%' }}>
            {loading ? (
              <div className="loading-center"><Shimmer h={200} w="90%" r={12} /></div>
            ) : taskTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskTrendData}>
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)" 
                    style={{ fontSize: 12 }}
                    tick={{ fill: 'var(--text-muted)' }}
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    style={{ fontSize: 12 }}
                    tick={{ fill: 'var(--text-muted)' }}
                  />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 600, color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No completion data available.</div>
            )}
          </div>
        </HoverCard>
      </div>

      {/* Lead Conversion Trend */}
      <HoverCard style={{ padding: 24, border: '1px solid var(--border)', borderRadius: 20 }} className="staggered-fade">
        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 24px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={20} color="var(--primary)" /> Lead Conversion Trend (7 Days)
        </h3>
        <div style={{ height: 300, width: '100%' }}>
          {loading ? (
            <div className="loading-center"><Shimmer h={200} w="90%" r={12} /></div>
          ) : conversionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData}>
                <XAxis 
                  dataKey="date" 
                  stroke="var(--text-muted)" 
                  style={{ fontSize: 12 }}
                  tick={{ fill: 'var(--text-muted)' }}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  style={{ fontSize: 12 }}
                  tick={{ fill: 'var(--text-muted)' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12, fontWeight: 600, color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: 'var(--text-muted)', marginBottom: 8 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 20 }}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{value}</span>}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Total Leads"
                />
                <Line 
                  type="monotone" 
                  dataKey="converted" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Converted"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">No conversion data available.</div>
          )}
        </div>
      </HoverCard>

      {/* Recents Lists Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* Recent Leads */}
        <HoverCard className="staggered-fade" style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
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
        <HoverCard className="staggered-fade" style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
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
        
        .hover-card {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .hover-card:hover {
          border-color: var(--border-2);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99, 102, 241, 0.1);
        }
        
        .hover-card .hover-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
          pointer-events: none;
          transition: opacity 0.3s;
          z-index: 0;
        }
        
        .hover-card .card-content {
          position: relative;
          z-index: 1;
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 1024px) {
           .dashboard-fade-in > div:nth-child(4) { grid-template-columns: 1fr; }
           .dashboard-fade-in > div:nth-child(5) { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
