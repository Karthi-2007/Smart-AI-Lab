import React, { useState, useEffect } from 'react';
import { CalendarDays, CheckCircle, XCircle, Eye, Trash2, X } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import toast from 'react-hot-toast';

const BookingTable = ({ search, onBookingsLoaded }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailBooking, setDetailBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBookings();
      const list = res?.data || res || [];
      const dataArray = Array.isArray(list) ? list : [];
      setBookings(dataArray);
      if (onBookingsLoaded) onBookingsLoaded(dataArray);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveBooking(id);
      setBookings(prev => prev.map(b => (b.bookingId === id || b.id === id) ? { ...b, status: 'Approved' } : b));
      toast.success('Booking approved!');
      fetchBookings();
    } catch (error) {
      toast.error('Could not approve booking.');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectBooking(id);
      setBookings(prev => prev.map(b => (b.bookingId === id || b.id === id) ? { ...b, status: 'Rejected' } : b));
      toast.success('Booking rejected!');
      fetchBookings();
    } catch (error) {
      toast.error('Could not reject booking.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete/cancel this booking?')) {
      try {
        await adminService.rejectBooking(id);
        setBookings(prev => prev.filter(b => (b.bookingId !== id && b.id !== id)));
        toast.success('Booking deleted!');
        fetchBookings();
      } catch (error) {
        toast.error('Could not delete booking.');
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!search) return true;
    const term = search.toLowerCase();
    const studentName = typeof b.student === 'object' ? b.student?.name : (b.student || '');
    const equipName = typeof b.equipment === 'object' ? b.equipment?.name : (b.equipment || '');
    return (
      studentName.toLowerCase().includes(term) ||
      equipName.toLowerCase().includes(term) ||
      (b.status || '').toLowerCase().includes(term) ||
      String(b.bookingId || b.id || '').toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">Pending</span>;
      case 'Approved': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Approved</span>;
      case 'Rejected': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">Rejected</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">Completed</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-12 bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredBookings.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <CalendarDays className="w-16 h-16 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
        <p className="text-slate-400">No equipment bookings match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Booking ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Equipment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Lab</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Time Slot</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredBookings.map((booking, idx) => {
              const bId = booking.bookingId || booking.id || booking._id || idx;
              const rawStudent = booking.studentName || booking.student?.name || (typeof booking.student === 'string' ? booking.student : '');
              const studentName = rawStudent && !rawStudent.toLowerCase().includes('student') && !rawStudent.match(/^\d+/) ? rawStudent : 'Karthikeyan RKS';
              const studentRegNo = booking.student?.regNo || (rawStudent.match(/^\d+/) ? rawStudent : '717824F207');
              const equipName = booking.equipment?.name || (typeof booking.equipment === 'string' ? booking.equipment : 'N/A');
              const labName = typeof booking.equipment?.laboratory === 'object' ? booking.equipment?.laboratory?.name : (booking.equipment?.labName || booking.lab || 'Main Lab');
              const bDate = booking.date || (booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : 'N/A');
              const bTime = booking.timeSlot || 'N/A';

              return (
                <tr key={bId} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">#{bId}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-semibold text-white">{studentName}</div>
                    <div className="text-xs text-slate-400 font-mono">{studentRegNo}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{equipName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{labName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{bDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{bTime}</td>
                  <td className="px-6 py-4">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'Pending' && (
                        <button onClick={() => handleApprove(bId)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="Approve Booking">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </button>
                      )}
                      <button onClick={() => setDetailBooking(booking)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="View Details">
                        <Eye className="w-5 h-5 text-slate-400" />
                      </button>
                      <button onClick={() => handleDelete(bId)} className="p-2 hover:bg-slate-700 rounded-lg transition" title="Delete / Reject">
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Booking Details Modal */}
      {detailBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-500" />
                Booking Details
              </h3>
              <button onClick={() => setDetailBooking(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-mono text-white">#{detailBooking.bookingId || detailBooking.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold text-white">{detailBooking.student?.name || detailBooking.student || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Equipment:</span>
                <span className="text-white">{detailBooking.equipment?.name || detailBooking.equipment || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Date:</span>
                <span className="text-white">{detailBooking.date || (detailBooking.bookedAt ? new Date(detailBooking.bookedAt).toLocaleDateString() : 'N/A')}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Time Slot:</span>
                <span className="text-white">{detailBooking.timeSlot || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Purpose:</span>
                <span className="text-white italic">{detailBooking.purpose || 'Lab Experiment'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${detailBooking.status === 'Approved' ? 'bg-green-500/20 text-green-400' : detailBooking.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                  {detailBooking.status || 'Pending'}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setDetailBooking(null)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;