import React, { useEffect, useState } from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { getAuditLogs } from '../api/audit';

type Log = { log_id: number; action: string; entity: string; entity_id: number; performed_by: number; created_at: string; user_name?: string; };

export default function AuditPage() {
  const [logs, setLogs]       = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = async (p: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAuditLogs({ page: p, limit: 20 });
      console.log('Audit logs response:', res.data);
      const arr = res.data.data ?? res.data.logs ?? [];
      setLogs(arr);
      setHasMore(arr.length === 20);
    } catch (err: any) {
      console.error('Audit logs error:', err);
      setError(err?.response?.data?.message || 'Failed to load audit logs');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const ENTITY_COLORS: Record<string, string> = {
    lead: '#6366f1', task: '#f59e0b', user: '#22c55e', customer: '#3b82f6',
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Audit Log</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Read-only record of all system actions</p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', color: 'var(--red)', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <AlertCircle size={20} />
          <span style={{ fontWeight: 600 }}>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrap">
          {loading
            ? <div className="loading-center"><div className="spinner" /></div>
            : logs.length === 0
              ? <div className="empty-state"><ClipboardList size={40} /><p>No audit logs yet</p></div>
              : <table>
                  <thead><tr><th>#</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>User</th><th>Time</th></tr></thead>
                  <tbody>
                    {logs.map((l) => {
                      const c = ENTITY_COLORS[l.entity] ?? '#64748b';
                      return (
                        <tr key={l.log_id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{l.log_id}</td>
                          <td style={{ fontWeight: 600 }}>{l.action}</td>
                          <td><span className="badge" style={{ color: c, background: `${c}18`, borderColor: `${c}40` }}>{l.entity}</span></td>
                          <td style={{ color: 'var(--text-muted)' }}>{l.entity_id}</td>
                          <td style={{ color: 'var(--text-muted)' }}>{l.user_name || `#${l.performed_by}`}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {new Date(l.created_at).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
          }
        </div>
      </div>

      {!error && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontSize: 13, padding: '5px 10px', color: 'var(--text-muted)' }}>Page {page}</span>
          <button className="btn btn-secondary btn-sm" disabled={!hasMore} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
