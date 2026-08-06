import React from 'react';
import Badge from '../ui/Badge';

const RecentBookings = () => {
  const bookings = [
    { id: 101, student: 'Rohan Sharma', equipment: 'GPU Server Alpha', date: '2026-03-29', status: 'Approved' },
    { id: 102, student: 'Ananya Verma', equipment: 'Logic Analyzer', date: '2026-03-29', status: 'Pending' },
    { id: 103, student: 'Karan Malhotra', equipment: '3D Printer', date: '2026-03-28', status: 'Rejected' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <h3 className="text-md font-semibold text-white mb-4">Recent Booking Activity</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="py-2">Student</th>
              <th className="py-2">Equipment</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="py-2.5 font-medium text-white">{b.student}</td>
                <td className="py-2.5">{b.equipment}</td>
                <td className="py-2.5 text-slate-400">{b.date}</td>
                <td className="py-2.5">
                  <Badge variant={b.status === 'Approved' ? 'success' : b.status === 'Pending' ? 'warning' : 'danger'}>
                    {b.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;
