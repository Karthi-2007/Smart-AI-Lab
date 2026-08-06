import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { lab: "AI Lab", usage: 92 },
  { lab: "IoT Lab", usage: 81 },
  { lab: "Networking", usage: 74 },
  { lab: "VLSI", usage: 61 },
  { lab: "Mechanical", usage: 47 },
];

const EquipmentUsageChart = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">

      <h2 className="text-xl font-bold mb-6">

        Equipment Usage

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="lab" stroke="#94A3B8" />

          <YAxis stroke="#94A3B8" />

          <Tooltip />

          <Bar
            dataKey="usage"
            fill="#F97316"
            radius={[8,8,0,0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
};

export default EquipmentUsageChart;