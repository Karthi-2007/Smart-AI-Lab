import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Layers, Monitor, CalendarCheck, AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { adminService } from '../../services/adminService';
import toast from 'react-hot-toast';

import BookingTable from '../../components/admin/booking/BookingTable';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
    labs: 0,
    equipment: 0,
    todayBookings: 0,
    pendingFaults: 0,
    pendingMaintenance: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await adminService.getDashboard();
      const data = res?.data?.data || res?.data || res;
      setStats({
        students: data?.totalStudents || data?.students || 0,
        faculty: data?.totalFaculty || data?.faculty || 0,
        departments: data?.totalDepartments || data?.departments || 0,
        labs: data?.totalLaboratories || data?.labs || 0,
        equipment: data?.totalEquipments || data?.equipment || 0,
        todayBookings: data?.todayBookings || 0,
        pendingFaults: data?.activeFaults || data?.pendingFaults || 0,
        pendingMaintenance: data?.pendingMaintenance || 0
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Faculty', value: stats.faculty, icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Departments', value: stats.departments, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Laboratories', value: stats.labs, icon: Monitor, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Total Equipment', value: stats.equipment, icon: Monitor, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: "Today's Bookings", value: stats.todayBookings, icon: CalendarCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending Faults', value: stats.pendingFaults, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Pending Maint.', value: stats.pendingMaintenance, icon: Settings, color: 'text-orange-500', bg: 'bg-orange-500/10' }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name || 'Admin'}! 👋</h1>
        <p className="text-slate-400">Here's what's happening in your laboratories today.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-28 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Booking Requests</h2>
          <button 
            onClick={() => navigate('/admin/bookings')}
            className="text-orange-500 hover:text-orange-400 text-sm font-medium transition"
          >
            View All
          </button>
        </div>
        <BookingTable search="" />
      </div>
    </div>
  );
};

export default Dashboard;