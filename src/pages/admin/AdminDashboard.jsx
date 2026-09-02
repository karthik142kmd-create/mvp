import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { Scale, FileText, Clock, CheckCircle2, Award, AlertTriangle, Users, Building2, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AdminDashboard = () => {
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
    return <div className="p-12 text-center text-xs text-slate-500">Loading Centralized Legal Metrology Admin Command Center...</div>;
  }

  const { summary, charts, recentVerifications } = data || {};

  const PIE_COLORS = ['#3b82f6', '#059669', '#f59e0b', '#dc2626', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <h2 className="text-xl font-black tracking-tight">Central Legal Metrology Command Center</h2>
          <p className="text-xs text-slate-400 mt-1">State-wide statutory compliance monitoring, officer assignment & certificate audit.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/applications')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Manage Applications</span>
          </button>
          <button
            onClick={() => navigate('/admin/audit-logs')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all"
          >
            Audit Trail
          </button>
        </div>
      </div>

      {/* 8 Admin Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Registered Instruments" value={summary?.totalInstruments} icon={Scale} color="blue" onClick={() => navigate('/admin/instruments')} />
        <StatCard title="Total Applications" value={summary?.totalApplications} icon={FileText} color="indigo" onClick={() => navigate('/admin/applications')} />
        <StatCard title="Pending Verification" value={summary?.pendingVerification} icon={Clock} color="amber" onClick={() => navigate('/admin/applications')} />
        <StatCard title="Completed Verifications" value={summary?.completedVerification} icon={CheckCircle2} color="emerald" />
        <StatCard title="Certificates Issued" value={summary?.certificatesIssued} icon={Award} color="emerald" onClick={() => navigate('/admin/certificates')} />
        <StatCard title="Expired Instruments" value={summary?.expiredInstruments} icon={AlertTriangle} color="red" onClick={() => navigate('/admin/instruments')} />
        <StatCard title="Active LMO Officers" value={summary?.activeLmos} icon={Users} color="purple" onClick={() => navigate('/admin/users')} />
        <StatCard title="Active GATC Labs" value={summary?.activeGatcs} icon={Building2} color="indigo" onClick={() => navigate('/admin/users')} />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Applications Status Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm mb-2">Applications Status Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.statusBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {(charts?.statusBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 text-sm mb-2">State-wise Registered Instruments</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.stateDistribution || []}>
                <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="instruments" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Verifications Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">Recent Stamping Verifications</h3>
          <button onClick={() => navigate('/admin/certificates')} className="text-xs font-semibold text-blue-600 hover:underline">
            View All Vault
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Instrument</th>
                <th className="py-2.5 px-3">Assigned Inspector</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {recentVerifications && recentVerifications.length > 0 ? (
                recentVerifications.map((ver) => (
                  <tr key={ver.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-600 font-mono">{ver.verificationDate}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">{ver.instrument?.name}</td>
                    <td className="py-3 px-3 text-slate-700">{ver.officer?.name}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ver.result} />
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-600">
                      {ver.certificates?.[0]?.certificateNumber || 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400 text-xs">No recent verifications recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
