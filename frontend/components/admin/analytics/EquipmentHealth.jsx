import React from "react";
import { Cpu } from "lucide-react";

const EquipmentHealth = ({ equipments = [], faults = [] }) => {
  const healthList = equipments.length > 0
    ? equipments.slice(0, 5).map(eq => {
        const isFaulty = faults.some(f => (f.equipment?.id === eq.equipmentId || f.equipmentId === eq.equipmentId));
        return {
          name: eq.name,
          health: isFaulty ? 45 : (eq.status === 'Available' ? 96 : 82)
        };
      })
    : [
        { name: "AI Rig GPU Cluster", health: 98 },
        { name: "Precision 3D Printer", health: 91 },
        { name: "Digital Oscilloscope", health: 85 },
        { name: "Logic Analyzer", health: 74 }
      ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Cpu className="text-blue-500 w-6 h-6" />
          <h2 className="text-xl font-bold text-white">Equipment Health Index</h2>
        </div>
        <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">Diagnostic Model</span>
      </div>

      <div className="space-y-4">
        {healthList.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between mb-1.5 text-sm">
              <span className="text-slate-300 font-medium">{item.name}</span>
              <span className={`font-semibold ${item.health >= 90 ? 'text-green-400' : item.health >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                {item.health}%
              </span>
            </div>

            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  item.health >= 90
                    ? "bg-green-500"
                    : item.health >= 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${item.health}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentHealth;