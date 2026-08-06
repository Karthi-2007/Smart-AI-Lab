import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Search, Clock, Calendar, User, Tag, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { facultyService } from '../../services/facultyService';
import QRScannerModal from '../../components/common/QRScannerModal';

export default function BookingApprovals() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await facultyService.getBookings();
      setBookings(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleApprove = async (id) => {
    try {
      await facultyService.approveBooking(id);
      toast.success('Booking approved successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to approve booking');
      console.error('Error approving booking:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await facultyService.rejectBooking(id);
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
      console.error('Error rejecting booking:', error);
    }
  };

  const filteredBookings = useMemo(() => {
    let result = bookings;
    
    if (filter !== 'All') {
      result = result.filter(b => b.status?.toUpperCase() === filter.toUpperCase());
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b =>
        (b.student?.name && b.student.name.toLowerCase().includes(term)) ||
        (b.equipment?.name && b.equipment.name.toLowerCase().includes(term)) ||
        (b.bookingId && String(b.bookingId).includes(term))
      );
    }
    
    return result;
  }, [bookings, filter, searchTerm]);

  const tabs = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'Approved': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      default: return 'bg-slate-700 text-slate-300 border border-slate-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Booking Approvals</h1>
          <p className="text-xs text-slate-400">Review student reservations & verify entry passes</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-semibold rounded-xl transition shadow-lg flex items-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Pass</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab 
                ? 'bg-orange-500 text-white' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Equipment</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-40"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-slate-800 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-slate-800 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-slate-800/30 transition-colors text-slate-300">
                    <td className="px-6 py-4 font-mono text-xs">#{booking.bookingId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {(() => {
                              const sName = (booking.studentName || booking.student?.name || '').trim();
                              if (sName && !sName.toLowerCase().includes('student') && !sName.match(/^\d+/)) {
                                return sName;
                              }
                              return 'Karthikeyan RKS';
                            })()}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {booking.student?.regNo || (booking.student?.name?.match(/^\d+/) ? booking.student.name : '717824F207')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span>{booking.equipment?.name || 'Unknown Equipment'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{booking.date || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.timeSlot || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status?.toUpperCase() === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleApprove(booking.bookingId)}
                              className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                              title="Approve Booking"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleReject(booking.bookingId)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Reject Booking"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-500 text-xs italic">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                      <Calendar className="w-12 h-12 text-slate-700" />
                      <p className="text-base font-medium text-slate-400">No bookings found</p>
                      <p className="text-sm">Try adjusting your filters or search term.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onVerificationSuccess={fetchBookings} 
      />
    </div>
  );
}