import React, { useState, useEffect } from "react";
import { BrainCircuit, Activity, Wrench, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AIPreview = () => {
  const [equipmentHealthList, setEquipmentHealthList] = useState([
    { name: "Digital Storage Oscilloscope", health: 96, status: "Optimal", color: "text-green-400" },
    { name: "3D Rapid Prototyping Printer", health: 74, status: "Maintenance Soon", color: "text-amber-400" },
    { name: "CNC Milling Machine 5-Axis", health: 58, status: "Inspection Due", color: "text-red-400" }
  ]);

  const [aiRecommendation, setAiRecommendation] = useState(
    "3D Rapid Prototyping Printer has crossed 120 operational hours. Schedule preventive calibration within 5 business days to prevent extruder clogging."
  );

  useEffect(() => {
    const fetchLiveHealth = async () => {
      try {
        const res = await api.get("/api/business/dashboard/public/telemetry");
        const data = res?.data?.data || res?.data || {};

        if (data.telemetryList) {
          setEquipmentHealthList(data.telemetryList);
        }
        if (data.recommendation) {
          setAiRecommendation(data.recommendation);
        }
      } catch (err) {
        console.warn("Using default AI preview telemetry", err);
      }
    };
    fetchLiveHealth();
  }, []);

  return (
    <section className="py-16 sm:py-24 px-6 relative overflow-hidden" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="AI Predictive Maintenance Engine"
          subtitle="Machine learning neural models continuously analyze equipment usage cycles, temperature sensors, and historical fault reports."
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/10">
                <BrainCircuit size={34} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: '#0b2545' }}>
                  Real-Time AI Telemetry
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Automated anomaly detection across all laboratory hardware.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <ShieldCheck className="text-green-600 shrink-0" size={22} />
                <p className="text-sm text-slate-700 font-medium">Predicts equipment breakdowns up to 14 days before failure.</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <Activity className="text-orange-500 shrink-0" size={22} />
                <p className="text-sm text-slate-700 font-medium">Continuous usage tracking & duty cycle calculation.</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <TrendingUp className="text-blue-600 shrink-0" size={22} />
                <p className="text-sm text-slate-700 font-medium">Maximizes lab ROI and extends hardware operational lifespan.</p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                <Wrench className="text-amber-600 shrink-0" size={22} />
                <p className="text-sm text-slate-700 font-medium">Auto-schedules maintenance tasks for lab technicians.</p>
              </div>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl transition shadow-lg text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Admin AI Analytics</span>
            </Link>
          </div>

          {/* RIGHT */}
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 border-b pb-4 border-slate-100">
              <h3 className="text-xl font-bold" style={{ color: '#0b2545' }}>Live Hardware Health Index</h3>
              <span className="text-xs font-mono bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1 rounded-full">
                Active Telemetry
              </span>
            </div>

            <div className="space-y-4">
              {equipmentHealthList.map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{item.name}</h4>
                    <span className={`text-xs font-bold ${item.color.replace('text-green-400', 'text-green-600').replace('text-amber-400', 'text-amber-600').replace('text-red-400', 'text-red-600')}`}>{item.status}</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.health}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.health > 80 ? 'bg-green-500' : item.health > 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 font-mono">
                    <span>Health Score</span>
                    <span>{item.health} / 100</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-orange-500/5 rounded-2xl p-5 border border-orange-500/20">
              <h4 className="font-bold text-orange-600 text-sm flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                Prescriptive AI Alert
              </h4>
              <p className="mt-2 text-slate-700 text-xs leading-relaxed font-medium">{aiRecommendation}</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default AIPreview;