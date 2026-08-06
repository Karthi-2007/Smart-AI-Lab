import React from 'react';
import Badge from '../ui/Badge';

const EquipmentTable = ({ equipments = [] }) => {
  return (
    <div className="overflow-x-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="border-b border-slate-800 text-slate-400">
          <tr>
            <th className="py-3 px-3">Equipment Name</th>
            <th className="py-3 px-3">Laboratory</th>
            <th className="py-3 px-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {equipments.map((item, idx) => {
            const eqId = item.equipmentId || item.id || idx;
            const labName = typeof item.laboratory === 'object'
              ? item.laboratory?.name
              : typeof item.lab === 'object'
              ? item.lab?.name
              : (item.laboratory || item.lab || 'General Lab');

            return (
              <tr key={eqId}>
                <td className="py-3 px-3 font-medium text-white">{item.name}</td>
                <td className="py-3 px-3 text-slate-400">{labName}</td>
                <td className="py-3 px-3">
                  <Badge variant={item.status === 'Available' ? 'success' : 'warning'}>{item.status || 'Available'}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
