import React from 'react';
import Badge from '../ui/Badge';
import { AlertCircle } from 'lucide-react';

const FaultCard = ({ fault }) => {
  const item = fault || {
    id: 1,
    equipmentName: 'GPU Server Alpha (NVIDIA A100)',
    reportedBy: 'Rahul Sharma',
    date: '2026-03-28',
    status: 'Open',
    description: 'Overheating under full load.',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 text-rose-400">
          <AlertCircle className="w-5 h-5" />
          <h3 className="text-md font-semibold text-white">{item.equipmentName}</h3>
        </div>
        <Badge variant={item.status === 'Open' ? 'danger' : 'success'}>{item.status}</Badge>
      </div>
      <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">{item.description}</p>
      <div className="flex justify-between text-[11px] text-slate-400 pt-1">
        <span>Reported by: {item.reportedBy}</span>
        <span>{item.date}</span>
      </div>
    </div>
  );
};

export default FaultCard;
