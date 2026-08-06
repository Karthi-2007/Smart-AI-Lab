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
        const [eqRes, bookRes, faultRes] = await Promise.all([
          api.get("/api/business/equipments").catch(() => ({ data: [] })),
          api.get("/api/business/bookings").catch(() => ({ data: [] })),
          api.get("/api/business/faults").catch(() => ({ data: [] }))
        ]);

        const eqList = Array.isArray(eqRes?.data || eqRes) ? (eqRes?.data || eqRes) : [];
        const bookList = Array.isArray(bookRes?.data || bookRes) ? (bookRes?.data || bookRes) : [];
        const faultList = Array.isArray(faultRes?.data || faultRes) ? (faultRes?.data || faultRes) : [];

        const pendingOrApproved = bookList.filter(b => b.status === "Approved" || b.status === "Pending").length;
        const activeFaults = faultList.filter(f => f.status !== "Resolved").length;

        setMetrics({
          equipments: eqList.length ? `${eqList.length}+` : "120+",
          activeBookings: bookList.length ? `${pendingOrApproved}` : "42",
          faultReports: faultList.length ? `${activeFaults}` : "3"
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
      rolePath: "/admin/login",
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
    <section className="bg-slate-900/80 py-20 sm:py-28 px-6 relative">
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
                    <div className={`p-4 rounded-2xl border ${dashboard.color} shrink-0`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <Link
                      to={dashboard.rolePath}
                      className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition"
                    >
                      <span>Access Portal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <h3 className="text-2xl font-extrabold text-white mb-6">
                    {dashboard.title}
                  </h3>

                  <div className="space-y-3">
                    {dashboard.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200"
                      >
                        <CheckCircle size={16} className="text-orange-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Monitored Equipment:</span>
                    <span className="font-bold text-orange-400">{metrics.equipments}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Active Reservations:</span>
                    <span className="font-bold text-emerald-400">{metrics.activeBookings}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-300">
                    <span>Open Fault Tickets:</span>
                    <span className="font-bold text-rose-400">{metrics.faultReports}</span>
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