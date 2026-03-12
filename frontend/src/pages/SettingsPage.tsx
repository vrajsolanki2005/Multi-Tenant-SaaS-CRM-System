import React, { useState } from 'react';
import { User, Shield, Lock, Trash2, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateMe, updatePassword, deleteMe } from '../api/users';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password state
  const [pw, setPw] = useState({ old: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);

  // Cookie preference
  const [cookies, setCookies] = useState(true);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updateMe({ user_name: profile.name, user_email: profile.email });
      updateUser({ name: profile.name, email: profile.email });
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.new !== pw.confirm) {
      return setPwMsg({ type: 'error', text: 'New passwords do not match' });
    }
    setIsUpdatingPw(true);
    setPwMsg({ type: '', text: '' });
    try {
      await updatePassword({ oldPassword: pw.old, newPassword: pw.new });
      setPwMsg({ type: 'success', text: 'Password changed successfully' });
      setPw({ old: '', new: '', confirm: '' });
      setTimeout(() => setPwMsg({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      try {
        await deleteMe();
        logout();
        navigate('/login');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="settings-wrap">
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <p className="settings-subtitle">Manage your personal profile, security, and preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="settings-card profile-card">
          <div className="settings-section-head">
            <div className="settings-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <User size={22} />
            </div>
            <h2 className="settings-section-title">Personal Information</h2>
          </div>
          
          <form onSubmit={handleUpdateProfile}>
            <div className="settings-input-row">
              <div className="form-group">
                <label className="settings-label">Full Name</label>
                <input 
                  className="settings-control" 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="settings-label">Email Address</label>
                <input 
                  className="settings-control" 
                  type="email"
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="settings-label">Access Role</label>
              <input 
                className="settings-control" 
                value={user?.role || ''} 
                disabled 
                style={{ opacity: 0.6, cursor: 'not-allowed', textTransform: 'capitalize' }}
              />
            </div>

            {profileMsg.text && (
              <div style={{ 
                marginTop: 20, padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: profileMsg.type === 'success' ? 'var(--green-bg)' : 'var(--red-bg)',
                color: profileMsg.type === 'success' ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {profileMsg.text}
              </div>
            )}

            <div className="settings-footer">
              <button type="submit" className="settings-btn primary" disabled={isUpdatingProfile}>
                <Save size={18} />
                {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Card */}
        <div className="settings-card security-card">
          <div className="settings-section-head">
            <div className="settings-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Lock size={22} />
            </div>
            <h2 className="settings-section-title">Security & Password</h2>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="settings-label">Current Password</label>
              <input 
                className="settings-control" 
                type="password"
                value={pw.old}
                onChange={e => setPw({...pw, old: e.target.value})}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="settings-input-row" style={{ marginTop: 20 }}>
              <div className="form-group">
                <label className="settings-label">New Password</label>
                <input 
                  className="settings-control" 
                  type="password"
                  value={pw.new}
                  onChange={e => setPw({...pw, new: e.target.value})}
                  placeholder="Min 8 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="settings-label">Confirm New Password</label>
                <input 
                  className="settings-control" 
                  type="password"
                  value={pw.confirm}
                  onChange={e => setPw({...pw, confirm: e.target.value})}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {pwMsg.text && (
              <div style={{ 
                marginTop: 20, padding: '12px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: pwMsg.type === 'success' ? 'var(--green-bg)' : 'var(--red-bg)',
                color: pwMsg.type === 'success' ? 'var(--green)' : 'var(--red)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                {pwMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {pwMsg.text}
              </div>
            )}

            <div className="settings-footer">
              <button type="submit" className="settings-btn" style={{ background: 'var(--accent)', color: '#000' }} disabled={isUpdatingPw}>
                {isUpdatingPw ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Privacy Card */}
        <div className="settings-card privacy-card">
          <div className="settings-section-head">
            <div className="settings-icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <Shield size={22} />
            </div>
            <h2 className="settings-section-title">Privacy & Cookies</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--surface-2)', borderRadius: 12 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Cookie Preferences</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Essential and analytics cookies.</div>
            </div>
            <button 
              className={`toggle-switch ${cookies ? 'active' : ''}`}
              onClick={() => setCookies(!cookies)}
            />
          </div>
        </div>

        {/* Danger Card */}
        <div className="settings-card danger-card">
          <div className="settings-section-head">
            <div className="settings-icon-box" style={{ background: 'var(--red-bg)', color: 'var(--red)' }}>
              <Trash2 size={22} />
            </div>
            <h2 className="settings-section-title" style={{ color: 'var(--red)' }}>Danger Zone</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Deactivate Account</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Once you delete your account, there is no going back. Please be certain.</div>
            </div>
            <button className="settings-btn danger" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .settings-wrap { animation: fadeIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
