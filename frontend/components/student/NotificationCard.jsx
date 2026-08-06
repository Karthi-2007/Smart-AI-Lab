import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const NotificationCard = ({ notification }) => {
  const item = notification || {
    title: 'Booking Approved',
    message: 'Your booking for GPU Server Alpha (NVIDIA A100) has been approved.',
    time: '10 mins ago',
    type: 'success',
  };

  const getIcon = () => {
    if (item.type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (item.type === 'warning') return <AlertCircle className="w-5 h-5 text-amber-400" />;
    return <Info className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{item.message}</p>
        <span className="text-[10px] text-slate-500 mt-2 block">{item.time}</span>
      </div>
    </div>
  );
};

export default NotificationCard;
