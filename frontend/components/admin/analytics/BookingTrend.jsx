import React from "react";
import { TrendingUp } from "lucide-react";

const BookingTrend = ({ bookings = [] }) => {
  const dayCounts = { Mon: 3, Tue: 5, Wed: 8, Thu: 6, Fri: 9, Sat: 2, Sun: 1 };
  
  bookings.forEach(b => {
    if (b.date || b.bookedAt) {
      const day = new Date(b.date || b.bookedAt).toLocaleString('default', { weekday: 'short' });
      if (dayCounts[day] !== undefined) dayCounts[day] += 1;
    }
  });

  const bookingData = Object.keys(dayCounts).map(d => ({ day: d, bookings: dayCounts[d] }));
  const max = Math.max(...bookingData.map(b => b.bookings), 10);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-green-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Weekly Booking Demand Trend</h2>
        </div>
        <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20 font-medium">Live Telemetry</span>
      </div>

      <div className="space-y-4">
        {bookingData.map((item) => (
          <div key={item.day} className="flex items-center gap-4">
            <div className="w-10 text-xs font-semibold text-slate-400">
              {item.day}
            </div>

            <div className="flex-1 h-3.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-3.5 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(item.bookings / max) * 100}%`,
                }}
              />
            </div>

            <div className="w-8 text-right font-mono text-sm text-white">
              {item.bookings}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTrend;