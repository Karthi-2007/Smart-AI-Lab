import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No Data Available', description = 'There are no items to display at this time.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
      <div className="p-4 bg-slate-800/50 rounded-full mb-3 text-slate-400">
        <Inbox className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;
