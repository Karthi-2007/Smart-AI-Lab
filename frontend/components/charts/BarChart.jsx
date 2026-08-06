import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyData = [
  { name: 'Mon', value: 40 },
  { name: 'Tue', value: 70 },
  { name: 'Wed', value: 55 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 65 },
];

const BarChart = ({ data = dummyData, dataKey = 'value', nameKey = 'name', color = '#38bdf8' }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey={nameKey} stroke="#64748b" tick={{ fontSize: 12 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
          <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
