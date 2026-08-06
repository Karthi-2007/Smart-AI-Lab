const FacultyFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="grid md:grid-cols-4 gap-4">

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Departments</option>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>Mechanical</option>
          <option>Civil</option>

        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Designations</option>
          <option>Professor</option>
          <option>Associate Professor</option>
          <option>Assistant Professor</option>

        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>On Leave</option>

        </select>

        <button className="bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold">

          Apply Filters

        </button>

      </div>

    </div>
  );
};

export default FacultyFilters;