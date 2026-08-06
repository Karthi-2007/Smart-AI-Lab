import {
  BrainCircuit,
  CalendarCheck,
  Wrench,
  ShieldCheck,
} from "lucide-react";

const features = [
  "Smart Equipment Booking",
  "AI Predictive Maintenance",
  "QR Equipment Access",
  "Role Based Access Control",
];

const AuthSideBanner = () => {
  return (
    <div className="h-full bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white p-12 flex flex-col justify-between">

      <div>

        <h1 className="text-5xl font-extrabold">

          SmartLab AI

        </h1>

        <p className="mt-6 text-lg leading-8 text-orange-100">

          Laboratory Equipment Booking &
          Predictive Maintenance Platform

        </p>

      </div>

      <div className="space-y-6">

        {features.map((item, index) => (

          <div
            key={index}
            className="flex items-center gap-4"
          >

            <div className="bg-white/20 p-3 rounded-xl">

              {index === 0 && <CalendarCheck />}

              {index === 1 && <BrainCircuit />}

              {index === 2 && <ShieldCheck />}

              {index === 3 && <Wrench />}

            </div>

            <p className="text-lg">

              {item}

            </p>

          </div>

        ))}

      </div>

      <div>

        <h3 className="text-2xl font-bold">

          Karpagam College of Engineering

        </h3>

        <p className="text-orange-100 mt-2">

          Industry 4.0 Smart Laboratory Platform

        </p>

      </div>

    </div>
  );
};

export default AuthSideBanner;