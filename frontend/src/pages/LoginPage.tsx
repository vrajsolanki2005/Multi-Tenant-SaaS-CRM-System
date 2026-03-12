import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── Mouse-tracking glow input ────────────────────────────────────
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

// ── Social icons ──────────────────────────────────────────────────
const SOCIALS = [
  // Google
  <svg key="g" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.28 5 12c0-4.19 3.27-7.27 7.18-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81"/></svg>,
  // LinkedIn
  <svg key="l" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/></svg>,
  // GitHub
  <svg key="gh" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>,
];

// ── Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Mouse glow tracking on the card
  const [glowPos, setGlowPos]   = useState({ x: -300, y: -300 });
  const [glowVis, setGlowVis]   = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - r.left - 250, y: e.clientY - r.top - 250 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="dark-auth-wrap">
      <div className="dark-auth-card">

        {/* ── Left panel ─────────────────────────────── */}
        <div
          className="dark-auth-left"
          onMouseMove={onMouseMove}
          onMouseEnter={() => setGlowVis(true)}
          onMouseLeave={() => setGlowVis(false)}
        >
          {/* Glow orb */}
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
              <h1 style={{ color: 'var(--auth-heading)', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>Welcome back</h1>
              <p style={{ color: 'var(--auth-muted)', fontSize: 13 }}>Sign in to your workspace</p>
            </div>

            {error && <div className="dark-error">{error}</div>}

            {/* Social */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIALS.map((icon, i) => (
                <button key={i} type="button" className="dark-social-btn">{icon}</button>
              ))}
            </div>

            <div className="dark-divider">or continue with email</div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <DarkInput placeholder="Email address" type="email" value={email} onChange={setEmail} />
              <DarkInput placeholder="Password" type="password" value={password} onChange={setPassword} />

              <div style={{ textAlign: 'right' }}>
                <a href="#" style={{ fontSize: 12, color: '#86efac', fontWeight: 500 }}>Forgot password?</a>
              </div>

              <button type="submit" className="dark-btn" disabled={loading}>
                <div className="dark-btn-shimmer" />
                {loading
                  ? <span className="spinner" style={{ width: 16, height: 16, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                  : 'Sign In'}
              </button>
            </form>

            <div className="dark-authswitch">
              New here? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>

        {/* ── Right panel (image) ─────────────────────── */}
        <div className="dark-auth-right">
          <img
            src="https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=900"
            alt="CRM workspace"
          />
          <div className="dark-auth-right-overlay">
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 22, lineHeight: 1.3, marginBottom: 10 }}>
              Manage requests,<br />resolve faster.
            </div>
            <div style={{ color: 'rgba(255,255,255,.65)', fontSize: 13 }}>
              Streamlined service management for modern teams.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
