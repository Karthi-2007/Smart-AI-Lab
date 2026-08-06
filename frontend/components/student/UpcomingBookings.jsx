import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { studentService } from '../../../services/studentService';
import { toast } from 'react-hot-toast';

const UpcomingBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await studentService.getMyBookings(user.id);
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching upcoming bookings:', error);
        toast.error('Failed to load upcoming bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const upcoming = bookings
    .filter(b => b.status === 'Approved' || b.status === 'Pending')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-5">
        Upcoming Bookings
      </h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-400 py-4">Loading...</div>
        ) : upcoming.length === 0 ? (
          <div className="text-center text-slate-400 py-4">No upcoming bookings.</div>
        ) : (
          upcoming.map((booking) => (
            <div
              key={booking.id || booking._id}
              className="bg-slate-800 rounded-xl p-4"
            >
              <h3 className="font-semibold">
                {booking.equipment?.name || booking.equipment || 'Unknown Equipment'}
              </h3>
              <p className="text-slate-400 mt-1">
                {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
              </p>
              <span className="inline-block mt-3 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-sm">
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingBookings;