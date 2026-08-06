import React from 'react';
import { CalendarDays, Clock, CheckCircle, XCircle } from 'lucide-react';

const BookingStats = ({ bookings = [], loading }) => {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const todayDate = new Date().toISOString().split('T')[0];
  const approvedToday = bookings.filter(b => b.status === 'Approved' && b.date === todayDate).length;
  const rejected = bookings.filter(b => b.status === 'Rejected').length;

  const stats = [
    { label: 'Total Bookings', value: total, icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pending Approval', value: pending, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Approved Today', value: approvedToday, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' }
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

export default BookingStats;