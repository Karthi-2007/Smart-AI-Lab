import React, { useState, useEffect } from "react";
import {
  Monitor, Cpu, Zap, Cog, Building2, Brain, Network, Database, FlaskConical
} from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import api from "../../services/api";

const iconMap = {
  "Computer Science": Monitor,
  "Artificial Intelligence": Brain,
  "Electronics": Cpu,
  "Electrical": Zap,
  "Mechanical": Cog,
  "Civil": Building2,
  "Information Technology": Network
};

const defaultLabs = [
  { name: "Computer Science & Engg", lab: "Programming & Software Lab", count: "85 Equipment", icon: Monitor },
  { name: "AI & Data Science", lab: "AI & Machine Learning Lab", count: "60 Equipment", icon: Brain },
  { name: "Electronics & Communication", lab: "Embedded & VLSI Systems Lab", count: "70 Equipment", icon: Cpu },
  { name: "Electrical & Electronics", lab: "Power Electronics & Drives Lab", count: "55 Equipment", icon: Zap },
  { name: "Mechanical Engineering", lab: "CAD/CAM & Automation Lab", count: "90 Equipment", icon: Cog },
  { name: "Civil Engineering", lab: "Geotechnical & Surveying Lab", count: "45 Equipment", icon: Building2 },
  { name: "Information Technology", lab: "Cloud Computing & Cyber Security", count: "65 Equipment", icon: Network },
  { name: "IoT & Research Centre", lab: "Robotics & Innovation Hub", count: "40 Equipment", icon: Database }
];

const Departments = () => {
  const [labsList, setLabsList] = useState(defaultLabs);

  useEffect(() => {
    const fetchLiveLabs = async () => {
      try {
        const res = await api.get("/api/business/laboratories").catch(() => ({ data: [] }));
        const data = Array.isArray(res?.data || res) ? (res?.data || res) : [];
        if (data.length > 0) {
          const mapped = data.map((l, i) => {
            const deptName = typeof l.department === 'object' ? l.department?.name : (l.department || "Department");
            let IconComponent = FlaskConical;
            Object.keys(iconMap).forEach(key => {
              if (deptName.toLowerCase().includes(key.toLowerCase())) {
                IconComponent = iconMap[key];
              }
            });
            return {
              name: deptName,
              lab: l.labName || l.name || "Engineering Laboratory",
              count: `Capacity: ${l.capacity || 30} Seats`,
              icon: IconComponent
            };
          });
          setLabsList(mapped);
        }
      } catch (e) {
        console.warn("Could not fetch laboratories", e);
      }
    };
    fetchLiveLabs();
  }, []);

  return (
    <section id="departments" className="bg-slate-950 py-20 sm:py-28 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Explore Our Laboratories"
          subtitle="Modern engineering laboratories equipped with advanced IoT tools and high-performance computing clusters."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {labsList.map((dept, index) => {
            const Icon = dept.icon || FlaskConical;
            return (
              <GlassCard
                key={index}
                className="group hover:border-orange-500/60 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between p-6 sm:p-7"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {dept.name}
                  </h3>

                  <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {dept.lab}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    {dept.count}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Departments;