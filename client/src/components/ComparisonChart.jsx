import React from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Cell,
} from 'recharts';
// Tailwind classes used instead of external CSS

const COLORS = {
  collection: '#0f6e56',
  approved:   '#0f6e56',
  rejected:   '#d85a30',
  pending:    '#ba7517',
  total:      '#185fa5',
};

function formatINR(v) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
}

const CustomTooltip = ({ active, payload, label, activeChart }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-black text-white rounded-md p-3 text-sm shadow-lg min-w-[160px]">
      <p className="font-semibold text-sm mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: {activeChart === 'collection'
            ? formatINR(p.value)
            : p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

export default function ComparisonChart({ cityStats, activeChart }) {
  const [active, setActive] = React.useState(activeChart || 'collection');

  React.useEffect(() => {
    if (activeChart) setActive(activeChart);
  }, [activeChart]);

  const sourceStats = cityStats || [];

  const data = (sourceStats || []).map(c => ({
    city: c.city.slice(0, 3).toUpperCase(),
    fullCity: c.city,
    collection: Math.round(c.collection),
    approved: c.approved,
    rejected: c.rejected,
    pending: c.pending,
    total: c.total,
  }));

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Comparison</div>
          <div className="flex items-center gap-2 ml-3">
            <button
              onClick={() => setActive('collection')}
              className={`px-2 py-1 text-sm rounded ${active === 'collection' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              Collection
            </button>
          </div>
        </div>
        <div />
      </div>
      {active === 'collection' && (
        <>
          <div className="text-sm text-black mb-3 flex gap-4 flex-wrap">
            <span style={{ color: COLORS.collection }}>■</span> Total collection per city
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efea" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#5a5a72' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => formatINR(v)} tick={{ fontSize: 11, fill: '#9494a8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<CustomTooltip activeChart="collection" />} />
              <Bar dataKey="collection" name="Collection" radius={[4,4,0,0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS.collection} fillOpacity={0.85 + (i % 3) * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* Approved/Rejected charts removed from this component — they are shown separately below the KPIs. */}

      {/* Only Collection chart is rendered here. Other charts (Approved/Rejected) are shown separately below KPIs. */}
    </div>
  );
}
