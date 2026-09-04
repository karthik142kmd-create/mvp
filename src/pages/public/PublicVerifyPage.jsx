import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { downloadCertificatePDF, viewCertificatePDF, generateQRCodeDataUrl, getVerificationUrl } from '../../services/pdfGenerator';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  ShieldCheck,
  Scale,
  Building2,
  Calendar,
  UserCheck,
  QrCode,
} from 'lucide-react';

const PublicVerifyPage = () => {
  const { certNo } = useParams();
  const navigate = useNavigate();

  const getEffectiveCertNo = () => {
    if (certNo) return decodeURIComponent(certNo);
    if (typeof window !== 'undefined' && window.location) {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('verify') || sp.get('cert') || '';
    }
    return '';
  };

  const initialCertNo = getEffectiveCertNo();
  const [inputNo, setInputNo] = useState(initialCertNo);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const target = getEffectiveCertNo();
    if (target) {
      setInputNo(target);
      handleSearch(target);
    }
  }, [certNo]);

  const handleSearch = async (queryNumber) => {
    if (!queryNumber.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.get(`/certificates/verify/${encodeURIComponent(queryNumber.trim())}`);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://legalmetrology.gov.in';
      const certNo = data?.certificateNumber || queryNumber.trim();
      const verifyUrl = `${origin}/verify/${encodeURIComponent(certNo)}`;
      const liveQr = await generateQRCodeDataUrl(verifyUrl);
      if (data) {
        data.qrCodeData = liveQr || data.qrCodeData;
      }
      setResult(data);
    } catch (err) {
      setResult({
        verified: false,
        message: err.message || 'Certificate could not be verified in the national database.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (inputNo.trim()) {
      navigate(`/verify/${encodeURIComponent(inputNo.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">Verify Legal Metrology Certificate</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Public Verification Portal under the Legal Metrology Act, 2009. Instant authenticity check for weighing and measuring instrument certificates.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-md">
        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={inputNo}
              onChange={(e) => setInputNo(e.target.value)}
              placeholder="Enter Certificate Number (e.g. LM/TS/2026/001001)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : 'Verify Certificate'}</span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2 items-center text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600">Sample Certificate IDs:</span>
          {['LM/TS/2026/001001', 'LM/TS/2026/001002', 'LM/TS/2026/001007'].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setInputNo(sample);
                handleSearch(sample);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 font-mono rounded-lg transition-colors border border-slate-200"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Results Display Box */}
      {searched && (
        <div>
          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-semibold text-slate-600">Querying National Metrology Repository...</p>
            </div>
          ) : result && (result.verified || (result.certificateNumber && result.status !== 'REVOKED')) ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Header result banner */}
              <div
                className={`p-6 border-b flex items-center justify-between ${
                  result.isExpired
                    ? 'bg-amber-500/10 border-amber-200'
                    : 'bg-emerald-500/10 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.isExpired ? (
                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  )}
                  <div>
                    <h3
                      className={`text-lg font-black ${
                        result.isExpired ? 'text-amber-800' : 'text-emerald-800'
                      }`}
                    >
                      {result.isExpired ? 'CERTIFICATE HISTORICALLY VALID (EXPIRED)' : '✓ CERTIFICATE VERIFIED AUTHENTIC'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{result.message}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => viewCertificatePDF(result)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    title="View Full Certificate PDF in browser"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                  <button
                    onClick={() => downloadCertificatePDF(result)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <StatusBadge status={result.status} />
                </div>
              </div>

              {/* Certificate Details Body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Details Grid */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Certificate Number</span>
                    <p className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">{result.certificateNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date of Issue
                      </span>
                      <p className="font-bold text-slate-900 mt-1">{result.issueDate}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" /> Valid Until
                      </span>
                      <p className="font-bold text-slate-900 mt-1">{result.validUntil}</p>
                    </div>
                  </div>

                  {/* Instrument Spec Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" /> Instrument Parameters
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><span className="text-slate-500">Name/Type:</span> <strong className="text-slate-900">{result.instrument?.type}</strong></p>
                      <p><span className="text-slate-500">Model:</span> <strong className="text-slate-900">{result.instrument?.model}</strong></p>
                      <p><span className="text-slate-500">Serial No:</span> <strong className="text-slate-900 font-mono">{result.instrument?.serialNumber}</strong></p>
                      <p><span className="text-slate-500">Capacity:</span> <strong className="text-slate-900">{result.instrument?.capacity}</strong></p>
                      <p><span className="text-slate-500">Accuracy:</span> <strong className="text-slate-900">{result.instrument?.accuracyClass}</strong></p>
                      <p><span className="text-slate-500">Manufacturer:</span> <strong className="text-slate-900">{result.instrument?.manufacturer}</strong></p>
                    </div>
                  </div>

                  {/* Owner & Authority */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> Registered Owner
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">{result.owner?.organization || result.owner?.name}</p>
                      <p className="text-slate-500 text-[11px]">{result.instrument?.district}, {result.instrument?.state}</p>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Issuing Authority
                      </span>
                      <p className="font-bold text-slate-900 mt-0.5">{result.issuingAuthority}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Column */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                  {result.qrCodeData ? (
                    <img src={result.qrCodeData} alt="Verification QR Code" className="w-44 h-44 rounded-xl border p-2 bg-white shadow-md" />
                  ) : (
                    <div className="w-44 h-44 bg-slate-200 rounded-xl flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                  <div className="space-y-2 w-full">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block">Cryptographic QR Verification</span>
                      <span className="text-[10px] text-slate-400">Scanned directly from physical scale seal tag</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => viewCertificatePDF(result)}
                      className="w-full py-2 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Certificate PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
              <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h3 className="text-lg font-bold text-rose-900">Certificate Could Not Be Verified</h3>
              <p className="text-xs text-rose-700 max-w-md mx-auto">
                No active certificate matching "{inputNo}" was found in the official Legal Metrology registry. Please check the ID or contact support.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicVerifyPage;
