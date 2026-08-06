import React from 'react';
import Badge from '../ui/Badge';
import { Cpu, HardDrive, Zap, Info } from 'lucide-react';

const EquipmentDetailsCard = ({ equipment }) => {
  const item = equipment || {
    name: 'GPU Server Alpha (NVIDIA A100)',
    status: 'Available',
    lab: 'Deep Learning & Neural Networks Lab',
    specs: '8x NVIDIA A100 80GB PCIe, 512GB RAM, 10TB NVMe RAID',
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{item.name}</h2>
        <Badge variant={item.status === 'Available' ? 'success' : 'warning'}>{item.status}</Badge>
      </div>
      <p className="text-sm text-slate-400">{item.lab}</p>
      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>8x Tensor Core Accelerators</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-300">
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>10TB High Speed Storage</span>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailsCard;
