import React, { useEffect, useState, useCallback } from 'react';
import { Contact, Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../api/customers';
import { useAuth } from '../context/AuthContext';

interface Customer { customer_id: number; name: string; email: string; phone: string; created_at: string; }

export default function ContactsPage() {
  const { isManager, isAdmin } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<Customer | null>(null);
  const [form, setForm]           = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers(page);
      const d   = res.data;
      setCustomers(d.customers ?? d.data ?? []);
      setTotal(d.pagination?.total ?? 0);
    } finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', phone: '' }); setShowModal(true); };
  const openEdit   = (c: Customer) => { setEditing(c); setForm({ name: c.name, email: c.email, phone: c.phone }); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await updateCustomer(editing.customer_id, form); showToast('Contact updated'); }
      else          { await createCustomer(form); showToast('Contact created'); }
      setShowModal(false); load();
    } catch (err: any) {
      showToast(err?.response?.data?.message ?? 'Error saving contact', true);
    } finally { setSaving(false); }
  };

  const handleDelete = async (c: Customer) => {
    if (!confirm(`Delete contact "${c.name}"?`)) return;
    await deleteCustomer(c.customer_id);
    showToast('Contact deleted');
    load();
  };

  function showToast(msg: string, err = false) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Contacts</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{total} total contacts</p>
        </div>
        {isManager && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={15} /> Add Contact
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20, maxWidth: 340 }}>
        <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input className="input" style={{ paddingLeft: 32 }} placeholder="Search contacts…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : filtered.length === 0
              ? <div className="empty-state"><Contact size={40} /><p>No contacts found</p></div>
              : <table>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Added</th>{(isManager || isAdmin) && <th>Actions</th>}</tr></thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.customer_id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="avatar" style={{ width: 30, height: 30, fontSize: 11, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{c.phone}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString()}</td>
                        {(isManager || isAdmin) && (
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn-icon" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                              {isAdmin && <button className="btn-icon" style={{ color: 'var(--red)' }} onClick={() => handleDelete(c)}><Trash2 size={14} /></button>}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
          }
        </div>
      </div>

      {/* Pagination */}
      {total > 15 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontSize: 13, padding: '5px 10px', color: 'var(--text-muted)' }}>Page {page}</span>
          <button className="btn btn-secondary btn-sm" disabled={customers.length < 15} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Contact' : 'New Contact'}</span>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group"><label className="label">Name</label>
                <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Smith" />
              </div>
              <div className="form-group"><label className="label">Email</label>
                <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@company.com" />
              </div>
              <div className="form-group"><label className="label">Phone</label>
                <input className="input" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 000 0000" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : editing ? 'Save Changes' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-container">
          <div className="toast success">{toast}</div>
        </div>
      )}
    </div>
  );
}
