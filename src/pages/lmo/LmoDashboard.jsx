import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, Clock, CheckCircle2, XCircle, Play, Shield, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LmoDashboard = () => {
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
    return <div className="p-12 text-center text-xs text-slate-500">Loading Legal Metrology Inspector Dashboard...</div>;
  }

  const { summary, queue } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Legal Metrology Inspector Portal</h2>
          <p className="text-xs text-indigo-200 mt-1">Field inspection, tolerance testing & digital stamping queue.</p>
        </div>
        <button
          onClick={() => navigate('/lmo/queue')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
        >
          <Play className="w-4 h-4" />
          <span>Open Inspection Queue</span>
        </button>
      </div>

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Today's Inspections" value={summary?.todaysInspections} icon={Calendar} color="amber" onClick={() => navigate('/lmo/schedule')} />
        <StatCard title="Pending Queue" value={summary?.pendingQueue} icon={Clock} color="indigo" onClick={() => navigate('/lmo/queue')} />
        <StatCard title="Completed Tests" value={summary?.completedVerifications} icon={CheckCircle2} color="emerald" onClick={() => navigate('/lmo/history')} />
        <StatCard title="Passed & Stamped" value={summary?.passedCount} icon={CheckCircle2} color="emerald" onClick={() => navigate('/lmo/history')} />
        <StatCard title="Failed / Rejected" value={summary?.failedCount} icon={XCircle} color="red" onClick={() => navigate('/lmo/history')} />
      </div>

      {/* Field Inspection Queue Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Assigned Inspection Queue</h3>
          <button onClick={() => navigate('/lmo/queue')} className="text-xs font-semibold text-blue-600 hover:underline">
            Full Queue
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Application ID</th>
                <th className="py-2.5 px-3">Applicant Business</th>
                <th className="py-2.5 px-3">Instrument Specs</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {queue && queue.length > 0 ? (
                queue.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">{app.applicationId}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{app.applicant?.organization || app.applicant?.name}</td>
                    <td className="py-3 px-3 text-slate-700">{app.instrument?.type} ({app.instrument?.capacity})</td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[150px]">{app.location}</td>
                    <td className="py-3 px-3"><StatusBadge status={app.status} /></td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/lmo/verification/${app.id}`)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Inspection</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 text-xs">No pending inspections in queue.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LmoDashboard;
