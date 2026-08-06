import React from "react";

const DashboardCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-orange-500 transition-all duration-300 hover:-translate-y-1">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">

            {title}

          </p>

          <h2 className="text-4xl font-bold mt-3">

            {value}

          </h2>

        </div>

        <div className="bg-orange-500/20 p-4 rounded-xl">

          <Icon
            size={32}
            className="text-orange-500"
          />

        </div>

      </div>

    </div>
  );
};

export default DashboardCard;