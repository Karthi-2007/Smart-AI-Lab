import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const BookingTimeline = ({ status = 'Pending' }) => {
  const steps = [
    { title: 'Booking Submitted', done: true },
    { title: 'Faculty Approval', done: status === 'Approved', current: status === 'Pending' },
    { title: 'Lab Access Granted', done: status === 'Approved' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
      <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Approval Status</h4>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center space-x-3 text-xs">
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : step.current ? (
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-slate-700" />
            )}
            <span className={step.done ? 'text-white font-medium' : 'text-slate-400'}>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline;
