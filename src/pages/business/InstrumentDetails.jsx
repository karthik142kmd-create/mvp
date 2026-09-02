import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, Scale, Calendar, MapPin, Award, FileText, QrCode, Download } from 'lucide-react';

const InstrumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instrument, setInstrument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/instruments/${id}`)
      .then((data) => setInstrument(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading instrument details...</div>;
  }

  if (!instrument) {
    return <div className="p-12 text-center text-xs text-slate-500">Instrument not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Header card */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">{instrument.name}</h1>
            <StatusBadge status={instrument.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            ID: {instrument.instrumentId} • Serial: {instrument.serialNumber}
          </p>
        </div>

        <button
          onClick={() => navigate(`/business/applications/new?instrumentId=${instrument.id}`)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Apply Verification</span>
        </button>
      </div>

      {/* Specifications grid */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Specifications</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Instrument Type</span>
            <span className="font-bold text-slate-900">{instrument.type}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Manufacturer</span>
            <span className="font-bold text-slate-900">{instrument.manufacturer}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Model Number</span>
            <span className="font-bold text-slate-900">{instrument.model}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Capacity</span>
            <span className="font-bold text-slate-900">{instrument.capacity}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Accuracy Class</span>
            <span className="font-bold text-slate-900">{instrument.accuracyClass}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Location</span>
            <span className="font-bold text-slate-900">{instrument.location}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Last Verification</span>
            <span className="font-bold text-slate-900">{instrument.lastVerificationDate || 'None'}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Stamping Expiry</span>
            <span className="font-bold text-amber-600">{instrument.expiryDate || 'None'}</span>
          </div>
        </div>
      </div>

      {/* Verification Certificates History */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" /> Digital Certificates History
        </h3>

        {instrument.certificates && instrument.certificates.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {instrument.certificates.map((cert) => (
              <div key={cert.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-mono font-bold text-slate-900">{cert.certificateNumber}</p>
                  <p className="text-[11px] text-slate-500">Issued: {cert.issueDate} • Valid Until: {cert.validUntil}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={cert.status} />
                  <a
                    href={`/api/certificates/${cert.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No verification certificates issued yet for this instrument.</p>
        )}
      </div>
    </div>
  );
};

export default InstrumentDetails;
