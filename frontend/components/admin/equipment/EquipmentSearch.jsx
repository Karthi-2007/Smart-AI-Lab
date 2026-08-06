import { Search } from "lucide-react";

const EquipmentSearch = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

      <div className="relative">

        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search by Equipment ID, Equipment Name, Brand or Laboratory..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500"
        />

      </div>

    </div>
  );
};

export default EquipmentSearch;