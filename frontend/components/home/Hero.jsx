import { ArrowRight, Cpu, CalendarCheck, Wrench, ChevronDown } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/kce/b1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-slate-950/80 to-slate-950 z-0" />

      {/* Orange glow orbs */}
      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px] z-0" />
      <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-orange-400/10 blur-[120px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <Badge>
              AI Powered Laboratory Management
            </Badge>

            <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg">
              Smart
              <span className="text-orange-500">Lab</span>
              <br />
              Equipment Booking
            </h1>

            <p className="mt-4 text-orange-400 font-semibold text-sm tracking-wider uppercase">
              🎓 Karpagam College of Engineering — NAAC 'A+' | TNEA Code: 2710
            </p>

            <p className="mt-6 text-slate-300 text-lg leading-8">
              Book laboratory equipment, monitor usage,
              predict maintenance, and improve laboratory
              efficiency using Artificial Intelligence.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <PrimaryButton>
                <a href="#departments">Explore Labs</a>
              </PrimaryButton>

              <SecondaryButton>
                <Link to="/login">
                  Login
                  <ArrowRight size={18} className="inline ml-2" />
                </Link>
              </SecondaryButton>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-700/60 p-8 shadow-2xl shadow-black/40">
              <div className="grid gap-5">

                <div className="flex items-center gap-5 bg-slate-950/80 rounded-xl p-5 border border-slate-800">
                  <div className="bg-orange-500 p-4 rounded-xl shrink-0">
                    <CalendarCheck />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Smart Booking</h3>
                    <p className="text-slate-400 text-sm">Reserve equipment instantly.</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 bg-slate-950/80 rounded-xl p-5 border border-slate-800">
                  <div className="bg-orange-500 p-4 rounded-xl shrink-0">
                    <Cpu />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI Prediction</h3>
                    <p className="text-slate-400 text-sm">Predict equipment failures.</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 bg-slate-950/80 rounded-xl p-5 border border-slate-800">
                  <div className="bg-orange-500 p-4 rounded-xl shrink-0">
                    <Wrench />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Maintenance</h3>
                    <p className="text-slate-400 text-sm">Prevent unexpected downtime.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </div>
    </section>
  );
};

export default Hero;