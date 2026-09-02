import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Play, Building2 } from 'lucide-react';

const GatcAssignments = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/applications')
      .then((data) => setApplications(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">GATC Testing Assignments</h1>
        <p className="text-xs text-slate-500 mt-1">Instrument calibration tasks assigned to Government Approved Test Centres.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading assignments...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No active testing assignments.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant Organization</th>
                  <th className="py-3 px-4">Instrument Specifications</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-purple-600">{app.applicationId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{app.applicant?.organization || app.applicant?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{app.instrument?.name} ({app.instrument?.capacity})</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigate(`/lmo/verification/${app.id}`)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Perform Testing</span>
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

export default GatcAssignments;
