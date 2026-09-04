import React from 'react';
import { BarChart3, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const AdminReports = () => {
  const reports = [
    { title: 'Annual Verification & Stamping Audit Report 2026', type: 'PDF', size: '2.4 MB', date: '2026-08-30' },
    { title: 'State-wise Commercial Scale Tolerance Inspection Summary', type: 'PDF', size: '1.8 MB', date: '2026-08-25' },
    { title: 'Legal Metrology Expiry Risk & Renewal Non-compliance Log', type: 'PDF', size: '890 KB', date: '2026-09-01' },
    { title: 'Government Approved Test Centre (GATC) Calibration Performance', type: 'PDF', size: '3.1 MB', date: '2026-08-15' },
  ];

  const handleExport = (rep) => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('GOVERNMENT OF INDIA - LEGAL METROLOGY DIVISION', 105, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('STATE STATUTORY COMPLIANCE & MONITORING REPORT', 105, 22, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(rep.title, 15, 45);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Format: ${rep.type} | Size: ${rep.size} | Generated: ${rep.date}`, 15, 52);

    doc.setDrawColor(203, 213, 225);
    doc.line(15, 58, 195, 58);

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Executive Summary & Verification Statistics', 15, 70);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(
      'Total Commercial Weighing Instruments Tracked: 12,480\n' +
      'Overall Statutory Verification Compliance Rate: 94.2%\n' +
      'Field Inspections Completed in Current Cycle: 3,142\n' +
      'Certificates Issued with Cryptographic QR Authentication: 2,980\n' +
      'Units Out of Tolerance / Sealing Rejected: 162',
      15,
      78
    );

    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Regional LMO Officer Inspection Performance', 15, 115);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(
      '• Zone 1 (Hyderabad Central): 98.1% of statutory quotas achieved on schedule\n' +
      '• Zone 2 (Warangal Industrial): 93.4% compliance verified across commercial scales\n' +
      '• Zone 3 (Karimnagar Agro Hub): 91.8% periodic stamping completed',
      15,
      123
    );

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Authenticated by Central Legal Metrology Database Engine under Rules 2011.', 15, 275);

    doc.save(`${rep.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

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
                onClick={() => handleExport(rep)}
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
