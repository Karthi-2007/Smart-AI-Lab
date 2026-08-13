import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  UserCog,
  ShieldCheck,
  CalendarCheck,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import api from "../../services/api";

const DashboardPreview = () => {
  const [metrics, setMetrics] = useState({
    equipments: "120+",
    activeBookings: "42",
    faultReports: "3"
  });

  useEffect(() => {
    const fetchLiveMetrics = async () => {
      try {
        const res = await api.get("/api/business/dashboard/public/statistics");
        const data = res?.data?.data || res?.data || {};

        setMetrics({
          equipments: data.equipmentsCount ? `${data.equipmentsCount}+` : "120+",
          activeBookings: data.activeBookingsCount !== undefined ? `${data.activeBookingsCount}` : "42",
          faultReports: data.openFaultsCount !== undefined ? `${data.openFaultsCount}` : "3"
        });
      } catch (err) {
        console.warn("Using default preview metrics", err);
      }
    };
    fetchLiveMetrics();
  }, []);

  const dashboards = [
    {
      icon: GraduationCap,
      title: "Student Portal",
      rolePath: "/login",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      items: [
        "Instant Equipment Reservation",
        "Personal Booking History",
        "Fault Reporting & Status",
        "Notification Broadcasts"
      ],
    },
    {
      icon: UserCog,
      title: "Faculty Control",
      rolePath: "/login",
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      items: [
        "1-Click Booking Approvals",
        "Lab Equipment Management",
        "Student Practice Monitoring",
        "Department Activity Reports"
      ],
    },
    {
      icon: ShieldCheck,
      title: "Admin Command",
      rolePath: "/login",
      color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      items: [
        "Full Hardware Inventory CRUD",
        "AI Predictive Telemetry",
        "System CSV Reports & SQL Dumps",
        "Global System Settings & 2FA"
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-6 relative" style={{ background: '#f5f7fa' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Role-Based Intelligent Dashboards"
          subtitle="Tailored workspaces designed for Students, Faculty, and Administrators with real-time sync."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            return (
              <GlassCard
                key={index}
                className="hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl border ${dashboard.color.replace('text-blue-400', 'text-blue-600').replace('text-emerald-400', 'text-emerald-600').replace('text-orange-400', 'text-orange-600')} shrink-0`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <Link
                      to={dashboard.rolePath}
                      className="text-xs font-bold flex items-center gap-1 transition"
                      style={{ color: '#cc6926' }}
                    >
                      <span>Access Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <h3 className="text-2xl font-extrabold mb-6" style={{ color: '#0b2545' }}>
                    {dashboard.title}
                  </h3>

                  <div className="space-y-3">
                    {dashboard.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-700 font-medium shadow-sm"
                      >
                        <CheckCircle size={16} className="text-orange-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600 font-semibold">
                    <span>Monitored Equipment:</span>
                    <span className="font-bold text-orange-600">{metrics.equipments}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 font-semibold">
                    <span>Active Reservations:</span>
                    <span className="font-bold text-emerald-600">{metrics.activeBookings}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 font-semibold">
                    <span>Open Fault Tickets:</span>
                    <span className="font-bold text-rose-600">{metrics.faultReports}</span>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;