import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';

const AIInsights = () => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Sparkles className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white">AI Predictive Insights</h2>
      </div>
      <div className="space-y-3">
        <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl flex items-start space-x-3">
          <TrendingUp className="w-4 h-4 text-cyan-400 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-cyan-300">Peak Demand Predicted</p>
            <p className="text-xs text-slate-400">GPU Server Alpha demand expected to increase by 45% next Friday before project submission deadline.</p>
          </div>
        </div>
        <div className="p-3.5 bg-amber-950/30 border border-amber-500/20 rounded-xl flex items-start space-x-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-300">Proactive Maintenance Warning</p>
            <p className="text-xs text-slate-400">Logic Analyzer #3 thermal metrics suggest fan recalibration required within 7 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
