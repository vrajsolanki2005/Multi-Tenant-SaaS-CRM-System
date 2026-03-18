import React, { useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Shared Dark Input ───────────────────────────────────────────── */
function DarkInput({ placeholder, type = 'text', value, onChange }: {
  placeholder: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };
  return (
    <div className="dark-input-wrap" onMouseMove={onMove} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="dark-input" />
      {hover && <>
        <div className="dark-input-glow top" style={{ background: `radial-gradient(30px circle at ${pos.x}px 0px, #86efac 0%, transparent 70%)` }} />
        <div className="dark-input-glow bot" style={{ background: `radial-gradient(30px circle at ${pos.x}px 2px, #86efac 0%, transparent 70%)` }} />
      </>}
    </div>
  );
}

/* ── OAuth buttons ───────────────────────────────────────────────── */
const BACKEND = typeof window !== 'undefined'
  ? (import.meta.env.VITE_API_URL || 'http://localhost:3000')
  : 'http://localhost:3000';

const OAUTH_PROVIDERS = [
  {
    label: 'Google',
    href: `${BACKEND}/auth/google`,
    bg: '#fff',
    color: '#1a1a1a',
    border: 'rgba(255,255,255,0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: `${BACKEND}/auth/linkedin`,
    bg: '#0A66C2',
    color: '#fff',
    border: 'rgba(10,102,194,0.5)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.94 5a2 2 0 1 1-4-.002A2 2 0 0 1 6.94 5M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: `${BACKEND}/auth/github`,
    bg: '#24292e',
    color: '#fff',
    border: 'rgba(255,255,255,0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>
      </svg>
    ),
  },
];

/* ── Login Page ──────────────────────────────────────────────────── */
export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [params]    = useSearchParams();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(
    params.get('error') === 'oauth_failed' ? 'OAuth sign-in failed. Please try again.' : ''
  );
  const [loading, setLoading]   = useState(false);
  const [glowPos, setGlowPos]   = useState({ x: -300, y: -300 });
  const [glowVis, setGlowVis]   = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setGlowPos({ x: e.clientX - r.left - 250, y: e.clientY - r.top - 250 });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password)     { setError('Please enter your password.'); return; }
    setError(''); setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="dark-auth-wrap">
      <div className="dark-auth-card">

        {/* Left panel — form */}
        <div className="dark-auth-left" onMouseMove={onMouseMove}
          onMouseEnter={() => setGlowVis(true)} onMouseLeave={() => setGlowVis(false)}>
          <div className="dark-auth-glow" style={{ transform: `translate(${glowPos.x}px, ${glowPos.y}px)`, opacity: glowVis ? 1 : 0 }} />

          <div className="dark-auth-form">
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ color: 'var(--auth-heading)', fontWeight: 800, fontSize: 18 }}>Flow<span style={{ color: '#00BFFF' }}>CRM</span></span>
            </div>

            <div>
              <h1 style={{ color: 'var(--auth-heading)', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Welcome back</h1>
              <p style={{ color: 'var(--auth-muted)', fontSize: 13 }}>Sign in to your workspace</p>
            </div>

            {error && <div className="dark-error">{error}</div>}

            {/* OAuth Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
              {OAUTH_PROVIDERS.map(p => (
                <a key={p.label} href={p.href} title={`Sign in with ${p.label}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 44, height: 44, borderRadius: '50%', border: `1px solid ${p.border}`,
                    background: p.bg, color: p.color,
                    textDecoration: 'none', cursor: 'pointer',
                    transition: 'opacity 0.15s, transform 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                  {p.icon}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'var(--auth-muted)', fontSize: 12, whiteSpace: 'nowrap' }}>or continue with email</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Email form */}
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

        {/* Right panel — image */}
        <div className="dark-auth-right">
          <img src="https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=900" alt="CRM workspace" />
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
