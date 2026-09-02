import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Timeline from '../../components/Timeline';
import { FileText, Search, Calendar, UserCheck, Eye, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
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
      app.instrument?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Verification Applications</h1>
          <p className="text-xs text-slate-500 mt-1">Track status & officer schedule for submitted verification requests.</p>
        </div>
        <button
          onClick={() => navigate('/business/applications/new')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Application ID, Instrument..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading applications...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{app.applicationId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{app.instrument?.name}</div>
                      <div className="text-[10px] text-slate-500">SN: {app.instrument?.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{app.verificationType}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {app.assignedTo ? (
                        <span className="font-semibold text-slate-900">{app.assignedTo.name} ({app.assignedTo.role})</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Assignment</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Timeline Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Application Lifecycle</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedApp.applicationId} • {selectedApp.instrument?.name}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-2 py-1 bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <Timeline
              currentStatus={selectedApp.status}
              scheduleDate={selectedApp.schedules && selectedApp.schedules[0]?.scheduledDate}
            />

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2">
              <p><span className="text-slate-500 font-medium">Verification Type:</span> {selectedApp.verificationType}</p>
              <p><span className="text-slate-500 font-medium">Preferred Inspection Date:</span> {selectedApp.preferredDate}</p>
              <p><span className="text-slate-500 font-medium">Location:</span> {selectedApp.location}</p>
              {selectedApp.assignedTo && (
                <p><span className="text-slate-500 font-medium">Assigned Officer:</span> {selectedApp.assignedTo.name} ({selectedApp.assignedTo.organization})</p>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessApplications;
