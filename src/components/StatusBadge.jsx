import React from 'react';

const StatusBadge = ({ status }) => {
  const normalized = status ? status.toUpperCase() : 'PENDING';

  const config = {
    VERIFIED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'VERIFIED & STAMPED' },
    PASS: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'PASS' },
    SUBMITTED: { bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', label: 'SUBMITTED' },
    UNDER_REVIEW: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', label: 'UNDER REVIEW' },
    SCHEDULED: { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500', label: 'SCHEDULED' },
    VERIFICATION_IN_PROGRESS: { bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'IN INSPECTION' },
    EXPIRING_SOON: { bg: 'bg-yellow-50 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500', label: 'EXPIRING SOON' },
    EXPIRED: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'EXPIRED' },
    FAILED: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'FAILED' },
    FAIL: { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'FAIL' },
    REJECTED: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-500', label: 'REJECTED' },
    PENDING: { bg: 'bg-slate-100 text-slate-700 border-slate-300', dot: 'bg-slate-400', label: 'PENDING' },
  };

  const style = config[normalized] || config.PENDING;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
      {style.label}
    </span>
  );
};

export default StatusBadge;
