import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import VisitorPage from './pages/VisitorPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminTicketsPage from './pages/AdminTicketsPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <header className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
          <div className="text-lg font-semibold tracking-tight">Ticket System</div>
          <nav className="flex items-center gap-4 text-sm">
            <Link className="text-indigo-200 hover:text-indigo-100" to="/">Visitor</Link>
            <Link className="text-indigo-200 hover:text-indigo-100" to="/admin">Admin</Link>
          </nav>
        </header>

        <main className="mt-5">
          <Routes>
            <Route path="/" element={<VisitorPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/tickets" element={<AdminTicketsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
