import React from 'react';
import { Building2, Users, Beaker, CheckCircle } from 'lucide-react';

const DepartmentStats = ({ departments = [], loading = false }) => {
  const deptList = Array.isArray(departments) ? departments : (departments?.data || []);

  const stats = [
    {
      title: 'Total Departments',
      value: deptList.length,
      icon: Building2,
      color: 'text-blue-500',
      bg: 'bg-blue-500/20'
    },
    {
      title: 'Active Departments',
      value: deptList.filter(d => (d?.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-500/20'
    },
    {
      title: 'HODs Assigned',
      value: new Set(deptList.map(d => d?.hod).filter(Boolean)).size,
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/20'
    },
    {
      title: 'Total Labs',
      value: deptList.reduce((acc, curr) => acc + (parseInt(curr?.labCount) || 0), 0),
      icon: Beaker,
      color: 'text-purple-500',
      bg: 'bg-purple-500/20'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[104px] animate-pulse">
            <div className="flex justify-between items-center h-full">
              <div className="space-y-3 w-1/2">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-6 bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
            <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
          </div>
          <div className={`p-3 rounded-xl ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentStats;