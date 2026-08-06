import React from 'react';
import Badge from '../ui/Badge';

const EquipmentStatus = ({ items = [] }) => {
  const defaultItems = [
    { id: 1, name: 'GPU Server Alpha (NVIDIA A100)', lab: 'Deep Learning Lab', status: 'Available' },
    { id: 2, name: 'Oscilloscope Tektronix TBS2000B', lab: 'VLSI Lab', status: 'Booked' },
    { id: 3, name: '3D Printer Ultimaker S5', lab: 'Robotics Lab', status: 'Maintenance' },
  ];

  const list = items.length > 0 ? items : defaultItems;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <h3 className="text-md font-semibold text-white mb-4">Live Equipment Status</h3>
      <div className="space-y-3">
        {list.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-slate-800/40 rounded-xl text-xs">
            <div>
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-slate-400">{item.lab}</p>
            </div>
            <Badge variant={item.status === 'Available' ? 'success' : item.status === 'Booked' ? 'info' : 'warning'}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentStatus;
