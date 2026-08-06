import React, { useState, useEffect } from "react";
import { Boxes, Building2, Users, ShieldCheck } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import api from "../../services/api";

const Statistics = () => {
  const [stats, setStats] = useState({
    equipments: "120+",
    labs: "12",
    students: "850+",
    availability: "98%"
  });

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const [eqRes, labRes, userRes] = await Promise.all([
          api.get("/api/business/equipments").catch(() => ({ data: [] })),
          api.get("/api/business/laboratories").catch(() => ({ data: [] })),
          api.get("/api/business/students").catch(() => ({ data: [] }))
        ]);

        const eqList = Array.isArray(eqRes?.data || eqRes) ? (eqRes?.data || eqRes) : [];
        const labList = Array.isArray(labRes?.data || labRes) ? (labRes?.data || labRes) : [];
        const studentList = Array.isArray(userRes?.data || userRes) ? (userRes?.data || userRes) : [];

        const activeEq = eqList.filter(e => e.status !== "Faulty").length;
        const availRate = eqList.length ? Math.round((activeEq / eqList.length) * 100) + "%" : "98%";

        setStats({
          equipments: eqList.length ? `${eqList.length}+` : "120+",
          labs: labList.length ? `${labList.length}` : "12",
          students: studentList.length ? `${studentList.length}+` : "850+",
          availability: availRate
        });
      } catch (err) {
        console.warn("Using default stats", err);
      }
    };
    fetchLiveStats();
  }, []);

  const statisticsData = [
    {
      icon: Boxes,
      value: stats.equipments,
      title: "Laboratory Equipment",
      description: "Smart IoT & high-precision instruments across engineering labs.",
    },
    {
      icon: Building2,
      value: stats.labs,
      title: "Engineering Laboratories",
      description: "State-of-the-art research centres for practical learning.",
    },
    {
      icon: Users,
      value: stats.students,
      title: "Active Students & Faculty",
      description: "Engineers using SmartLab AI for research and practicals.",
    },
    {
      icon: ShieldCheck,
      value: stats.availability,
      title: "System Availability Rate",
      description: "Real-time AI diagnostics maintaining optimal hardware uptime.",
    },
  ];

  return (
    <section
      className="py-16 sm:py-20 px-6 relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/kce/about-us1.webp'), url('https://www.kce.ac.in/images/kce/home/about-us1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/88" />
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          title="SmartLab in Numbers"
          subtitle="Real-time telemetry and centralized laboratory management metrics powered by SmartLab AI."
          dark={true}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statisticsData.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard
                key={index}
                className="text-center hover:-translate-y-2 transition-all duration-300 border-slate-800 hover:border-orange-500/50 p-6 sm:p-8"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/10">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <h2 className="mt-6 text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  {item.value}
                </h2>

                <h3 className="mt-3 text-lg font-bold" style={{ color: '#0b2545' }}>
                  {item.title}
                </h3>

                <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Statistics;