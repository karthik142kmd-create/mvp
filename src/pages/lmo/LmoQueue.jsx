import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Eye, MapPin, Scale } from 'lucide-react';

const LmoQueue = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/applications')
      .then((data) => setApplications(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(
    (app) =>
      app.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.organization?.toLowerCase().includes(search.toLowerCase()) ||
      app.instrument?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Verification Inspection Queue</h1>
          <p className="text-xs text-slate-500 mt-1">Pending and scheduled field inspection requests awaiting statutory testing.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Application ID, Owner Firm, Instrument..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading verification queue...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No applications in queue.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Business / Owner</th>
                  <th className="py-3 px-4">Instrument Category</th>
                  <th className="py-3 px-4">Inspection Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{app.applicationId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{app.applicant?.organization || app.applicant?.name}</div>
                      <div className="text-[10px] text-slate-500">{app.applicant?.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{app.instrument?.name}</div>
                      <div className="text-[10px] text-slate-500">SN: {app.instrument?.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">{app.location}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/lmo/verification/${app.id}`)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Field Mode</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LmoQueue;
