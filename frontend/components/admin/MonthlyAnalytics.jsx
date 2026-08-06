import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    month: "Jan",
    bookings: 80,
    maintenance: 12,
    faults: 8,
  },
  {
    month: "Feb",
    bookings: 92,
    maintenance: 10,
    faults: 6,
  },
  {
    month: "Mar",
    bookings: 105,
    maintenance: 15,
    faults: 9,
  },
  {
    month: "Apr",
    bookings: 120,
    maintenance: 11,
    faults: 5,
  },
  {
    month: "May",
    bookings: 138,
    maintenance: 17,
    faults: 11,
  },
  {
    month: "Jun",
    bookings: 155,
    maintenance: 14,
    faults: 7,
  },
];

const MonthlyAnalytics = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-xl font-bold mb-6">

        Monthly Analytics

      </h2>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <LineChart data={data}>

          <CartesianGrid
            stroke="#334155"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            stroke="#94A3B8"
          />

          <YAxis
            stroke="#94A3B8"
          />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#F97316"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="maintenance"
            stroke="#3B82F6"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="faults"
            stroke="#EF4444"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default MonthlyAnalytics;