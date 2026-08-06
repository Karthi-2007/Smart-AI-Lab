import { ChevronLeft, ChevronRight } from "lucide-react";

const EquipmentPagination = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex flex-col md:flex-row items-center justify-between gap-5">

        <p className="text-slate-400">

          Showing <span className="text-white font-semibold">1</span> to{" "}
          <span className="text-white font-semibold">10</span> of{" "}
          <span className="text-white font-semibold">165</span> equipment

        </p>

        <div className="flex items-center gap-2">

          <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">

            <ChevronLeft size={18} />

          </button>

          <button className="w-10 h-10 rounded-lg bg-orange-500 text-white font-semibold">

            1

          </button>

          <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition">

            2

          </button>

          <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 transition">

            3

          </button>

          <button className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition">

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </div>
  );
};

export default EquipmentPagination;