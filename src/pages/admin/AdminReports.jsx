import React from 'react';
import { BarChart3, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

const AdminReports = () => {
  const reports = [
    { title: 'Annual Verification & Stamping Audit Report 2026', type: 'PDF / CSV', size: '2.4 MB', date: '2026-08-30' },
    { title: 'State-wise Commercial Scale Tolerance Inspection Summary', type: 'PDF', size: '1.8 MB', date: '2026-08-25' },
    { title: 'Legal Metrology Expiry Risk & Renewal Non-compliance Log', type: 'CSV', size: '890 KB', date: '2026-09-01' },
    { title: 'Government Approved Test Centre (GATC) Calibration Performance', type: 'PDF', size: '3.1 MB', date: '2026-08-15' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Statutory Reports & Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">Export state-level Legal Metrology compliance reports and calibration summaries.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available State Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rep.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{rep.type} • {rep.size} • Generated: {rep.date}</p>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading statutory report: ${rep.title}`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
