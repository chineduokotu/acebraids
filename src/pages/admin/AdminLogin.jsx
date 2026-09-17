import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { adminLoginUser } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { PasswordField } from '../../components/common/PasswordField';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loading: checkingSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || checkingSession) return;
    setLoading(true);
    setError('');

    try {
      const data = await adminLoginUser({ email, password });
      login(data);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 text-ace-pink flex items-center justify-center mx-auto mb-4 shadow-pink-glow">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          Ace<span className="text-ace-pink font-serif italic text-3xl font-normal">Admin</span> Portal
        </h2>
        <p className="mt-2 text-xs text-neutral-400">
          Sign in to manage products, orders, video looks and catalog.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-neutral-900 py-8 px-6 shadow-2xl rounded-3xl border border-neutral-800 sm:px-10">
          <form onSubmit={handleSubmit} aria-busy={loading || checkingSession} className="space-y-5">
            {error && (
              <div role="alert" className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-neutral-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="admin-email"
                  name="email"
                  autoComplete="username"
                  disabled={loading || checkingSession}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-ace-pink"
                />
                <Mail aria-hidden="true" className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <PasswordField
              id="admin-password"
              name="password"
              label="Password"
              autoComplete="current-password"
              required
              disabled={loading || checkingSession}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <p role="status" aria-live="polite" className="text-xs text-neutral-400">{loading ? 'Signing in…' : checkingSession ? 'Checking your session…' : ''}</p>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={checkingSession}
              className="w-full text-xs font-bold uppercase tracking-wider py-3 shadow-pink-glow"
            >
              <span>Access Control Panel</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
