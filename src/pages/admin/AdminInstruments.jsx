import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import { Scale, Search } from 'lucide-react';

const AdminInstruments = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/instruments')
      .then((data) => setInstruments(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = instruments.filter(
    (ins) =>
      ins.name.toLowerCase().includes(search.toLowerCase()) ||
      ins.instrumentId.toLowerCase().includes(search.toLowerCase()) ||
      ins.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      ins.owner?.organization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Instruments Master Registry</h1>
        <p className="text-xs text-slate-500 mt-1">Centralized state database of registered weighing scales, weighbridges & dispensers.</p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Instrument ID, Serial No, Owner Firm..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading master registry...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Instrument ID</th>
                  <th className="py-3 px-4">Owner / Firm</th>
                  <th className="py-3 px-4">Type & Capacity</th>
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">State / District</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filtered.map((ins) => (
                  <tr key={ins.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{ins.instrumentId}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{ins.owner?.organization || ins.owner?.name}</td>
                    <td className="py-3.5 px-4 text-slate-700">{ins.type} ({ins.capacity})</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{ins.serialNumber}</td>
                    <td className="py-3.5 px-4 text-slate-600">{ins.district}, {ins.state}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={ins.status} />
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

export default AdminInstruments;
