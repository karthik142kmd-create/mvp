import React from 'react';
import { CheckCircle2, Clock, Calendar, FileText, Award, AlertTriangle } from 'lucide-react';

const Timeline = ({ currentStatus, scheduleDate }) => {
  const steps = [
    { key: 'SUBMITTED', title: 'Application Submitted', icon: FileText },
    { key: 'UNDER_REVIEW', title: 'Under Review', icon: Clock },
    { key: 'SCHEDULED', title: 'Inspection Scheduled', icon: Calendar, date: scheduleDate },
    { key: 'VERIFICATION_IN_PROGRESS', title: 'Field Inspection', icon: Clock },
    { key: 'VERIFIED', title: 'Certificate Issued', icon: Award },
  ];

  const getStepState = (stepKey, index) => {
    if (currentStatus === 'FAILED' || currentStatus === 'REJECTED') {
      if (stepKey === 'VERIFIED') return 'failed';
    }

    const order = ['SUBMITTED', 'UNDER_REVIEW', 'SCHEDULED', 'VERIFICATION_IN_PROGRESS', 'VERIFIED'];
    const currentIndex = order.indexOf(currentStatus);

    if (currentIndex === -1) {
      if (currentStatus === 'VERIFIED') return 'completed';
      return index === 0 ? 'completed' : 'upcoming';
    }

    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0"></div>
        {steps.map((step, idx) => {
          const state = getStepState(step.key, idx);
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  state === 'completed'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : state === 'active'
                    ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100'
                    : state === 'failed'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}
              >
                {state === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs font-semibold mt-2 text-center max-w-[90px] ${
                  state === 'active'
                    ? 'text-blue-600'
                    : state === 'completed'
                    ? 'text-emerald-700'
                    : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
              {step.date && state === 'active' && (
                <span className="text-[10px] text-amber-600 font-medium">{step.date}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
