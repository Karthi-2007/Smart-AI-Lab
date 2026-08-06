import React from 'react';
import { Wrench, Calendar, Activity, CheckCircle } from 'lucide-react';

const MaintenanceStats = ({ maintenance = [], loading }) => {
  const list = Array.isArray(maintenance) ? maintenance : (maintenance?.data || []);
  const total = list.length;
  const scheduled = list.filter(m => m?.status === 'Scheduled').length;
  const inProgress = list.filter(m => m?.status === 'In Progress').length;
  const completed = list.filter(m => m?.status === 'Completed').length;

  const stats = [
    { label: 'Total Tasks', value: total, icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Scheduled', value: scheduled, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'In Progress', value: inProgress, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-32 animate-pulse flex items-center justify-between">
            <div className="space-y-3 w-1/2">
              <div className="h-4 bg-slate-800 rounded"></div>
              <div className="h-8 bg-slate-800 rounded"></div>
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </div>
          <div className={`p-4 rounded-xl ${stat.bg}`}>
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MaintenanceStats;