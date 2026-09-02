import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { FileText, ArrowLeft, Send } from 'lucide-react';

const ApplyVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedInstrumentId = searchParams.get('instrumentId');

  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    instrumentId: preselectedInstrumentId || '',
    verificationType: 'PERIODIC',
    preferredDate: '2026-09-10',
    preferredTime: '10:30 AM',
    location: '',
    notes: 'Requesting periodic verification and stamping under Legal Metrology Rules, 2011.',
  });

  useEffect(() => {
    api.get('/instruments')
      .then((data) => {
        setInstruments(data);
        if (!form.instrumentId && data.length > 0) {
          setForm((prev) => ({ ...prev, instrumentId: data[0].id, location: data[0].location }));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInstrumentChange = (e) => {
    const selectedId = e.target.value;
    const found = instruments.find((i) => i.id === selectedId);
    setForm({
      ...form,
      instrumentId: selectedId,
      location: found ? found.location : form.location,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.instrumentId) {
      setError('Please select an instrument.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/applications', form);
      navigate('/business/applications');
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Submit Verification Application</h1>
          <p className="text-xs text-slate-500 mt-1">
            Apply for periodic inspection, re-verification, or initial stamping.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Instrument *</label>
            <select
              value={form.instrumentId}
              onChange={handleInstrumentChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="">-- Choose Registered Instrument --</option>
              {instruments.map((ins) => (
                <option key={ins.id} value={ins.id}>
                  {ins.name} ({ins.instrumentId} - SN: {ins.serialNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Category *</label>
              <select
                name="verificationType"
                value={form.verificationType}
                onChange={(e) => setForm({ ...form, verificationType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="INITIAL">Initial Verification & Stamping</option>
                <option value="PERIODIC">Periodic Verification (Annual / Biannual)</option>
                <option value="RE_VERIFICATION">Re-Verification after Stamping Expiry</option>
                <option value="REPAIR">Re-Verification Post Repair / Alteration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Inspection Date *</label>
              <input
                type="date"
                required
                value={form.preferredDate}
                onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Premises Location for Inspection *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Commercial shop address / bay location"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Remarks / Notes</label>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any specific access requirements or notes for the inspecting LMO..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            ></textarea>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Application...' : 'Submit Application (LM-2026)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyVerification;
