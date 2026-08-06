import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import DashboardStats from '../../components/student/dashboard/DashboardStats';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const [dashboard, bookings] = await Promise.all([
          studentService.getDashboard(user.id),
          studentService.getMyBookings(user.id)
        ]);
        
        const dashboardObj = dashboard?.data || dashboard || {};
        const bookingList = bookings?.data || bookings || [];

        setDashboardData({
          ...dashboardObj,
          recentBookings: Array.isArray(bookingList) ? bookingList.slice(0, 5) : []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const recentBookings = dashboardData?.recentBookings || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-medium rounded-full border border-green-500/20">Approved</span>;
      case 'Pending':
        return <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-medium rounded-full border border-yellow-500/20">Pending</span>;
      case 'Completed':
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-medium rounded-full border border-blue-500/20">Completed</span>;
      case 'Rejected':
      case 'Cancelled':
        return <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-medium rounded-full border border-red-500/20">{status}</span>;
      default:
        return <span className="px-3 py-1 bg-slate-500/10 text-slate-400 text-xs font-medium rounded-full border border-slate-500/20">{status || 'Unknown'}</span>;
        return <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0b2545]">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-slate-500 mt-2">Here's an overview of your lab activities.</p>
      </div>

      <DashboardStats dashboardData={dashboardData} loading={loading} />

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#0b2545]">Recent Activity</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
               <p className="text-slate-500">Loading recent activities...</p>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-[#0b2545] mb-2">No Recent Activity</h3>
              <p className="text-slate-500 max-w-sm">You haven't made any bookings yet. Once you book equipment or a lab, it will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Equipment/Lab</th>
                  <th className="p-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Date</th>
                  <th className="p-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Time Slot</th>
                  <th className="p-4 text-slate-500 text-sm font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((booking, idx) => (
                  <tr key={booking._id || booking.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="text-[#0b2545] font-semibold">
                        {booking.equipment?.name || booking.labName || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">
                      {booking.date ? new Date(booking.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </td>
                    <td className="p-4 text-slate-600">
                      {booking.timeSlot || `${booking.startTime || ''} - ${booking.endTime || ''}`.replace(/^- | -$/g, '') || 'N/A'}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(booking.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;