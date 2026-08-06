import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FacultyPagination = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="flex flex-col md:flex-row justify-between items-center gap-5">

        <p className="text-slate-400">

          Showing <span className="text-white font-semibold">1</span> to{" "}
          <span className="text-white font-semibold">10</span> of{" "}
          <span className="text-white font-semibold">85</span> faculty members

        </p>

        <div className="flex gap-2">

          <button className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">

            <ChevronLeft size={18} />

          </button>

          <button className="w-10 h-10 bg-orange-500 rounded-lg font-semibold">

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

export default FacultyPagination;