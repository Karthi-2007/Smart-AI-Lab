import { Package, Eye, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EquipmentCard = ({ equipment }) => {
  const navigate = useNavigate();
  const eqId = equipment.equipmentId || equipment.id || equipment._id;
  const isAvailable = (equipment.status || '').toLowerCase() === 'available';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">
              {equipment.name}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {equipment.laboratory?.name || equipment.labName || equipment.lab || 'General Lab'}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shrink-0">
            <Package size={22} />
          </div>
        </div>

        <div className="mt-5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border inline-block ${
              isAvailable
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/15 text-rose-400 border-rose-500/20"
            }`}
          >
            {equipment.status || 'Available'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate(`/student/equipment?id=${eqId}`)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-300 transition-colors"
        >
          <Eye size={16} />
          Details
        </button>

        <button
          onClick={() => navigate(`/student/book-equipment?equipmentId=${eqId}`)}
          disabled={!isAvailable}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
            isAvailable
              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
              : "bg-slate-800 text-slate-500 cursor-not-allowed"
          }`}
        >
          <CalendarPlus size={16} />
          {isAvailable ? 'Book' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;