import React from "react";
import { BrainCircuit, TrendingUp, Activity, ShieldCheck } from "lucide-react";

const AnalyticsStats = ({ liveStats }) => {
  const stats = [
    {
      title: "AI Predictions",
      value: `${liveStats?.aiPredictionAccuracy || 96.4}%`,
      icon: BrainCircuit,
      color: "bg-purple-500",
    },
    {
      title: "Equipment Usage",
      value: `${liveStats?.equipmentUsageRate || 84}%`,
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Live Monitored Devices",
      value: String(liveStats?.liveMonitoredDevices || 10),
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      title: "Healthy Devices",
      value: `${liveStats?.healthyDevicesPct || 92}%`,
      icon: ShieldCheck,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-slate-400 text-sm font-medium">{item.title}</p>
                <h2 className="text-3xl font-bold mt-2 text-white">{item.value}</h2>
              </div>
              <div
                className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <Icon size={26} className="text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsStats;