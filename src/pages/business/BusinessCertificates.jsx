import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Award, Download, QrCode, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    api.get('/certificates')
      .then((data) => setCertificates(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = certificates.filter(
    (c) =>
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.instrument?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.instrument?.serialNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Stamping Certificates</h1>
          <p className="text-xs text-slate-500 mt-1">Official digitally authenticated Legal Metrology verification certificates.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Certificate No, Instrument, Serial..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading certificates vault...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No certificates found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Certificate Number</th>
                  <th className="py-3 px-4">Instrument Specifications</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cert.certificateNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{cert.instrument?.name}</div>
                      <div className="text-[10px] text-slate-500">SN: {cert.instrument?.serialNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.issueDate}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{cert.validUntil}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedQr(cert)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>QR Code</span>
                      </button>

                      <a
                        href={`/api/certificates/${cert.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </a>

                      <Link
                        to={`/verify/${encodeURIComponent(cert.certificateNumber)}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public Page</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-800">{selectedQr.certificateNumber}</span>
              <button onClick={() => setSelectedQr(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            {selectedQr.qrCodeData && (
              <img src={selectedQr.qrCodeData} alt="QR Code" className="w-56 h-56 mx-auto rounded-xl p-2 border shadow-sm" />
            )}

            <p className="text-xs text-slate-500">
              Scan this QR code to verify certificate authenticity on the public registry.
            </p>

            <button
              onClick={() => setSelectedQr(null)}
              className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCertificates;
