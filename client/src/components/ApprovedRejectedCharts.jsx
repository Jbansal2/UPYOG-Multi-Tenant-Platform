import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const COLORS = { approved: '#0f6e56', rejected: '#d85a30' };

function SimpleTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black text-white rounded-md p-2 text-sm shadow-lg">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.fill }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
}

export default function ApprovedRejectedCharts({ cityStats }) {
  const data = (cityStats || []).map(c => ({
    city: c.city.slice(0,3).toUpperCase(),
    fullCity: c.city,
    approved: c.approved,
    rejected: c.rejected,
  }));

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="text-sm font-semibold mb-3">Approved Properties (per city)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
            <XAxis dataKey="city" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<SimpleTooltip />} />
            <Bar dataKey="approved" name="Approved" fill={COLORS.approved} radius={[6,6,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={COLORS.approved} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="text-sm font-semibold mb-3">Rejected Properties (per city)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f3f3" />
            <XAxis dataKey="city" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<SimpleTooltip />} />
            <Bar dataKey="rejected" name="Rejected" fill={COLORS.rejected} radius={[6,6,0,0]}>
              {data.map((d, i) => <Cell key={i} fill={COLORS.rejected} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
