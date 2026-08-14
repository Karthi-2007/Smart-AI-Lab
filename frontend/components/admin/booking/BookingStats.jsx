import React from 'react';
import { CalendarDays, Clock, CheckCircle, CheckCheck, XCircle, Ban } from 'lucide-react';

const BookingStats = ({ bookings = [], loading }) => {
  const list = Array.isArray(bookings) ? bookings : [];
  const total = list.length;
  const pending = list.filter(b => (b.status || '').toLowerCase() === 'pending').length;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const approvedToday = list.filter(b => {
    const st = (b.status || '').toLowerCase();
    const isApproved = st === 'approved';
    const bDate = b.date || b.bookingDate || (b.createdAt ? b.createdAt.substring(0, 10) : '');
    return isApproved && bDate === todayStr;
  }).length;

  const completed = list.filter(b => (b.status || '').toLowerCase() === 'completed').length;
  const rejected = list.filter(b => (b.status || '').toLowerCase() === 'rejected').length;
  const cancelled = list.filter(b => (b.status || '').toLowerCase() === 'cancelled' || (b.status || '').toLowerCase() === 'canceled').length;

  const stats = [
    { label: 'Total Bookings', value: total, icon: CalendarDays, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Pending Approval', value: pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Approved Today', value: approvedToday, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Completed', value: completed, icon: CheckCheck, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Rejected', value: rejected, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Cancelled', value: cancelled, icon: Ban, color: 'text-slate-400', bg: 'bg-slate-500/10' }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-28 animate-pulse flex items-center justify-between">
            <div className="space-y-2 w-1/2">
              <div className="h-3 bg-slate-800 rounded"></div>
              <div className="h-6 bg-slate-800 rounded"></div>
            </div>
            <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;