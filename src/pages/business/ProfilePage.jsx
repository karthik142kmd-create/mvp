import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Building2, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">User Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Registered organization details under Legal Metrology Dept.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center text-2xl shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full text-[11px] mt-1 border border-blue-200">
              {user?.role} ROLE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" /> Organization / Firm
            </span>
            <p className="font-bold text-slate-900">{user?.organization || 'N/A'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Address
            </span>
            <p className="font-bold text-slate-900">{user?.email}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" /> Mobile Number
            </span>
            <p className="font-bold text-slate-900">{user?.phone || '+91 98765 00000'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> District & State
            </span>
            <p className="font-bold text-slate-900">{user?.district || 'Hyderabad'}, {user?.state || 'Telangana'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
