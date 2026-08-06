import { BrainCircuit } from "lucide-react";

const AIPredictionCard = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-full">

      <div className="flex items-center gap-3 mb-5">

        <BrainCircuit className="text-orange-500" />

        <h2 className="text-xl font-bold">

          AI Prediction

        </h2>

      </div>

      <div className="space-y-5">

        <div>

          <p className="text-slate-400 text-sm">

            Equipment

          </p>

          <h3 className="text-xl font-semibold mt-1">

            Digital Oscilloscope

          </h3>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Health Score

          </p>

          <div className="w-full bg-slate-800 rounded-full h-3 mt-2">

            <div className="bg-orange-500 h-3 rounded-full w-2/3"></div>

          </div>

          <p className="mt-2 text-orange-400 font-semibold">

            68%

          </p>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Prediction

          </p>

          <p className="text-red-400 font-semibold mt-2">

            Maintenance Recommended within 7 Days

          </p>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Confidence

          </p>

          <p className="text-green-400 font-semibold">

            96.4%

          </p>

        </div>

      </div>

    </div>
  );
};

export default AIPredictionCard;