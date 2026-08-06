import {
  LogIn,
  Search,
  CalendarCheck,
  QrCode,
  Wrench,
  BrainCircuit,
} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";

const workflow = [
  {
    icon: LogIn,
    title: "Login",
    desc: "Students, Faculty and Admin securely login to SmartLab AI.",
  },
  {
    icon: Search,
    title: "Find Equipment",
    desc: "Search equipment by department, category, or laboratory.",
  },
  {
    icon: CalendarCheck,
    title: "Book Equipment",
    desc: "Reserve available equipment instantly using Smart Booking.",
  },
  {
    icon: QrCode,
    title: "QR Verification",
    desc: "Scan QR code while collecting and returning equipment.",
  },
  {
    icon: Wrench,
    title: "Report Fault",
    desc: "Report equipment issues with photos and descriptions.",
  },
  {
    icon: BrainCircuit,
    title: "AI Prediction",
    desc: "AI predicts maintenance based on usage and fault history.",
  },
];

const Workflow = () => {
  return (
    <section className="py-16 px-6" style={{ background: '#0b2545' }}>
      <div className="max-w-7xl mx-auto">

        <SectionTitle
          title="How SmartLab AI Works"
          subtitle="A simple and intelligent workflow that automates laboratory equipment management."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {workflow.map((step, index) => {

            const Icon = step.icon;

            return (

              <GlassCard
                key={index}
                className="relative hover:border-orange-500 transition-all duration-500"
              >

                {/* Step Number */}

                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-lg">

                  {index + 1}

                </div>

                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#cc6926' }}>

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-2xl font-bold">

                  {step.title}

                </h3>

                <p className="mt-4 text-slate-400 leading-7">

                  {step.desc}

                </p>

              </GlassCard>

            );

          })}

        </div>

      </div>
    </section>
  );
};

export default Workflow;