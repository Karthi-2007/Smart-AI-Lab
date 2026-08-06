import { Search } from "lucide-react";

const FacultySearch = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="relative">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by Faculty ID, Name, Department..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:border-orange-500 outline-none"
        />

      </div>

    </div>
  );
};

export default FacultySearch;