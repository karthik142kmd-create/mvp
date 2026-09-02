import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Scale, PlusCircle, ArrowLeft, Upload, Check } from 'lucide-react';

const AddInstrument = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: 'Weighing Scale',
    manufacturer: '',
    model: '',
    serialNumber: '',
    capacity: '30 kg',
    accuracyClass: 'Class III',
    maxCapacity: '30 kg',
    minCapacity: '100 grams',
    location: '',
    state: 'Telangana',
    district: 'Hyderabad',
    purchaseDate: '2024-01-15',
  });

  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await api.post('/instruments', formData);
      navigate(`/business/instruments/${res.id}`);
    } catch (err) {
      setError(err.message || 'Failed to add instrument.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Instruments</span>
      </button>

      <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Register New Instrument</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter specifications under Legal Metrology (General) Rules, 2011.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instrument Designation / Name *</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Counter Electronic Scale - Bay 1"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instrument Category *</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Weighing Scale">Weighing Scale</option>
              <option value="Electronic Balance">Electronic Balance</option>
              <option value="Weighbridge">Weighbridge</option>
              <option value="Petrol Pump">Petrol Pump</option>
              <option value="Fuel Dispenser">Fuel Dispenser</option>
              <option value="Measuring Container">Measuring Container</option>
              <option value="Length Measuring Instrument">Length Measuring Instrument</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Manufacturer *</label>
            <input
              type="text"
              name="manufacturer"
              required
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Essae Scales Pvt Ltd"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Model Name / Number *</label>
            <input
              type="text"
              name="model"
              required
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. DS-215"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unique Serial Number *</label>
            <input
              type="text"
              name="serialNumber"
              required
              value={form.serialNumber}
              onChange={handleChange}
              placeholder="e.g. SN-2026-99120"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Capacity *</label>
            <input
              type="text"
              name="capacity"
              required
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 30 kg / 50 Ton / 50 L/min"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Accuracy Class *</label>
            <select
              name="accuracyClass"
              value={form.accuracyClass}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="Class I">Class I (Special Precision)</option>
              <option value="Class II">Class II (High Precision)</option>
              <option value="Class III">Class III (Medium / Commercial)</option>
              <option value="Class IIII">Class IIII (Ordinary)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Premises Location / Address *</label>
            <input
              type="text"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="Full shop address or industrial bay location"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
            <input
              type="text"
              name="state"
              required
              value={form.state}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">District *</label>
            <input
              type="text"
              name="district"
              required
              value={form.district}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Instrument Photograph</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700"
            />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{loading ? 'Saving Instrument...' : 'Complete Instrument Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstrument;
