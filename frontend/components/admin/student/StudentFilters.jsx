const StudentFilters = ({
  selectedDept,
  setSelectedDept,
  selectedYear,
  setSelectedYear,
  selectedStatus,
  setSelectedStatus
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="grid md:grid-cols-3 gap-5">
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
        >
          <option>All Departments</option>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>Mechanical</option>
          <option>Civil</option>
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
        >
          <option>All Years</option>
          <option>I Year</option>
          <option>II Year</option>
          <option>III Year</option>
          <option>IV Year</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-orange-500"
        >
          <option>Status</option>
          <option>Activated</option>
          <option>Pending</option>
        </select>
      </div>
    </div>
  );
};

export default StudentFilters;