import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dummyData = [
  { name: 'Available', value: 65, color: '#10b981' },
  { name: 'Booked', value: 25, color: '#06b6d4' },
  { name: 'Maintenance', value: 10, color: '#f59e0b' },
];

const PieChart = ({ data = dummyData }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
          <Legend formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
