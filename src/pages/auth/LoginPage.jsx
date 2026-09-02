import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Scale, LogIn, Key, Sparkles, Shield, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'LMO') navigate('/lmo/dashboard');
      else if (user.role === 'GATC') navigate('/gatc/dashboard');
      else navigate('/business/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
    setLoading(true);
    try {
      const user = await login(demoEmail, 'demo123');
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'LMO') navigate('/lmo/dashboard');
      else if (user.role === 'GATC') navigate('/gatc/dashboard');
      else navigate('/business/dashboard');
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Portal Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">Legal Metrology Verification & Certification</p>
        </div>

        {/* Demo Fast Login Buttons for SIH Judges */}
        <div className="mb-6 p-4 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>SIH Evaluator Demo Accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3">Click any role to auto-login with pre-seeded data:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickFill('business@demo.com')}
              className="px-3 py-2 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 text-left transition-colors flex items-center gap-2 border border-slate-700"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Business</span>
            </button>
            <button
              onClick={() => handleQuickFill('lmo@demo.com')}
              className="px-3 py-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 text-left transition-colors flex items-center gap-2 border border-slate-700"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>LMO Officer</span>
            </button>
            <button
              onClick={() => handleQuickFill('gatc@demo.com')}
              className="px-3 py-2 bg-slate-800 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 text-left transition-colors flex items-center gap-2 border border-slate-700"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              <span>GATC Test</span>
            </button>
            <button
              onClick={() => handleQuickFill('admin@demo.com')}
              className="px-3 py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-semibold text-slate-200 text-left transition-colors flex items-center gap-2 border border-slate-700"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. business@demo.com"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
