import React from "react";
import { BarChart3 } from "lucide-react";

const UsageChart = ({ equipments = [] }) => {
  const chartData = equipments.length > 0
    ? equipments.slice(0, 6).map((e) => ({
        name: e.name ? (e.name.length > 12 ? e.name.slice(0, 10) + '...' : e.name) : 'Device',
        value: e.quantity ? Math.min(100, e.quantity * 25) : 75
      }))
    : [
        { name: "3D Printer Pro", value: 85 },
        { name: "Oscilloscope", value: 70 },
        { name: "AI Server Rig", value: 95 },
        { name: "Microscope", value: 60 },
        { name: "Logic Analyzer", value: 50 },
        { name: "VR Headset", value: 40 }
      ];

  const max = 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-orange-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Equipment Usage Distribution</h2>
        </div>
        <span className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full border border-orange-500/20 font-medium">Real-time DB Load</span>
      </div>

      <div className="flex items-end justify-between h-64 gap-4 pt-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <div className="w-full bg-slate-800 rounded-xl h-48 flex items-end overflow-hidden p-1">
              <div
                className="w-full bg-orange-500 rounded-lg transition-all duration-500 hover:bg-orange-400"
                style={{
                  height: `${(item.value / max) * 100}%`,
                }}
              />
            </div>
            <span className="mt-3 text-xs font-medium text-slate-400 text-center truncate w-full">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageChart;