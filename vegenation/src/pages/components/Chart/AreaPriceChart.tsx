/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data: { name: string; harga: number }[];
}

const AreaPriceChart: React.FC<ChartProps> = ({ data }) => {
  // Fungsi Format Angka
  const formatHarga = (value: number) =>
    value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorHarga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={formatHarga} />
        <Tooltip formatter={(value: any) => formatHarga(value)} />
        <Area type="monotone" dataKey="harga" stroke="#4caf50" fillOpacity={1} fill="url(#colorHarga)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaPriceChart;
