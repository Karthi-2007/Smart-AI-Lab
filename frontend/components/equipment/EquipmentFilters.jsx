import React from 'react';

const EquipmentFilters = ({ categories = [], selectedCategory, onSelectCategory }) => {
  const defaultCats = ['All', 'Compute', 'Testing', 'Fabrication', 'Microscopy'];
  const list = categories.length > 0 ? categories : defaultCats;

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory && onSelectCategory(cat)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            selectedCategory === cat || (!selectedCategory && cat === 'All')
              ? 'bg-cyan-500 text-black font-semibold'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default EquipmentFilters;
