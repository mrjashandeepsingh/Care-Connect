import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      loginUser(res.user, res.user.role === 'DOCTOR' ? res.user.doctor : null);
      if (res.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/search');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Activity className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome to Care Connect</h1>
        <p className="text-xs text-slate-500">Sign in to track real-time healthcare queues or manage clinic flow.</p>
      </div>

      {/* Manual Login */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. yourname@example.com"
            required
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-bold text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-xs"
        >
          {loading ? 'Signing in...' : 'Sign In with Email'}
        </button>

        <p className="text-[11px] text-center text-slate-500 pt-1">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-700 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
