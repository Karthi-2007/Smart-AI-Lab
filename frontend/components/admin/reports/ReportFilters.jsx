const ReportFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold mb-5">

        Report Filters

      </h2>

      <div className="grid md:grid-cols-5 gap-4">

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Reports</option>
          <option>Students</option>
          <option>Faculty</option>
          <option>Equipment</option>
          <option>Bookings</option>
          <option>Maintenance</option>

        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Departments</option>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>Mechanical</option>

        </select>

        <input
          type="date"
          className="bg-slate-800 border border-slate-700 rounded-xl p-3"
        />

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

export default ReportFilters;