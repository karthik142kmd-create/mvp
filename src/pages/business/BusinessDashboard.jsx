import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Scale, CheckCircle2, Clock, AlertTriangle, AlertCircle, PlusCircle, FileText, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BusinessDashboard = () => {
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
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { summary, appStatusBreakdown, recentApplications } = data || {};

  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#dc2626', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
        <div>
          <h2 className="text-xl font-bold">Business Instrument Portal</h2>
          <p className="text-xs text-blue-200 mt-1">
            Manage commercial weighing scales, fuel dispensers & statutory stamping compliance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/business/instruments/new')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Instrument</span>
          </button>
          <button
            onClick={() => navigate('/business/applications/new')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Apply Verification</span>
          </button>
        </div>
      </div>

      {/* Expiry Warning Banner if expiring soon */}
      {summary?.expiringSoon > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>⚠ {summary.expiringSoon} of your instruments expire within 30 days. Submit re-verification to prevent penalties under Law.</span>
          </div>
          <button
            onClick={() => navigate('/business/applications/new')}
            className="px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shrink-0"
          >
            Renew Stamping
          </button>
        </div>
      )}

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Instruments" value={summary?.totalInstruments} icon={Scale} color="blue" onClick={() => navigate('/business/instruments')} />
        <StatCard title="Verified & Stamped" value={summary?.verifiedInstruments} icon={CheckCircle2} color="emerald" onClick={() => navigate('/business/instruments')} />
        <StatCard title="Pending Applications" value={summary?.pendingApplications} icon={Clock} color="indigo" onClick={() => navigate('/business/applications')} />
        <StatCard title="Expiring Soon" value={summary?.expiringSoon} icon={AlertTriangle} color="amber" onClick={() => navigate('/business/instruments')} />
        <StatCard title="Expired Instruments" value={summary?.expiredInstruments} icon={AlertCircle} color="red" onClick={() => navigate('/business/instruments')} />
      </div>

      {/* Charts & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Applications by Status</h3>
          {appStatusBreakdown && appStatusBreakdown.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {appStatusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} Apps`, name]} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400">No application breakdown data.</div>
          )}
        </div>

        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-sm">Recent Applications</h3>
            <button
              onClick={() => navigate('/business/applications')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Instrument</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Submitted</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentApplications && recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-blue-600">{app.applicationId}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">{app.instrument?.name}</td>
                      <td className="py-3 px-3 text-slate-600">{app.verificationType}</td>
                      <td className="py-3 px-3 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">
                      No verification applications submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
