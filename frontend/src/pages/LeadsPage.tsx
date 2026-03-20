import React, { useEffect, useState, useCallback } from 'react';
import { Target, Plus, Trash2, Pencil, X, UserPlus } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead, assignLead } from '../api/leads';
import { getCustomers } from '../api/customers';
import { getUsers } from '../api/users';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS: Record<string, [string, string]> = {
  new:       ['#6366f1', '#e0e7ff'], contacted: ['#3b82f6', '#dbeafe'],
  qualified: ['#f59e0b', '#fef3c7'], converted: ['#22c55e', '#dcfce7'],
  closed:    ['#94a3b8', '#f1f5f9'],
};

const STATUS_FLOW: Record<string, string[]> = {
  new: ['contacted', 'closed'], contacted: ['qualified', 'closed'],
  qualified: ['converted', 'closed'], converted: [], closed: ['new'],
};

type Lead = { lead_id: number; title: string; status: string; value: number | null; customer_id: number | null; assigned_to: number | null; created_at: string; };

export default function LeadsPage() {
  const { isAdmin, isManager, isSales, user } = useAuth();
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [users, setUsers]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [modal, setModal]       = useState<'create' | 'edit' | 'assign' | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [form, setForm]         = useState({ title: '', status: 'new', value: '', customer_id: '', assigned_to: '' });
  const [assignUserId, setAssignUserId] = useState('');
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [leadsRes, custRes, usersRes] = await Promise.all([
        getLeads(page, statusFilter || undefined),
        getCustomers(1),
        getUsers(),
      ]);
      setLeads(leadsRes.data.leads ?? []);
      setTotal(leadsRes.data.pagination?.total ?? 0);
      setCustomers(custRes.data.customers ?? []);
      setUsers(usersRes.data.data ?? []);
    } finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { 
    if (isSales) {
      showToast('Only managers can create leads', true);
      return;
    }
    setForm({ title: '', status: 'new', value: '', customer_id: '', assigned_to: '' }); 
    setModal('create'); 
  };
  const openEdit   = (l: Lead) => { 
    if (isSales && l.assigned_to !== user?.userId) {
      showToast('You can only edit leads assigned to you', true);
      return;
    }
    setSelected(l); 
    setForm({ title: l.title, status: l.status, value: l.value?.toString() ?? '', customer_id: l.customer_id?.toString() ?? '', assigned_to: l.assigned_to?.toString() ?? '' }); 
    setModal('edit'); 
  };
  const openAssign = (l: Lead) => { setSelected(l); setAssignUserId(''); setModal('assign'); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { 
        title: form.title, 
        status: form.status, 
        value: form.value ? +form.value : undefined, 
        customer_id: form.customer_id ? +form.customer_id : null,
        assigned_to: form.assigned_to ? +form.assigned_to : null
      };
      console.log('Saving lead with data:', data);
      if (modal === 'edit' && selected) { await updateLead(selected.lead_id, { ...data, newStatus: data.status }); showToast('Lead updated'); }
      else { await createLead(data); showToast('Lead created'); }
      setModal(null); load();
    } catch (err: any) { showToast(err?.response?.data?.message ?? 'Error', true); }
    finally { setSaving(false); }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selected || !assignUserId) return; setSaving(true);
    try { await assignLead(selected.lead_id, +assignUserId); showToast('Lead assigned'); setModal(null); }
    catch (err: any) { showToast(err?.response?.data?.message ?? 'Error', true); }
    finally { setSaving(false); }
  };

  const handleDelete = async (l: Lead) => {
    if (!confirm(`Delete "${l.title}"?`)) return;
    await deleteLead(l.lead_id); showToast('Lead deleted'); load();
  };

  function showToast(msg: string, _err = false) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const STATUSES = ['new', 'contacted', 'qualified', 'converted', 'closed'];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Leads</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {isSales ? 'My leads' : `${total} total leads`}
          </p>
        </div>
        {isManager && <button className="btn btn-primary" onClick={openCreate}><Plus size={15} /> New Lead</button>}
      </div>

      {/* Status filters */}
      <div className="filters">
        <button className={`filter-chip${statusFilter === '' ? ' active' : ''}`} onClick={() => { setStatus(''); setPage(1); }}>All</button>
        {STATUSES.map(s => (
          <button key={s} className={`filter-chip${statusFilter === s ? ' active' : ''}`} style={statusFilter === s ? {} : { borderColor: `${STATUS_COLORS[s][0]}40`, color: STATUS_COLORS[s][0] }} onClick={() => { setStatus(s); setPage(1); }}>
            {s}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : leads.length === 0
              ? <div className="empty-state"><Target size={40} /><p>No leads found</p></div>
              : <table>
                  <thead><tr><th>Title</th><th>Status</th><th>Value</th><th>Created</th>{(isManager || isSales) && <th>Actions</th>}</tr></thead>
                  <tbody>
                    {leads.map(l => {
                      const [c, bg] = STATUS_COLORS[l.status] ?? ['#94a3b8', '#f1f5f9'];
                      const canEdit = isManager || (isSales && l.assigned_to === user?.userId);
                      return (
                        <tr key={l.lead_id}>
                          <td style={{ fontWeight: 600 }}>{l.title}</td>
                          <td><span className="badge" style={{ color: c, background: bg }}>{l.status}</span></td>
                          <td style={{ color: 'var(--text-muted)' }}>{l.value ? `$${Number(l.value).toLocaleString()}` : '—'}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(l.created_at).toLocaleDateString()}</td>
                          {(isManager || isSales) && (
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                {canEdit && <button className="btn-icon" onClick={() => openEdit(l)}><Pencil size={14} /></button>}
                                {isAdmin && <button className="btn-icon" onClick={() => openAssign(l)}><UserPlus size={14} /></button>}
                                {isAdmin && <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(l)}><Trash2 size={14} /></button>}
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

      {total > 15 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontSize: 13, padding: '5px 10px', color: 'var(--text-muted)' }}>Page {page}</span>
          <button className="btn btn-secondary btn-sm" disabled={leads.length < 15} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{modal === 'edit' ? 'Edit Lead' : 'New Lead'}</span>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group"><label className="label">Title</label>
                <input className="input" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Deal with Acme Inc." />
              </div>
              <div className="form-group"><label className="label">Status</label>
                <select className="input select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {(modal === 'edit' && selected ? STATUS_FLOW[selected.status] : STATUSES).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  {modal === 'edit' && <option value={selected?.status}>{selected?.status}</option>}
                </select>
              </div>
              <div className="form-group"><label className="label">Value ($)</label>
                <input className="input" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="5000" />
              </div>
              <div className="form-group"><label className="label">Customer</label>
                <select className="input select" value={form.customer_id} onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}>
                  <option value="">No customer</option>
                  {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="label">Assign To</label>
                <select className="input select" value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} disabled={isSales}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.user_id} value={u.user_id}>{u.user_name}</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : modal === 'edit' ? 'Save' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {modal === 'assign' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Assign Lead</span>
              <button className="btn-icon" onClick={() => setModal(null)}><X size={16} /></button>
            </div>
            <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Assign "<strong>{selected?.title}</strong>" to a team member.</p>
              <div className="form-group"><label className="label">Team Member</label>
                <select className="input select" required value={assignUserId} onChange={e => setAssignUserId(e.target.value)}>
                  <option value="">Select user…</option>
                  {users.map(u => <option key={u.user_id} value={u.user_id}>{u.user_name} ({u.user_role})</option>)}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Assign'}
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
