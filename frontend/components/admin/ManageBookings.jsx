import React, { useState } from 'react';
import BookingTable from './booking/BookingTable';
import BookingStats from './booking/BookingStats';

const BookingSearch = ({ search, setSearch }) => (
  <div className="flex-1">
    <input
      type="text"
      placeholder="Search bookings by ID, student, equipment..."
      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition text-white"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
);

const ManageBookings = () => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookingsLoaded = (data) => {
    setBookings(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
          <p className="text-slate-400">View and approve/reject equipment booking requests</p>
        </div>
      </div>

      <BookingStats bookings={bookings} loading={loading} />

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <BookingSearch search={search} setSearch={setSearch} />
        <select 
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-orange-500 text-slate-300 md:w-48"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <BookingTable search={search} selectedStatus={selectedStatus} onBookingsLoaded={handleBookingsLoaded} />
    </div>
  );
};

export default ManageBookings;