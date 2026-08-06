import {
  CalendarCheck,
  QrCode,
  BrainCircuit,
  BarChart3,
  Wrench,
  Bell,
} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";

const features = [
  {
    icon: CalendarCheck,
    title: "Smart Equipment Booking",
    desc: "Reserve laboratory equipment instantly with real-time availability.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Secure check-in and check-out using QR-based authentication.",
  },
  {
    icon: BrainCircuit,
    title: "AI Prediction",
    desc: "Predict equipment failures before they happen using AI.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    desc: "Monitor equipment utilization and generate insightful reports.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    desc: "Track faults and schedule preventive maintenance efficiently.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    desc: "Receive notifications for bookings, approvals, and maintenance.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 px-6" style={{ background: '#f5f7fa' }}>
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Why Choose SmartLab AI?"
          subtitle="Transforming laboratory management with AI-powered automation and smart booking."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <GlassCard
                key={index}
                className={`group hover:border-[#cc6926]/60 hover:shadow-2xl transition-all duration-500`}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: '#cc6926' }}>
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-2xl font-bold" style={{ color: '#0b2545' }}>
                  {feature.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-7">
                  {feature.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;