const StudentFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="grid md:grid-cols-3 gap-5">

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Departments</option>

          <option>CSE</option>

          <option>ECE</option>

          <option>EEE</option>

          <option>Mechanical</option>

          <option>Civil</option>

        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>All Years</option>

          <option>I Year</option>

          <option>II Year</option>

          <option>III Year</option>

          <option>IV Year</option>

        </select>

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3">

          <option>Activation Status</option>

          <option>Activated</option>

          <option>Pending</option>

        </select>

      </div>

    </div>
  );
};

export default StudentFilters;