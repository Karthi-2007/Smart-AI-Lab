import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const DashboardStats = ({ dashboardData, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-6 animate-pulse flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-10 w-10 bg-slate-800 rounded-full"></div>
            </div>
            <div className="h-8 bg-slate-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback values if dashboardData is structured differently
  const totalBookings = dashboardData?.totalBookings || dashboardData?.stats?.totalBookings || 0;
  const activeBookings = dashboardData?.activeBookings || dashboardData?.stats?.activeBookings || 0;
  const completedBookings = dashboardData?.completedBookings || dashboardData?.stats?.completedBookings || 0;
  const recentFaults = dashboardData?.recentFaults || dashboardData?.stats?.recentFaults || 0;

  const stats = [
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Active Bookings', value: activeBookings, icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
    { label: 'Completed', value: completedBookings, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Recent Faults', value: recentFaults, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-lg p-6 flex items-center justify-between hover:border-slate-300 transition-colors shadow-sm">
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-[#0b2545] mt-2">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
