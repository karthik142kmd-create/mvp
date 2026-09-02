import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Calendar, UserCheck, MapPin } from 'lucide-react';

const AdminSchedules = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications')
      .then((data) => {
        const scheduled = data.filter((a) => a.schedules && a.schedules.length > 0);
        setApplications(scheduled);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">State Inspection Schedules Master</h1>
        <p className="text-xs text-slate-500 mt-1">Calendar overview of scheduled inspections assigned across LMO officers.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading scheduled visits...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No scheduled visits.</div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {applications.map((app) => {
              const sch = app.schedules[0];
              return (
                <div key={app.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-center min-w-[75px]">
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[10px] font-bold block">{sch?.scheduledDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{app.applicationId}</span>
                      <h4 className="text-xs font-bold text-slate-900">{app.instrument?.name}</h4>
                      <p className="text-[11px] text-slate-500">Owner: {app.applicant?.organization || app.applicant?.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-500" /> {app.location}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 text-[10px] block">Assigned Officer</span>
                    <span className="font-bold text-slate-900">{app.assignedTo?.name || 'LMO Inspector'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSchedules;
