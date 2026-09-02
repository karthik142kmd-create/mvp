import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Calendar, UserCheck, Search, Clock, Send, Eye } from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State for Scheduling
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    officerId: '',
    scheduledDate: '2026-09-10',
    scheduledTime: '11:00 AM',
    remarks: 'Assigned for official Legal Metrology field inspection and tolerance test.',
  });
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsData, officersData] = await Promise.all([
        api.get('/applications'),
        api.get('/users/officers'),
      ]);
      setApplications(appsData);
      setOfficers(officersData);
      if (officersData.length > 0) {
        setScheduleForm((prev) => ({ ...prev, officerId: officersData[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenScheduleModal = (app) => {
    setScheduleModalApp(app);
    setScheduleForm({
      officerId: officers[0]?.id || '',
      scheduledDate: app.preferredDate || '2026-09-10',
      scheduledTime: app.preferredTime || '11:00 AM',
      remarks: 'Assigned for official Legal Metrology inspection.',
    });
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.officerId || !scheduleForm.scheduledDate) {
      setModalError('Please select an officer and scheduled inspection date.');
      return;
    }

    setSubmitting(true);
    setModalError('');

    try {
      await api.post(`/applications/${scheduleModalApp.id}/schedule`, scheduleForm);
      setScheduleModalApp(null);
      fetchData(); // Refresh table data
    } catch (err) {
      setModalError(err.message || 'Failed to schedule verification.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = applications.filter(
    (a) =>
      a.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant?.organization?.toLowerCase().includes(search.toLowerCase()) ||
      a.instrument?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Verification Applications Master</h1>
          <p className="text-xs text-slate-500 mt-1">Review submitted applications, assign Legal Metrology Officers or GATCs, and schedule field visits.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Application ID, Owner, Instrument..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading application registry...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Applicant Business</th>
                  <th className="py-3 px-4">Instrument Category</th>
                  <th className="py-3 px-4">Assigned Inspector</th>
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
                      <div className="text-[10px] text-slate-500">{app.applicant?.state}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{app.instrument?.name}</div>
                      <div className="text-[10px] text-slate-500">SN: {app.instrument?.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {app.assignedTo ? (
                        <span className="font-bold text-slate-900">{app.assignedTo.name} ({app.assignedTo.role})</span>
                      ) : (
                        <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[10px]">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenScheduleModal(app)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{app.status === 'SCHEDULED' ? 'Reschedule' : 'Assign & Schedule'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SCHEDULING MODAL */}
      {scheduleModalApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Assign & Schedule Verification</h3>
                <p className="text-xs text-slate-500 font-mono">{scheduleModalApp.applicationId} • {scheduleModalApp.instrument?.name}</p>
              </div>
              <button onClick={() => setScheduleModalApp(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Inspecting Officer / GATC *</label>
                <select
                  value={scheduleForm.officerId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, officerId: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.name} [{off.role}] - {off.organization || off.district}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inspection Date *</label>
                  <input
                    type="date"
                    required
                    value={scheduleForm.scheduledDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={scheduleForm.scheduledTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                    placeholder="e.g. 11:00 AM"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Remarks / Instructions</label>
                <textarea
                  rows="2"
                  value={scheduleForm.remarks}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, remarks: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalApp(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Scheduling...' : 'Confirm Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
