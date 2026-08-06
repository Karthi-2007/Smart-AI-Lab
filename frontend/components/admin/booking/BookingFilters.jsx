const BookingFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="grid md:grid-cols-4 gap-4">

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">
          <option>All Laboratories</option>
          <option>AI Laboratory</option>
          <option>IoT Laboratory</option>
          <option>Electronics Lab</option>
          <option>Innovation Lab</option>
        </select>

        <input
          type="date"
          className="bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

        <button className="bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold">
          Apply Filters
        </button>

      </div>

    </div>
  );
};

export default BookingFilters;