import React from 'react';

const FilterBar = ({ selected, onSelect, options = ['All', 'Active', 'Pending', 'Completed'] }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect && onSelect(opt)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            selected === opt || (!selected && opt === 'All')
              ? 'bg-cyan-500 text-black font-semibold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
