import React from 'react';
import Badge from '../ui/Badge';
import PrimaryButton from '../ui/PrimaryButton';
import { Server } from 'lucide-react';

const EquipmentCard = ({ equipment, onBook }) => {
  const item = equipment || {
    id: 1,
    name: 'GPU Server Alpha (NVIDIA A100)',
    category: 'High Performance Computing',
    status: 'Available',
    location: 'Deep Learning Lab',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 bg-slate-800/60 rounded-xl text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <Badge variant={item.status === 'Available' ? 'success' : 'warning'}>{item.status}</Badge>
        </div>
        <h3 className="text-md font-semibold text-white mb-1">{item.name}</h3>
        <p className="text-xs text-slate-400 mb-2">{item.location}</p>
        <span className="inline-block text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 mb-4">
          {item.category}
        </span>
      </div>
      <PrimaryButton onClick={() => onBook && onBook(item)}>
        Book Equipment
      </PrimaryButton>
    </div>
  );
};

export default EquipmentCard;
