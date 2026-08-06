import { RotateCcw } from "lucide-react";

const EquipmentFilters = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">

        {/* Category */}

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500">

          <option>All Categories</option>
          <option>Electronics</option>
          <option>Computer</option>
          <option>Mechanical</option>
          <option>Electrical</option>
          <option>Chemistry</option>

        </select>

        {/* Laboratory */}

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500">

          <option>All Laboratories</option>
          <option>Programming Lab</option>
          <option>Embedded Lab</option>
          <option>Network Lab</option>
          <option>IoT Lab</option>
          <option>Project Lab</option>

        </select>

        {/* Status */}

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500">

          <option>All Status</option>
          <option>Available</option>
          <option>Booked</option>
          <option>Maintenance</option>
          <option>Unavailable</option>

        </select>

        {/* Condition */}

        <select className="bg-slate-800 border border-slate-700 rounded-xl p-3 focus:outline-none focus:border-orange-500">

          <option>All Conditions</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Fair</option>
          <option>Repair</option>

        </select>

        {/* Reset */}

        <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition">

          <RotateCcw size={18} />

          Reset

        </button>

      </div>

    </div>
  );
};

export default EquipmentFilters;