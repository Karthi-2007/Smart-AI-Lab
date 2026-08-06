import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const MaintenancePagination = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex justify-between items-center">

        <p className="text-slate-400">
          Showing 1 to 5 of 25 Maintenance Records
        </p>

        <div className="flex gap-2">

          <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <ChevronLeft size={18} />
          </button>

          <button className="w-10 h-10 bg-orange-500 rounded-lg">
            1
          </button>

          <button className="w-10 h-10 bg-slate-800 rounded-lg">
            2
          </button>

          <button className="w-10 h-10 bg-slate-800 rounded-lg">
            3
          </button>

          <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
            <ChevronRight size={18} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default MaintenancePagination;