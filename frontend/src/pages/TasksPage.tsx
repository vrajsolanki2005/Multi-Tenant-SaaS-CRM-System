import React, { useEffect, useState, useCallback } from 'react';
import { CheckSquare, Plus, Pencil, Trash2, X } from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import { getLeads } from '../api/leads';
import { getUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';

const PRIORITY_CFG: Record<string, [string, string]> = {
  low: ['#22c55e', '#dcfce7'], medium: ['#3b82f6', '#dbeafe'],
  high: ['#f59e0b', '#fef3c7'], urgent: ['#ef4444', '#fee2e2'],
};
const STATUS_CFG: Record<string, [string, string]> = {
  pending: ['#f59e0b', '#fef3c7'], in_progress: ['#3b82f6', '#dbeafe'], completed: ['#22c55e', '#dcfce7'],
};

type Task = { task_id: number; task_name: string; description: string; status: string; priority: string; due_date: string; lead_id: number | null; assigned_to: number | null; };

export default function TasksPage() {
  const { user, isManager, isAdmin, isSales } = useAuth();
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [leads, setLeads]     = useState<any[]>([]);
  const [users, setUsers]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState({ status: '', priority: '' });
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm]       = useState({ task_name: '', description: '', status: 'pending', priority: 'medium', due_date: '', lead_id: '', assigned_to: '' });
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, leadsRes, usersRes] = await Promise.all([
        getTasks({ status: filter.status || undefined, priority: filter.priority || undefined }),
        getLeads(1),
        getUsers(),
      ]);
      setTasks(tasksRes.data.tasks ?? []);
      setLeads(leadsRes.data.leads ?? []);
      setUsers(usersRes.data.data ?? []);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { 
    console.log('User role:', user?.role, 'isManager:', isManager, 'isAdmin:', isAdmin, 'isSales:', isSales);
    if (isSales) {
      showToast('Only managers can create tasks', true);
      return;
    }
    setEditing(null); 
    setForm({ task_name: '', description: '', status: 'pending', priority: 'medium', due_date: '', lead_id: '', assigned_to: '' }); 
    setModal(true); 
  };
  const openEdit   = (t: Task) => { 
    if (isSales && t.assigned_to !== user?.userId) {
      showToast('You can only edit tasks assigned to you', true);
      return;
    }
    setEditing(t); 
    setForm({ task_name: t.task_name, description: t.description ?? '', status: t.status, priority: t.priority, due_date: t.due_date?.slice(0, 10) ?? '', lead_id: t.lead_id?.toString() ?? '', assigned_to: t.assigned_to?.toString() ?? '' }); 
    setModal(true); 
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const data = { 
      task_name: form.task_name, 
      description: form.description, 
      status: form.status, 
      priority: form.priority, 
      due_date: form.due_date || undefined, 
      lead_id: form.lead_id ? +form.lead_id : null, 
      assigned_to: form.assigned_to ? +form.assigned_to : null 
    };
    console.log('Saving task with data:', data);
    console.log('Form assigned_to value:', form.assigned_to);
    console.log('Final assigned_to value:', data.assigned_to);
    try {
      if (editing) { await updateTask(editing.task_id, data); showToast('Task updated'); }
      else          { await createTask(data); showToast('Task created'); }
      setModal(false); load();
    } catch (err: any) { showToast(err?.response?.data?.message ?? 'Error', true); }
    finally { setSaving(false); }
  };

  const handleDelete = async (t: Task) => {
    if (!confirm(`Delete "${t.task_name}"?`)) return;
    await deleteTask(t.task_id); showToast('Task deleted'); load();
  };

  function showToast(msg: string, _e = false) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Tasks</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{tasks.length} tasks</p>
        </div>
        {(isManager || isAdmin) && <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> New Task</button>}
      </div>

      {/* Filters */}
      <div className="filters">
        <select className="input select" style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
          <option value="">All Status</option>
          {['pending', 'in_progress', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input select" style={{ width: 'auto', fontSize: 12, padding: '5px 10px' }} value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}>
          <option value="">All Priority</option>
          {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : tasks.length === 0
              ? <div className="empty-state"><CheckSquare size={40} /><p>No tasks found</p></div>
              : <table>
                  <thead><tr><th>Task</th><th>Priority</th><th>Status</th><th>Due Date</th>{isManager && <th>Actions</th>}</tr></thead>
                  <tbody>
                    {tasks.map(t => {
                      const [pc, pbg] = PRIORITY_CFG[t.priority] ?? ['#64748b', '#f8fafc'];
                      const [sc, sbg] = STATUS_CFG[t.status] ?? ['#64748b', '#f8fafc'];
                      const isOverdue = t.due_date && t.status !== 'completed' && new Date(t.due_date) < new Date();
                      return (
                        <tr key={t.task_id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{t.task_name}</div>
                            {t.description && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.description.slice(0, 60)}</div>}
                            {t.lead_title && <div style={{ fontSize: 11, color: 'var(--primary)', marginTop: 2 }}>📋 {t.lead_title}</div>}
                          </td>
                          <td><span className="badge" style={{ color: pc, background: pbg }}>{t.priority}</span></td>
                          <td><span className="badge" style={{ color: sc, background: sbg }}>{t.status.replace('_', ' ')}</span></td>
                          <td style={{ fontSize: 12, color: isOverdue ? 'var(--red)' : 'var(--text-muted)', fontWeight: isOverdue ? 600 : 400 }}>
                            {t.due_date ? new Date(t.due_date).toLocaleDateString() : '—'}
                            {isOverdue && ' ⚠'}
                          </td>
                          {(isManager || isAdmin) && (
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn-icon" onClick={() => openEdit(t)}><Pencil size={14} /></button>
                                {isAdmin && <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(t)}><Trash2 size={14} /></button>}
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
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Task' : 'New Task'}</span>
              <button className="btn-icon" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group"><label className="label">Task Name</label>
                <input className="input" required value={form.task_name} onChange={e => setForm(f => ({ ...f, task_name: e.target.value }))} placeholder="Follow up call with Acme" />
              </div>
              <div className="form-group"><label className="label">Description</label>
                <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="label">Status</label>
                  <select className="input select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {['pending', 'in_progress', 'completed'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="label">Priority</label>
                  <select className="input select" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    {['low', 'medium', 'high', 'urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group"><label className="label">Due Date</label>
                  <input className="input" type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
                </div>
                <div className="form-group"><label className="label">Assign To</label>
                  <select className="input select" value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} disabled={isSales}>
                    <option value="">Unassigned</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.user_name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="label">Link to Lead</label>
                <select className="input select" value={form.lead_id} onChange={e => setForm(f => ({ ...f, lead_id: e.target.value }))}>
                  <option value="">No lead</option>
                  {leads.map(l => <option key={l.lead_id} value={l.lead_id}>{l.title}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : editing ? 'Save' : 'Create Task'}
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
