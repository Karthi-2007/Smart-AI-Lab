import React from "react";
import { BrainCircuit, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

const AIRecommendations = ({ faults = [], bookings = [] }) => {
  const recommendations = [
    {
      title: "Schedule Preventive Maintenance",
      description: faults.length > 0 
        ? `${faults.length} active fault reports require technical inspection before weekend labs.`
        : "Oscilloscope #12 exhibits high utilization. Scheduled maintenance is recommended.",
      icon: AlertTriangle,
      color: "text-red-400 border-red-500/20 bg-red-500/10",
    },
    {
      title: "Optimize Lab Scheduling",
      description: bookings.length > 0 
        ? `Demand peak detected (${bookings.length} active bookings). Consider opening Artificial Intelligence Lab during evening hours.`
        : "AI predicts heavy bookings on Thursday. Opening an additional lab room is recommended.",
      icon: BrainCircuit,
      color: "text-purple-400 border-purple-500/20 bg-purple-500/10",
    },
    {
      title: "Equipment Calibration Success",
      description: "94% of all laboratory instruments and IoT testbeds passed auto-diagnostic health checks.",
      icon: CheckCircle,
      color: "text-green-400 border-green-500/20 bg-green-500/10",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="text-purple-400 w-6 h-6" />
          <h2 className="text-xl font-bold text-white">AI Prescriptive Action Recommendations</h2>
        </div>
        <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20 font-medium">Smart Advisory</span>
      </div>

      <div className="space-y-4">
        {recommendations.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex gap-4 border rounded-xl p-4 transition hover:bg-slate-800/40 ${item.color}`}
            >
              <Icon className={`${item.color.split(' ')[0]} w-6 h-6 shrink-0 mt-0.5`} />
              <div>
                <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendations;