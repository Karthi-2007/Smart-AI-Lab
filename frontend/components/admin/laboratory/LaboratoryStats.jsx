import React from 'react';
import { FlaskConical, Users, Package, CheckCircle2 } from 'lucide-react';

const LaboratoryStats = ({ labs = [], loading = false }) => {
  const labList = Array.isArray(labs) ? labs : (labs?.data || []);
  const totalLabs = labList.length;
  const activeLabs = labList.filter(lab => lab?.status === 'Active' || lab?.status === 'ACTIVE').length;
  const totalCapacity = labList.reduce((sum, lab) => sum + (Number(lab?.capacity) || 0), 0);
  const totalEquipment = labList.reduce((sum, lab) => sum + (Number(lab?.equipmentCount) || 0), 0);

  const stats = [
    {
      title: 'Total Labs',
      value: totalLabs,
      icon: FlaskConical,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      title: 'Active Labs',
      value: activeLabs,
      icon: CheckCircle2,
      color: 'text-green-400',
      bg: 'bg-green-500/20'
    },
    {
      title: 'Total Capacity',
      value: totalCapacity,
      icon: Users,
      color: 'text-orange-400',
      bg: 'bg-orange-500/20'
    },
    {
      title: 'Equipment Items',
      value: totalEquipment,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
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

export default LaboratoryStats;