import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client.js';
import { formatDateTime } from '../utils/format.js';

export default function AdminTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) navigate('/admin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadAll() {
    setError('');
    const data = await apiFetch('/api/admin/tickets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTickets(data);
  }

  useEffect(() => {
    if (!token) return;
    loadAll().catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function resolveTicket(id) {
    setError('');
    setSuccess('');
    const updated = await apiFetch(`/api/admin/tickets/${id}/resolve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    setTickets((prev) => prev.map((t) => (t._id === id ? updated : t)));
    setSuccess('Ticket resolved.');
  }

  function logout() {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Admin Tickets</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/5"
            onClick={() => loadAll().catch((e) => setError(e.message))}
          >
            Refresh
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/5"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="mt-3 text-sm text-green-200">{success}</div> : null}

      <div className="mt-4 grid gap-3">
        {tickets.map((t) => (
          <div key={t._id} className="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{t.name}</div>
                <div className="mt-1 text-xs text-white/60">{formatDateTime(t.createdAt)}</div>
              </div>
              <span
                className={
                  `inline-flex items-center rounded-full border px-3 py-1 text-xs ` +
                  (t.status === 'resolved'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                    : 'border-amber-400/30 bg-amber-400/10 text-amber-100')
                }
              >
                {t.status}
              </span>
            </div>

            <div className="mt-3 whitespace-pre-wrap text-sm text-white/90">{t.message}</div>
            <div className="mt-3 text-xs text-white/60">Ticket ID: {t._id}</div>

            <div className="mt-4 flex justify-end">
              {t.status !== 'resolved' ? (
                <button
                  type="button"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                  onClick={() => resolveTicket(t._id)}
                >
                  Resolve
                </button>
              ) : null}
            </div>
          </div>
        ))}

        {tickets.length === 0 ? <div className="text-sm text-white/60">No tickets found.</div> : null}
      </div>
    </div>
  );
}
