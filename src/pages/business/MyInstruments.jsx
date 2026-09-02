import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Scale, Calendar, MapPin, Eye, FileText } from 'lucide-react';

const MyInstruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstruments();
  }, [statusFilter]);

  const fetchInstruments = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const data = await api.get(`/instruments${query}`);
      setInstruments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = instruments.filter(
    (ins) =>
      ins.name.toLowerCase().includes(search.toLowerCase()) ||
      ins.instrumentId.toLowerCase().includes(search.toLowerCase()) ||
      ins.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      ins.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Registered Instruments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Registered weighing scales, weighbridges, fuel dispensers, and measuring devices.
          </p>
        </div>
        <button
          onClick={() => navigate('/business/instruments/new')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Instrument</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Instrument ID, Serial No, Name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 items-center w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRING_SOON">Expiring Soon</option>
            <option value="EXPIRED">Expired</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading instruments...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No registered instruments found matching your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Instrument ID</th>
                  <th className="py-3 px-4">Name & Type</th>
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((ins) => (
                  <tr key={ins.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{ins.instrumentId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{ins.name}</div>
                      <div className="text-[10px] text-slate-500">{ins.type} • {ins.manufacturer}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">{ins.serialNumber}</td>
                    <td className="py-3.5 px-4 text-slate-700">{ins.capacity}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ins.expiryDate ? ins.expiryDate : <span className="text-slate-400 italic">Not stamped</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ins.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/business/instruments/${ins.id}`)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => navigate(`/business/applications/new?instrumentId=${ins.id}`)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Apply</span>
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

export default MyInstruments;
