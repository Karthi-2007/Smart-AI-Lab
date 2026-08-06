import { ArrowRight, Cpu, CalendarCheck, Wrench } from "lucide-react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Badge from "../ui/Badge";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden py-24 lg:py-32">

      {/* Background Glow */}

      <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-400/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-40 lg:pt-32 lg:pb-48">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}

          <div>

            <Badge>
              AI Powered Laboratory Management
            </Badge>

            <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight">

              Smart

              <span className="text-orange-500">
                Lab
              </span>

              <br />

              Equipment Booking

            </h1>

            <p className="mt-8 text-slate-400 text-lg leading-8">

              Book laboratory equipment, monitor usage,
              predict maintenance, and improve laboratory
              efficiency using Artificial Intelligence.

            </p>

            <p className="mt-5 text-orange-400 font-medium">

              Developed for Karpagam College of Engineering

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <PrimaryButton>
                <a href="#departments"
                >Explore Labs</a>
              </PrimaryButton>

              <SecondaryButton>
              <Link to="/login" >
                Login
              
                <ArrowRight size={18} className="inline ml-2" />
                </Link>
              </SecondaryButton>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl">

              <div className="grid gap-6">

                {/* Card */}

                <div className="flex items-center gap-5 bg-slate-900 rounded-xl p-5">

                  <div className="bg-orange-500 p-4 rounded-xl">

                    <CalendarCheck />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">

                      Smart Booking

                    </h3>

                    <p className="text-slate-400">

                      Reserve equipment instantly.

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-5 bg-slate-900 rounded-xl p-5">

                  <div className="bg-orange-500 p-4 rounded-xl">

                    <Cpu />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">

                      AI Prediction

                    </h3>

                    <p className="text-slate-400">

                      Predict equipment failures.

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-5 bg-slate-900 rounded-xl p-5">

                  <div className="bg-orange-500 p-4 rounded-xl">

                    <Wrench />

                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">

                      Maintenance

                    </h3>

                    <p className="text-slate-400">

                      Prevent unexpected downtime.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;