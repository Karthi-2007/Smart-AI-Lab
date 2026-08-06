import React from 'react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyData = [
  { name: 'Jan', usage: 30 },
  { name: 'Feb', usage: 45 },
  { name: 'Mar', usage: 60 },
  { name: 'Apr', usage: 80 },
  { name: 'May', usage: 75 },
];

const LineChart = ({ data = dummyData, dataKey = 'usage', nameKey = 'name', color = '#06b6d4' }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey={nameKey} stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
