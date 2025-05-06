import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: { name: string; harga: number }[];
}

const PriceChart: React.FC<ChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis
        tickFormatter={(value: number) =>
          value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      />
      <Tooltip
        formatter={(value: number) =>
          value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      />
      <Line type="monotone" dataKey="harga" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

export default PriceChart;
