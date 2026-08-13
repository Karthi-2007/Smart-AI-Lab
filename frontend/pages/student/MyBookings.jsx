import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, FileText, CheckCircle, XCircle, Clock4, CheckCircle2, AlertCircle, QrCode, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import QRCodeCard from '../../components/booking/QRCodeCard';
import Pagination from '../../components/common/Pagination';

const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [cancellingId, setCancellingId] = useState(null);
  const [qrModalBooking, setQrModalBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let res;
      switch (activeTab) {
        case 'Pending':
          res = await studentService.getMyBookingsPending();
          break;
        case 'Approved':
          res = await studentService.getMyBookingsApproved();
          break;
        case 'Rejected':
          res = await studentService.getMyBookingsRejected();
          break;
        case 'Completed':
          res = await studentService.getMyBookingsCompleted();
          break;
        case 'Cancelled':
          res = await studentService.getMyBookingsCancelled();
          break;
        case 'All':
        default:
          res = await studentService.getMyBookingsAll();
          break;
      }
      const body = res?.data || res;
      let list = [];
      if (body) {
        if (body.success && body.data) {
          list = body.data.content || body.data;
        } else {
          list = body.content || body;
        }
      }
      setBookings(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load your bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      setCancellingId(id);
      await studentService.cancelBooking(id);
      toast.success('Booking cancelled successfully');
      setBookings(prev => prev.map(b => (b.bookingId === id || b.id === id || b._id === id) ? { ...b, status: 'Cancelled' } : b));
    } catch (error) {
      toast.error('Failed to cancel booking');
      console.error(error);
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><CheckCircle2 className="h-3 w-3" /> Approved</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><Clock4 className="h-3 w-3" /> Pending</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><XCircle className="h-3 w-3" /> Rejected</span>;
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20"><CheckCircle className="h-3 w-3" /> Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20"><AlertCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">{status}</span>;
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings;
  }, [bookings]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-slate-400">Manage your equipment reservations & entry passes</p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 hide-scrollbar">
        <div className="flex gap-2">
          {STATUS_FILTERS.map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Equipment</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 font-medium">Purpose</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Action / Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-3/4"></div></td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-700 rounded w-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-700 rounded-full w-20"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-700 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p className="text-base font-medium text-slate-400">No bookings found</p>
                    <p className="text-sm mt-1">You haven't made any bookings that match this filter.</p>
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((booking, index) => {
                  const bookingId = booking.bookingId || booking.id || booking._id || index;
                  const isApproved = booking.status?.toLowerCase() === 'approved' || booking.status?.toLowerCase() === 'completed';

                  return (
                    <tr key={bookingId} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-200 flex items-center gap-1.5">
                          {booking.equipment?.name || 'Unknown Equipment'}
                          {(booking.isUrgent === true || booking.isUrgent === 'true' || booking.urgent === true) && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded animate-pulse">
                              URGENT
                            </span>
                          )}
                        </div>
                        {booking.equipment?.equipmentId && (
                          <div className="text-xs text-slate-500 mt-1">ID: {booking.equipment.equipmentId}</div>
                        )}
                        {booking.status?.toLowerCase() === 'rejected' && booking.rejectionReason && (
                          <div className="text-xs text-red-400 mt-1.5 font-medium bg-red-500/5 border border-red-500/10 rounded-lg p-2 max-w-xs">
                            Reason: {booking.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-200 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {booking.date ? new Date(booking.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : (booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A')}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-xs whitespace-nowrap">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {booking.timeSlot || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-1.5 min-w-[200px]">
                          <FileText className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2" title={booking.purpose}>
                            {booking.purpose || 'No purpose provided'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setQrModalBooking(booking)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
                              isApproved
                                ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white'
                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-white'
                            }`}
                            title="Show Lab Entry Pass QR"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{isApproved ? 'QR Pass' : 'View Pass'}</span>
                          </button>

                          {booking.status?.toLowerCase() === 'pending' && (
                            <button
                              onClick={() => handleCancelBooking(bookingId)}
                              disabled={cancellingId === bookingId}
                              className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-white border border-red-500/50 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {cancellingId === bookingId ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredBookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* QR Code Pass Modal */}
      {qrModalBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative text-center">
            <button
              onClick={() => setQrModalBooking(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Equipment Access Pass</h3>
            <p className="text-xs text-slate-400 mb-4">Scan at lab entrance for check-in & check-out</p>

            {qrModalBooking.status?.toLowerCase() === 'pending' && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-2 text-left text-xs text-blue-400">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Notice: This reservation is currently <strong>Pending Faculty Approval</strong>. Scan validation activates upon approval.</span>
              </div>
            )}

            <QRCodeCard value={`SMARTLAB-BOOKING-${qrModalBooking.bookingId || qrModalBooking.id || 'PASS'}`} />

            <div className="mt-6 p-4 bg-slate-800/60 rounded-2xl text-xs text-left space-y-1.5 border border-slate-700/60">
              <p className="text-slate-300"><span className="text-slate-500 font-medium">Equipment:</span> {qrModalBooking.equipment?.name || 'Lab Equipment'}</p>
              <p className="text-slate-300"><span className="text-slate-500 font-medium">Reserved Date:</span> {qrModalBooking.date || 'Today'}</p>
              <p className="text-slate-300"><span className="text-slate-500 font-medium">Time Slot:</span> {qrModalBooking.timeSlot || 'Scheduled Session'}</p>
              <p className="text-slate-300"><span className="text-slate-500 font-medium">Pass Status:</span> <span className="font-bold text-orange-400 uppercase">{qrModalBooking.status || 'PENDING'}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;