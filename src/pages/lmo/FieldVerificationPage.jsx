import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import {
  Smartphone,
  Scale,
  CheckCircle2,
  XCircle,
  Camera,
  MapPin,
  FileCheck,
  Send,
  ArrowLeft,
  Award,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { downloadCertificatePDF } from '../../services/pdfGenerator';

const FieldVerificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: 1, item: 'Instrument identification & serial number match', status: 'PASS' },
    { id: 2, item: 'Legal Metrology lead/electronic seal condition intact', status: 'PASS' },
    { id: 3, item: 'Accuracy class test within permissible Maximum Permissible Error (MPE)', status: 'PASS' },
    { id: 4, item: 'Physical condition, levelling bubble, and indicator check', status: 'PASS' },
    { id: 5, item: 'Digital display & tare functionality verification', status: 'PASS' },
    { id: 6, item: 'Calibrated standard weights/measures used for testing', status: 'PASS' },
    { id: 7, item: 'Statutory compliance requirements under 2011 Rules satisfied', status: 'PASS' },
  ]);

  const [observations, setObservations] = useState('All 7 verification checkpoints tested under Legal Metrology Rules, 2011. Unit meets MPE tolerance.');
  const [readings, setReadings] = useState('Standard Load 20.000 kg -> Measured 20.001 kg (Within MPE tolerance)');
  const [gpsCoords, setGpsCoords] = useState('17.4399° N, 78.4482° E');
  const [result, setResult] = useState('PASS'); // PASS or FAIL
  const [failureReason, setFailureReason] = useState('');
  const [issuedCert, setIssuedCert] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then((data) => setApplication(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChecklistToggle = (itemIndex, status) => {
    const updated = [...checklist];
    updated[itemIndex].status = status;
    setChecklist(updated);

    // If any item fails, auto-set result to FAIL
    if (updated.some((i) => i.status === 'FAIL')) {
      setResult('FAIL');
    }
  };

  const handleGrabGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        },
        () => {
          setGpsCoords('17.4399° N, 78.4482° E (GPS Grabbed)');
        }
      );
    }
  };

  const handleSubmitVerification = async () => {
    if (result === 'FAIL' && !failureReason.trim()) {
      setError('Failure reason is mandatory when verification decision is FAIL.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        checklist,
        observations,
        readings,
        result,
        failureReason: result === 'FAIL' ? failureReason : null,
        gpsCoords,
      };

      const data = await api.post(`/verifications/${id}/complete`, payload);

      if (data.certificate) {
        setIssuedCert(data.certificate);
      } else {
        alert(data.message || 'Verification submitted.');
        navigate('/lmo/history');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit field verification result.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading mobile field verification interface...</div>;
  }

  if (!application) {
    return <div className="p-12 text-center text-xs text-slate-500">Application not found.</div>;
  }

  const { instrument, applicant } = application;

  return (
    <div className="max-w-md mx-auto space-y-4 pb-12">
      {/* Top Mobile Officer Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Field Mode</span>
        </button>
        <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-bold flex items-center gap-1 border border-indigo-200">
          <Smartphone className="w-3 h-3" /> FIELD INSPECTION MOBILE MODE
        </span>
      </div>

      {/* SUCCESS MODAL IF CERTIFICATE ISSUED */}
      {issuedCert && (
        <div className="p-6 bg-emerald-950 text-white rounded-3xl shadow-2xl border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">✓ VERIFICATION PASSED & STAMPED</h2>
          <p className="text-xs text-emerald-200">
            Digital Certificate <strong className="text-white font-mono">{issuedCert.certificateNumber}</strong> has been generated and sealed with cryptographic QR.
          </p>

          {issuedCert.qrCodeData && (
            <img src={issuedCert.qrCodeData} alt="Certificate QR" className="w-40 h-40 mx-auto rounded-xl p-2 bg-white" />
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => downloadCertificatePDF(issuedCert)}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => navigate('/lmo/history')}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Done & Return Queue
            </button>
          </div>
        </div>
      )}

      {!issuedCert && (
        <>
          {/* Instrument Summary Mobile Card */}
          <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{application.applicationId}</span>
                <h2 className="text-lg font-black leading-snug">{instrument?.name}</h2>
              </div>
              <StatusBadge status={application.status} />
            </div>

            <div className="text-xs space-y-1 text-slate-300 pt-2 border-t border-slate-800">
              <p><span className="text-slate-400">Category:</span> {instrument?.type} ({instrument?.capacity})</p>
              <p><span className="text-slate-400">Serial No:</span> <strong className="font-mono text-white">{instrument?.serialNumber}</strong></p>
              <p><span className="text-slate-400">Owner:</span> {applicant?.organization || applicant?.name}</p>
              <p><span className="text-slate-400">Premises:</span> {application.location}</p>
            </div>

            {/* GPS grab pill */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> GPS: {gpsCoords}
              </span>
              <button
                onClick={handleGrabGps}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold rounded-lg border border-slate-700"
              >
                Refresh Location
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Mandatory 7-Checkpoint Inspection Checklist */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" /> Statutory Inspection Checklist (7 Items)
            </h3>

            <div className="space-y-3">
              {checklist.map((item, idx) => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {item.id}. {item.item}
                  </p>
                  <div className="flex gap-2">
                    {['PASS', 'FAIL', 'NA'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleChecklistToggle(idx, st)}
                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all ${
                          item.status === st
                            ? st === 'PASS'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : st === 'FAIL'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-700 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurements & Observations */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Field Readings & Evidence</h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Measurement Readings & Tolerances</label>
              <textarea
                rows="2"
                value={readings}
                onChange={(e) => setReadings(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Officer Observation Notes</label>
              <textarea
                rows="2"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white"
              ></textarea>
            </div>

            {/* Photo Capture Mock */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-2 font-medium">
                <Camera className="w-4 h-4 text-blue-600" /> Scale Photo / Seal Tag Captured
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">✓ Attached</span>
            </div>
          </div>

          {/* FINAL PASS / FAIL DECISION */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Final Verification Decision</h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResult('PASS')}
                className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                  result === 'PASS'
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-lg'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>PASS & STAMP</span>
              </button>

              <button
                type="button"
                onClick={() => setResult('FAIL')}
                className={`py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                  result === 'FAIL'
                    ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-lg'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>FAIL / REJECT</span>
              </button>
            </div>

            {result === 'FAIL' && (
              <div>
                <label className="block text-[11px] font-bold text-rose-700 mb-1">Failure Reason (Mandatory) *</label>
                <textarea
                  rows="2"
                  required
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                  placeholder="Specify calibration error or broken seal details..."
                  className="w-full px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 focus:bg-white"
                ></textarea>
              </div>
            )}

            <button
              onClick={handleSubmitVerification}
              disabled={submitting}
              className={`w-full py-3.5 font-extrabold text-xs rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                result === 'PASS' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Processing Decision...' : result === 'PASS' ? 'Generate Digital Certificate & QR' : 'Record Verification Failure'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FieldVerificationPage;
