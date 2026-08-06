import React from "react";
import { Cpu, Zap, AlertTriangle, ShieldCheck } from "lucide-react";

const PredictionCards = ({ liveStats }) => {
  const cards = [
    {
      title: "Predictive Health Score",
      metric: `${liveStats?.healthyDevicesPct || 92}% Optimal`,
      desc: "AI model detects low degradation risk across hardware components over the next 30 days.",
      icon: ShieldCheck,
      color: "text-green-400 border-green-500/20 bg-green-500/10"
    },
    {
      title: "Peak Demand Forecast",
      metric: "High Utilization (Thu/Fri)",
      desc: "Expected +35% surge in lab equipment requests during upcoming examination week.",
      icon: Zap,
      color: "text-orange-400 border-orange-500/20 bg-orange-500/10"
    },
    {
      title: "Anomaly Prevention",
      metric: "0 Critical Failures Detected",
      desc: "Sensor telemetry telemetry models report normal operating temperatures for active rigs.",
      icon: Cpu,
      color: "text-blue-400 border-blue-500/20 bg-blue-500/10"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className={`p-6 border rounded-2xl ${card.color} transition hover:scale-[1.01]`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">{card.title}</span>
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{card.metric}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionCards;