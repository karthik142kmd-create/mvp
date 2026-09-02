import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Scale, ShieldCheck, Search, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'LMO') return '/lmo/dashboard';
    if (user.role === 'GATC') return '/gatc/dashboard';
    return '/business/dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Government Style Header Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-lg">
        {/* Top Government Strip */}
        <div className="bg-slate-950 text-slate-400 text-[11px] py-1 px-6 flex justify-between items-center border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION</span>
            <span className="text-slate-600">•</span>
            <span>DEPARTMENT OF LEGAL METROLOGY</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Helpdesk: 1800-11-4000</span>
            <span>SIH 2026 Official Portal</span>
          </div>
        </div>

        {/* Main Nav */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-tight">National Legal Metrology Portal</h1>
              <p className="text-[11px] text-blue-300 font-medium">Digital Verification & Stamping Certification</p>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/verify" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors">
              <Search className="w-3.5 h-3.5" />
              Verify Certificate
            </Link>

            {user ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-900/30 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 hover:border-slate-500 rounded-lg transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <Scale className="w-5 h-5 text-blue-400" />
              <span>Legal Metrology Portal</span>
            </div>
            <p className="text-slate-400 text-[12px] leading-relaxed">
              Unified digital platform for registration, inspection scheduling, field verification logging, and QR-authenticated stamping certification under Legal Metrology Act, 2009.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-[12px]">
              <li><Link to="/verify" className="hover:text-white transition-colors">Verify Certificate Authenticity</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Business / Owner Login</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Inspector Portal (LMO/GATC)</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register New Instrument Owner</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Statutory Rules</h4>
            <ul className="space-y-2 text-[12px]">
              <li>The Legal Metrology Act, 2009</li>
              <li>The Legal Metrology (General) Rules, 2011</li>
              <li>Government Approved Test Centre Rules</li>
              <li>Maximum Permissible Error (MPE) Limits</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">SIH 2026 Demonstration</h4>
            <p className="text-[12px] text-slate-400 mb-2">Developed for Smart India Hackathon Judging.</p>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] text-slate-300">
              <span className="font-semibold text-emerald-400">✓ End-to-End Workflow Active</span>
              <p className="mt-1">All roles, QR verification, field inspection mode & PDF engine fully functional.</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © 2026 Legal Metrology Department. Built for SIH Hackathon Evaluation. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
