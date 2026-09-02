import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'WARNING' || type === 'ALERT') return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    if (type === 'SUCCESS') return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    return <Info className="w-5 h-5 text-blue-600" />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Notifications & Alerts</h1>
        <p className="text-xs text-slate-500 mt-1">Instrument expiration warnings, inspection updates, and certificate notifications.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No notifications available.</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`p-4 flex items-start justify-between gap-4 ${n.read ? 'bg-white' : 'bg-slate-50/80'}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getTypeIcon(n.type)}</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-[11px] transition-colors shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
