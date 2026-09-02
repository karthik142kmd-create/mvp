import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Scale,
  FileText,
  PlusCircle,
  Award,
  Bell,
  User,
  LogOut,
  Calendar,
  CheckSquare,
  Users,
  ShieldAlert,
  BarChart3,
  Search,
  X,
} from 'lucide-react';

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const roleNavMap = {
    BUSINESS: [
      { name: 'Dashboard', path: '/business/dashboard', icon: LayoutDashboard },
      { name: 'My Instruments', path: '/business/instruments', icon: Scale },
      { name: 'Applications', path: '/business/applications', icon: FileText },
      { name: 'Apply Verification', path: '/business/applications/new', icon: PlusCircle },
      { name: 'Certificates', path: '/business/certificates', icon: Award },
      { name: 'Notifications', path: '/business/notifications', icon: Bell },
      { name: 'Profile', path: '/business/profile', icon: User },
    ],
    LMO: [
      { name: 'LMO Dashboard', path: '/lmo/dashboard', icon: LayoutDashboard },
      { name: 'Inspection Queue', path: '/lmo/queue', icon: CheckSquare },
      { name: 'My Schedule', path: '/lmo/schedule', icon: Calendar },
      { name: 'Verification History', path: '/lmo/history', icon: Award },
    ],
    GATC: [
      { name: 'GATC Dashboard', path: '/gatc/dashboard', icon: LayoutDashboard },
      { name: 'Assigned Tests', path: '/gatc/assignments', icon: CheckSquare },
    ],
    ADMIN: [
      { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/admin/users', icon: Users },
      { name: 'Instruments Master', path: '/admin/instruments', icon: Scale },
      { name: 'Applications', path: '/admin/applications', icon: FileText },
      { name: 'Schedule Master', path: '/admin/schedules', icon: Calendar },
      { name: 'Certificates Vault', path: '/admin/certificates', icon: Award },
      { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
      { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    ],
  };

  const navItems = roleNavMap[user?.role] || roleNavMap.BUSINESS;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container (Slide-over drawer on Mobile, Fixed sidebar on Desktop) */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 shadow-2xl lg:shadow-xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-sm leading-tight tracking-tight">Legal Metrology</h1>
              <p className="text-[11px] text-slate-400 font-medium">Digital Verification Portal</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Pill */}
        <div className="px-5 py-3 bg-slate-800/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">{user?.role} ROLE</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavLink
              to="/verify"
              onClick={handleNavClick}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-amber-400 hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Public Certificate Verify</span>
            </NavLink>
          </div>
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
