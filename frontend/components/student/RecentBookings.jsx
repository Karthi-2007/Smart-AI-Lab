import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { studentService } from '../../../services/studentService';
import { toast } from 'react-hot-toast';

const RecentBookings = () => {
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
        console.error('Error fetching recent bookings:', error);
        toast.error('Failed to load recent bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const recent = bookings
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-5">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-slate-400 py-4">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="text-center text-slate-400 py-4">No recent bookings found.</div>
        ) : (
          recent.map((booking) => (
            <div
              key={booking.id || booking._id}
              className="flex justify-between items-center bg-slate-800 rounded-xl p-4"
            >
              <div>
                <h3 className="font-semibold">
                  {booking.equipment?.name || booking.equipment || 'Unknown Equipment'}
                </h3>
                <p className="text-slate-400 text-sm">
                  {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === "Approved"
                    ? "bg-green-500/20 text-green-400"
                    : booking.status === "Pending"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentBookings;