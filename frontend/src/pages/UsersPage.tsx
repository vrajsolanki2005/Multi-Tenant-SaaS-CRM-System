import React, { useEffect, useState, useCallback } from 'react';
import { Users, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { useAuth } from '../context/AuthContext';

const ROLE_CFG: Record<string, [string, string]> = {
  superAdmin: ['#8b5cf6', '#f5f3ff'], admin: ['#ef4444', '#fee2e2'],
  manager: ['#f59e0b', '#fef3c7'], sales: ['#3b82f6', '#dbeafe'],
};

type User = { user_id: number; user_name: string; user_email: string; user_role: string; is_active: boolean; created_at: string; };

export default function UsersPage() {
  const { isAdmin, isManager } = useAuth();
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm]       = useState({ user_name: '', user_email: '', user_password: '', user_role: 'sales' });
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data.data ?? []);
      setTotal(res.data.pagination?.total ?? 0);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ user_name: '', user_email: '', user_password: '', user_role: 'sales' }); setModal(true); };
  const openEdit   = (u: User) => { setEditing(u); setForm({ user_name: u.user_name, user_email: u.user_email, user_password: '', user_role: u.user_role }); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateUser(editing.user_id, { user_name: form.user_name, user_email: form.user_email, user_role: form.user_role }); showToast('User updated'); }
      else          { await createUser({ ...form }); showToast('User created'); }
      setModal(false); load();
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || 'Error';
      showToast(msg, true);
    } 
    finally { setSaving(false); }
  };

  const handleDelete = async (u: User) => {
    if (!confirm(`Delete user "${u.user_name}"?`)) return;
    await deleteUser(u.user_id); showToast('User deleted'); load();
  };

  function showToast(msg: string, _e = false) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Team Members</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{total} members</p>
        </div>
        {isManager && <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> Add Member</button>}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : users.length === 0
              ? <div className="empty-state"><Users size={40} /><p>No users</p></div>
              : <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th>{isAdmin && <th>Actions</th>}</tr></thead>
                  <tbody>
                    {users.map(u => {
                      const [c, bg] = ROLE_CFG[u.user_role] ?? ['#64748b', '#f8fafc'];
                      return (
                        <tr key={u.user_id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="avatar" style={{ width: 30, height: 30, fontSize: 11 }}>{u.user_name?.charAt(0)?.toUpperCase()}</div>
                              <span style={{ fontWeight: 600 }}>{u.user_name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>{u.user_email}</td>
                          <td><span className="badge" style={{ color: c, background: bg }}>{u.user_role}</span></td>
                          <td>
                            <span className="badge" style={u.is_active ? { color: '#166534', background: '#dcfce7' } : { color: '#991b1b', background: '#fee2e2' }}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                          {isAdmin && (
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn-icon" onClick={() => openEdit(u)}><Pencil size={14} /></button>
                                <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(u)}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
          }
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Member' : 'Add Team Member'}</span>
              <button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group"><label className="label">Full Name</label>
                <input className="input" required value={form.user_name} onChange={e => setForm(f => ({ ...f, user_name: e.target.value }))} placeholder="Jane Doe" />
              </div>
              <div className="form-group"><label className="label">Email</label>
                <input className="input" type="email" required value={form.user_email} onChange={e => setForm(f => ({ ...f, user_email: e.target.value }))} placeholder="jane@company.com" />
              </div>
              {!editing && (
                <div className="form-group"><label className="label">Password</label>
                  <input className="input" type="password" required value={form.user_password} onChange={e => setForm(f => ({ ...f, user_password: e.target.value }))} placeholder="e.g. MyPass1" />
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Min 8 chars · must include uppercase, lowercase &amp; a digit</p>
                </div>
              )}
              <div className="form-group"><label className="label">Role</label>
                <select className="input select" value={form.user_role} onChange={e => setForm(f => ({ ...f, user_role: e.target.value }))}>
                  <option value="sales">Sales</option>
                  <option value="manager">Manager</option>
                  {isAdmin && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : editing ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && <div className="toast-container"><div className="toast success">{toast}</div></div>}
    </div>
  );
}
