import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client.js';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) navigate('/admin/tickets', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(e) {
    e.preventDefault();
    setError('');

    try {
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        body: { username, password }
      });

      localStorage.setItem('adminToken', data.token);
      navigate('/admin/tickets');
    } catch (e) {
      setError(e.message || 'Login failed');
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-semibold">Admin Login</h2>

      <form className="mt-4" onSubmit={login}>
        <label className="text-sm text-white/80">Username</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white outline-none focus:border-indigo-400/50"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
        />

        <label className="mt-3 block text-sm text-white/80">Password</label>
        <input
          className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-white outline-none focus:border-indigo-400/50"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="admin123"
          required
        />

        <div className="mt-3 flex items-center gap-2">
          <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500" type="submit">
            Login
          </button>
        </div>
      </form>

      {error ? <div className="mt-3 text-sm text-red-200">{error}</div> : null}

      <div className="mt-3 text-xs text-white/60">Enter admin username and password.</div>
    </div>
  );
}
