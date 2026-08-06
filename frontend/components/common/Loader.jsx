import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <span className="text-sm font-medium text-slate-400">{text}</span>
    </div>
  );
};

export default Loader;
