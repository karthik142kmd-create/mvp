import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Calendar, MapPin, Clock, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LmoSchedule = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/applications')
      .then((data) => {
        const scheduled = data.filter((a) => a.status === 'SCHEDULED' || a.schedules?.length > 0);
        setApplications(scheduled);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Field Inspection Schedule</h1>
        <p className="text-xs text-slate-500 mt-1">Calendar & list of scheduled officer visits to commercial premises.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading schedule calendar...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No upcoming scheduled inspections.</div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {applications.map((app) => {
              const sch = app.schedules?.[0];
              return (
                <div key={app.id} className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-center min-w-[70px]">
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <span className="text-[10px] font-bold block">{sch?.scheduledDate || app.preferredDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{app.applicationId}</span>
                      <h4 className="text-sm font-bold text-slate-900">{app.instrument?.name}</h4>
                      <p className="text-xs text-slate-500">{app.applicant?.organization || app.applicant?.name}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> {app.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/lmo/verification/${app.id}`)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 self-end md:self-center shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    <span>Launch Field Mode</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LmoSchedule;
