import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrg } from '../api/auth';

function DarkInput({
  placeholder, type = 'text', value, onChange,
}: { placeholder: string; type?: string; value: string; onChange: (v: string) => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <div className="dark-input-wrap"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        className="dark-input"
      />
      {hover && (
        <>
          <div className="dark-input-glow top" style={{ background: `radial-gradient(30px circle at ${pos.x}px 0px, #86efac 0%, transparent 70%)` }} />
          <div className="dark-input-glow bot" style={{ background: `radial-gradient(30px circle at ${pos.x}px 2px, #86efac 0%, transparent 70%)` }} />
        </>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', adminName: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [glowPos, setGlowPos] = useState({ x: -300, y: -300 });
  const [glowVis, setGlowVis] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - r.left - 250, y: e.clientY - r.top - 250 });
  }, []);

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await createOrg(form.name, form.adminName, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="dark-auth-wrap">
      <div className="dark-auth-card" style={{ maxWidth: 940, height: 'auto', minHeight: 580 }}>

        {/* Right image panel (shown on left visually by ordering) */}
        <div className="dark-auth-right" style={{ order: -1, borderRadius: '18px 0 0 18px' }}>
          <img
            src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="Sales team"
          />
          <div className="dark-auth-right-overlay">
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>
              Your team's command<br />centre awaits.
            </div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>
              Set up your organisation in under 2 minutes.
            </div>
          </div>
        </div>

        {/* Left / form panel */}
        <div
          className="dark-auth-left"
          onMouseMove={onMouseMove}
          onMouseEnter={() => setGlowVis(true)}
          onMouseLeave={() => setGlowVis(false)}
        >
          <div className="dark-auth-glow" style={{
            transform: `translate(${glowPos.x}px, ${glowPos.y}px)`,
            opacity: glowVis ? 1 : 0,
          }} />

          <div className="dark-auth-form">
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#22c55e,#fbbf24)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ color: 'var(--auth-heading)', fontWeight: 800, fontSize: 16 }}>FlowCRM</span>
            </div>

            <div>
              <h1 style={{ color: 'var(--auth-heading)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Create your workspace</h1>
              <p style={{ color: 'var(--auth-muted)', fontSize: 13 }}>Fill in the details to get started</p>
            </div>

            {error && <div className="dark-error">{error}</div>}
            {success && (
              <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)', color: '#86efac', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
                Organisation created! Redirecting to login…
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <DarkInput placeholder="Organisation name" type="text" value={form.name} onChange={set('name')} />
                <DarkInput placeholder="Your full name" type="text" value={form.adminName} onChange={set('adminName')} />
              </div>
              <DarkInput placeholder="Work email" type="email" value={form.email} onChange={set('email')} />
              <DarkInput placeholder="Password (min 8 chars)" type="password" value={form.password} onChange={set('password')} />

              <button type="submit" className="dark-btn" disabled={loading || success}>
                <div className="dark-btn-shimmer" />
                {loading
                  ? <span className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                  : 'Create Organisation'}
              </button>
            </form>

            <div className="dark-authswitch">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
