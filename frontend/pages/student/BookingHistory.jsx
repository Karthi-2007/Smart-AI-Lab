import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { toast } from 'react-hot-toast';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await studentService.getMyBookings(user?.id);
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
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Booking History
        </h1>
        <p className="text-slate-400 mt-2">
          View all your previous bookings.
        </p>
      </div>

      <div className="overflow-x-auto bg-slate-900 rounded-2xl border border-slate-800">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Equipment</th>
              <th className="p-4 text-left">Laboratory</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Slot</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id || booking._id}
                  className="border-t border-slate-800 hover:bg-slate-800"
                >
                  <td className="p-4">{booking.id || booking._id}</td>
                  <td className="p-4">{booking.equipment?.name || booking.equipment}</td>
                  <td className="p-4">{booking.laboratory || booking.equipment?.lab || 'N/A'}</td>
                  <td className="p-4">{booking.date ? new Date(booking.date).toLocaleDateString() : (booking.bookingDate || 'N/A')}</td>
                  <td className="p-4">{booking.timeSlot || booking.slot || 'N/A'}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === "Approved"
                          ? "bg-green-500/20 text-green-400"
                          : booking.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : booking.status === "Completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingHistory;