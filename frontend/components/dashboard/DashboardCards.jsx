import React from 'react';
import StatCard from '../ui/StatCard';
import { Server, Users, CalendarCheck, AlertTriangle } from 'lucide-react';

const DashboardCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Equipment" value={stats.totalEquipment || 48} icon={Server} trend="+4 this month" />
      <StatCard title="Active Students" value={stats.totalStudents || 320} icon={Users} trend="+12 active" />
      <StatCard title="Total Bookings" value={stats.totalBookings || 142} icon={CalendarCheck} trend="88% approved" />
      <StatCard title="Fault Reports" value={stats.openFaults || 3} icon={AlertTriangle} trend="2 pending review" />
    </div>
  );
};

export default DashboardCards;
