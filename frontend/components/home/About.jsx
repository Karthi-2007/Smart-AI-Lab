import {
  BrainCircuit,
  CalendarCheck,
  ShieldCheck,
  QrCode,
  BarChart3,
  Wrench,
} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";

const features = [
  {
    icon: CalendarCheck,
    title: "Smart Booking",
    description:
      "Reserve laboratory equipment instantly with real-time availability and scheduling.",
  },
  {
    icon: BrainCircuit,
    title: "AI Prediction",
    description:
      "Predict maintenance requirements using equipment usage patterns and fault history.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    description:
      "Secure equipment check-in and check-out using QR code authentication.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description:
      "Visualize equipment utilization, booking trends, and laboratory performance.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    description:
      "Track faults, schedule preventive maintenance, and reduce equipment downtime.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Role-based access for Students, Faculty, Lab Staff, and Administrators.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-16 px-6" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">

        <SectionTitle
          title="About SmartLab AI"
          subtitle="A next-generation laboratory equipment booking and predictive maintenance platform designed for Karpagam College of Engineering."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <h2 className="text-4xl font-bold leading-tight" style={{ color: '#0b2545' }}>

              Revolutionizing Laboratory
              <span style={{ color: '#cc6926' }}>
                {" "}Equipment Management
              </span>

            </h2>

            <p className="mt-8 text-slate-600 leading-8 text-lg">

              SmartLab AI is an intelligent laboratory management platform
              developed to simplify equipment booking, monitor laboratory
              usage, and predict maintenance before failures occur.

            </p>

            <p className="mt-6 text-slate-600 leading-8 text-lg">

              Students can reserve equipment online, faculty can monitor
              laboratory utilization, and administrators can manage assets
              efficiently using AI-powered analytics and predictive
              maintenance.

            </p>

            <div className="grid grid-cols-2 gap-6 mt-10">

              <div className="rounded-2xl p-6 border" style={{ background: '#f5f7fa', borderColor: '#e2e8f0' }}>

                <h3 className="text-4xl font-bold" style={{ color: '#cc6926' }}>

                  450+

                </h3>

                <p className="mt-2 text-slate-400">

                  Laboratory Equipment

                </p>

              </div>

              <div className="rounded-2xl p-6 border" style={{ background: '#f5f7fa', borderColor: '#e2e8f0' }}>

                <h3 className="text-4xl font-bold" style={{ color: '#cc6926' }}>

                  18

                </h3>

                <p className="mt-2 text-slate-400">

                  Engineering Labs

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="grid sm:grid-cols-2 gap-6">

            {features.map((item, index) => {

              const Icon = item.icon;

              return (

                <GlassCard
                  key={index}
                  className="hover:border-orange-500 hover:-translate-y-2 transition-all duration-500"
                >

                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: '#cc6926' }}>

                    <Icon size={28} />

                  </div>

                  <h3 className="mt-5 text-xl font-bold" style={{ color: '#0b2545' }}>

                    {item.title}

                  </h3>

                  <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>

                </GlassCard>

              );

            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;