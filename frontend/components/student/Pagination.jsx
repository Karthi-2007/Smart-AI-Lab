import React from 'react';

const Pagination = ({ currentPage = 1, totalPages = 5, onPageChange }) => {
  return (
    <div className="flex items-center justify-center space-x-2 pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 disabled:opacity-50 hover:text-white"
      >
        Previous
      </button>
      <span className="text-xs text-slate-400">
        Page <span className="text-white font-medium">{currentPage}</span> of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 disabled:opacity-50 hover:text-white"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
