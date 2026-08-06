import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarWidget = () => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-white">Schedule Overview</h3>
        <span className="text-xs text-slate-400 flex items-center">
          <CalendarIcon className="w-3.5 h-3.5 mr-1" />
          {today}
        </span>
      </div>
      <div className="space-y-2">
        <div className="p-3 bg-slate-800/40 rounded-xl flex justify-between items-center text-xs">
          <div>
            <p className="text-white font-medium">Deep Learning Lab Slot 2</p>
            <p className="text-slate-400">10:00 AM - 01:00 PM</p>
          </div>
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
        </div>
        <div className="p-3 bg-slate-800/40 rounded-xl flex justify-between items-center text-xs">
          <div>
            <p className="text-white font-medium">VLSI Testing Bench</p>
            <p className="text-slate-400">02:30 PM - 04:30 PM</p>
          </div>
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Upcoming</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
