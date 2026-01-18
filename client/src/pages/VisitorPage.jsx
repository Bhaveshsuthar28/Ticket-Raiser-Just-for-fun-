import React, { useMemo, useState } from 'react';
import { apiFetch, getVisitorKey } from '../api/client.js';

export default function VisitorPage() {
  const visitorKey = useMemo(() => getVisitorKey(), []);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function createTicket(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const created = await apiFetch('/api/tickets', {
      method: 'POST',
      headers: { 'x-visitor-key': visitorKey },
      body: { name, message }
    });

    setName('');
    setMessage('');
    setSuccess('Ticket raised successfully.');
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">Visitor Mode</h2>

      <form className="mt-4" onSubmit={createTicket}>
        <label className="text-sm text-white/80">Name</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white outline-none focus:border-indigo-400/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />

        <label className="mt-3 block text-sm text-white/80">Message</label>
        <textarea
          className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white outline-none focus:border-indigo-400/50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your issue"
          required
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500" type="submit">
            Raise Ticket
          </button>
        </div>
      </form>

      {error ? <div className="mt-3 text-sm text-red-200">{error}</div> : null}
      {success ? <div className="mt-3 text-sm text-green-200">{success}</div> : null}

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Ticket Status</h3>
        <div className="mt-2 text-sm text-white/80">
          After raising a ticket, only admins can view, resolve, or delete it.
          You'll be notified by the admin when it's resolved.
        </div>
      </div>
    </div>
  );
}
