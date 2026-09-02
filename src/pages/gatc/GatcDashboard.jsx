import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Building2, CheckCircle2, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GatcDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/stats')
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading GATC Testing Portal...</div>;
  }

  const { summary, queue } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Government Approved Test Centre (GATC) Portal</h2>
          <p className="text-xs text-purple-200 mt-1">Laboratory calibration, third-party testing & Section 19 compliance.</p>
        </div>
        <button
          onClick={() => navigate('/gatc/assignments')}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
        >
          <Building2 className="w-4 h-4" />
          <span>Assigned Testing Tasks</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Applications" value={summary?.pendingQueue} icon={Clock} color="purple" onClick={() => navigate('/gatc/assignments')} />
        <StatCard title="Completed Tests" value={summary?.completedVerifications} icon={CheckCircle2} color="emerald" />
        <StatCard title="Passed Tests" value={summary?.passedCount} icon={CheckCircle2} color="emerald" />
        <StatCard title="Failed Tests" value={summary?.failedCount} icon={Clock} color="red" />
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Testing Laboratory Assignments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Application ID</th>
                <th className="py-2.5 px-3">Applicant Business</th>
                <th className="py-2.5 px-3">Instrument Category</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {queue && queue.length > 0 ? (
                queue.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-purple-600">{app.applicationId}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{app.applicant?.organization || app.applicant?.name}</td>
                    <td className="py-3 px-3 text-slate-700">{app.instrument?.name}</td>
                    <td className="py-3 px-3"><StatusBadge status={app.status} /></td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/lmo/verification/${app.id}`)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Perform Testing</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">No pending testing assignments.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GatcDashboard;
