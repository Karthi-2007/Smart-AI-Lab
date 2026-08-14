import React from 'react';
import { Package, CheckCircle2, Wrench, AlertTriangle } from 'lucide-react';

const EquipmentStats = ({ equipment = [], loading = false }) => {
  const list = Array.isArray(equipment) ? equipment : (equipment?.data || []);
  const totalEquipment = list.length;
  const availableCount = list.filter(item => item?.status === 'Available').length;
  const maintenanceCount = list.filter(item => {
    const s = (item?.status || '').toLowerCase();
    return s.includes('maintenance') || s === 'in use' || s === 'booked';
  }).length;
  const faultyCount = list.filter(item => item?.status === 'Faulty').length;

  const stats = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: Package,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      title: 'Available',
      value: availableCount,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/20'
    },
    {
      title: 'Under Maintenance',
      value: maintenanceCount,
      icon: Wrench,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20'
    },
    {
      title: 'Faulty',
      value: faultyCount,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-slate-700 animate-pulse rounded mt-1"></div>
                ) : (
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                )}
              </div>
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EquipmentStats;