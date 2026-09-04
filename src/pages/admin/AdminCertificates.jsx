import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Award, Download, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadCertificatePDF } from '../../services/pdfGenerator';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/certificates')
      .then((data) => setCertificates(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = certificates.filter(
    (c) =>
      c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.owner?.organization?.toLowerCase().includes(search.toLowerCase()) ||
      c.instrument?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">National Certificates Vault</h1>
        <p className="text-xs text-slate-500 mt-1">Central repository of all issued Legal Metrology verification certificates & QR keys.</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Certificate ID, Owner Firm, Instrument..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading certificate vault...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Certificate Number</th>
                  <th className="py-3 px-4">Owner Firm</th>
                  <th className="py-3 px-4">Instrument Category</th>
                  <th className="py-3 px-4">Issuing Officer</th>
                  <th className="py-3 px-4">Valid Until</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{cert.certificateNumber}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{cert.owner?.organization || cert.owner?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.instrument?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{cert.officer?.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">{cert.validUntil}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => downloadCertificatePDF(cert)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                      <Link
                        to={`/verify/${encodeURIComponent(cert.certificateNumber)}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Public View</span>
                      </Link>
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

export default AdminCertificates;
