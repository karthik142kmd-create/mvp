import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Award, Download, CheckCircle2, XCircle } from 'lucide-react';
import { downloadCertificatePDF } from '../../services/pdfGenerator';

const LmoHistory = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/certificates')
      .then((data) => setCertificates(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Completed Verification History</h1>
        <p className="text-xs text-slate-500 mt-1">Archived log of completed field inspections and issued certificates.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading inspection history...</div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No completed verifications recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Certificate Number</th>
                  <th className="py-3 px-4">Owner Organization</th>
                  <th className="py-3 px-4">Instrument Tested</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">PDF Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cert.certificateNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{cert.owner?.organization || cert.owner?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.instrument?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.issueDate}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{cert.validUntil}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => downloadCertificatePDF(cert)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
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

export default LmoHistory;
