import React from 'react';
import Badge from '../ui/Badge';
import { Wrench } from 'lucide-react';

const MaintenanceCard = ({ maintenance }) => {
  const item = maintenance || {
    id: 1,
    equipmentName: '3D Printer Ultimaker S5',
    scheduledAt: '2026-04-05',
    status: 'Scheduled',
    notes: 'Routine nozzle calibration and bed levelling.',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Wrench className="w-5 h-5" />
          <h3 className="text-md font-semibold text-white">{item.equipmentName}</h3>
        </div>
        <Badge variant={item.status === 'Completed' ? 'success' : 'warning'}>{item.status}</Badge>
      </div>
      <p className="text-xs text-slate-300">{item.notes}</p>
      <p className="text-[11px] text-slate-400 pt-1">Scheduled for: {item.scheduledAt}</p>
    </div>
  );
};

export default MaintenanceCard;
