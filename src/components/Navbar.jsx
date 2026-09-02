import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Bell, Search, Menu, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ mobileOpen, setMobileOpen }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then((data) => setNotifications(data))
        .catch(() => {});
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/verify/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 shadow-sm">
      {/* Mobile Hamburger Menu Toggle + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xs sm:max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Verify Cert # / Serial..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>LM Act 2009 System</span>
        </div>

        {/* Notifications dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800">Notifications</h4>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-3 text-xs ${n.read ? 'bg-white' : 'bg-slate-50 font-medium'}`}>
                      <p className="font-semibold text-slate-800">{n.title}</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[110px]">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{user?.organization || user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
