import React, { useState, useEffect } from 'react';
import { facultyService } from '../../services/facultyService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  ClipboardCheck, 
  CalendarCheck, 
  CheckCircle2, 
  AlertTriangle,
  Check,
  X,
  Loader2
} from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectingBookingId, setRejectingBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardRes = await facultyService.getDashboard();
      const bookingsRes = await facultyService.getBookings();
      
      const dashData = dashboardRes?.data?.data || dashboardRes?.data || {};
      const bookingsBody = bookingsRes?.data || bookingsRes;
      let bookData = [];
      if (bookingsBody) {
        if (bookingsBody.success && bookingsBody.data) {
          bookData = bookingsBody.data.content || bookingsBody.data;
        } else {
          bookData = bookingsBody.content || bookingsBody;
        }
      }
      
      setStatsData(dashData);
      setBookings(Array.isArray(bookData) ? bookData : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!id) {
      toast.error('Invalid booking ID');
      return;
    }
    try {
      setActionLoading(`approve-${id}`);
      await facultyService.approveBooking(id);
      toast.success('Booking approved successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error('Failed to approve booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (id) => {
    if (!id) {
      toast.error('Invalid booking ID');
      return;
    }
    setRejectingBookingId(id);
    setRejectionReason('');
  };

  const submitRejection = async () => {
    if (!rejectingBookingId) return;
    try {
      setActionLoading(`reject-${rejectingBookingId}`);
      await facultyService.rejectBooking(rejectingBookingId, { reason: rejectionReason || "No reason specified" });
      toast.success('Booking rejected successfully');
      setRejectingBookingId(null);
      setRejectionReason('');
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast.error('Failed to reject booking');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingBookings = bookings.filter(b => b.status?.toUpperCase() === 'PENDING');
  const activeBookings = bookings.filter(b => b.status?.toUpperCase() === 'APPROVED' || b.status?.toUpperCase() === 'ACTIVE');
  const completedBookings = bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED');
  const recentPending = [...pendingBookings].sort((a, b) => {
    const aUrgent = a.isUrgent === true || a.isUrgent === 'true' || a.urgent === true;
    const bUrgent = b.isUrgent === true || b.isUrgent === 'true' || b.urgent === true;
    if (aUrgent && !bUrgent) return -1;
    if (!aUrgent && bUrgent) return 1;
    return new Date(b.createdAt || b.bookedAt || 0) - new Date(a.createdAt || a.bookedAt || 0);
  }).slice(0, 5);

  const stats = [
    {
      title: 'Pending Approvals',
      value: statsData.pendingBookings ?? pendingBookings.length,
      icon: ClipboardCheck,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Active Bookings',
      value: statsData.approvedBookings ?? activeBookings.length,
      icon: CalendarCheck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Completed Bookings',
      value: statsData.completedBookings ?? completedBookings.length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Fault Reports',
      value: statsData.faultCount ?? statsData.openFaults ?? 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-slate-800 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-32 animate-pulse"></div>
          ))}
        </div>
        <div className="bg-slate-900 rounded-xl border border-slate-800 h-96 animate-pulse mt-8"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto text-slate-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, Professor {user?.name || ''}</h1>
          <p className="text-slate-400 mt-1">Here's what's happening in your laboratories today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.title}</p>
              <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            </div>
            <div className={`p-4 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Approvals Needed */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Recent Approvals Needed</h2>
          <p className="text-sm text-slate-400 mt-1">Review and manage recent laboratory booking requests.</p>
        </div>
        
        <div className="overflow-x-auto">
          {recentPending.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-sm">
                  <th className="p-4 font-medium">Laboratory</th>
                  <th className="p-4 font-medium">Date &amp; Time</th>
                  <th className="p-4 font-medium">Purpose</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentPending.map((booking, idx) => {
                  const bId = booking.bookingId || booking.id;
                  return (
                    <tr key={bId || `pending-${idx}`} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-white">{booking.equipment?.name || 'Unknown Equipment'}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                          Requested by: {booking.student?.name || 'Unknown User'}
                          {(booking.isUrgent === true || booking.isUrgent === 'true' || booking.urgent === true) && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded animate-pulse">
                              URGENT
                            </span>
                          )}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</p>
                        <p className="text-xs text-slate-400">{booking.timeSlot || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm truncate max-w-[200px] inline-block" title={booking.purpose}>
                          {booking.purpose || 'No purpose specified'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(bId)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `approve-${bId}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(bId)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `reject-${bId}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No pending approvals needed right now.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-white mb-2">Reject Booking Request</h3>
            <p className="text-xs text-slate-400 mb-4">Please provide a reason for rejecting this booking. The student will be notified.</p>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Type rejection reason here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors h-28 resize-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setRejectingBookingId(null); setRejectionReason(''); }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;