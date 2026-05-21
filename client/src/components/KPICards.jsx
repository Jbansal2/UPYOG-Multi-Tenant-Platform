import React, { useMemo } from 'react';

function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export default function KPICards({ data }) {
  const stats = useMemo(() => {
    const total = Array.isArray(data) ? data.length : 0;
    const approved = (data || []).filter(r => r.status === 'Approved').length;
    const rejected = (data || []).filter(r => r.status === 'Rejected').length;
    const collection = (data || []).reduce((s, r) => s + Number(r.collection_inr || 0), 0);
    return { total, approved, rejected, collection };
  }, [data]);

  const cards = [
    {
      label: 'Total Properties Registered',
      value: stats.total.toLocaleString('en-IN'),
      sub: 'Count of all records',
      accent: 'black',
    },
    {
      label: 'Total Properties Approved',
      value: stats.approved.toLocaleString('en-IN'),
      sub: 'Approved',
      accent: 'black',
    },
    {
      label: 'Total Properties Rejected',
      value: stats.rejected.toLocaleString('en-IN'),
      sub: 'Rejected',
      accent: 'black',
    },
    {
      label: 'Total Collection (Rs.)',
      value: formatINR(stats.collection),
      sub: 'Sum of collection_inr',
      accent: 'black',
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
          style={{
            background: `linear-gradient(180deg, ${card.accentBg} 0%, #ffffff 28%)`,
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-lg leading-none">{card.icon}</span>
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">
              {card.label}
            </span>
          </div>
          <div className="mb-1 text-[30px] font-semibold leading-none text-slate-900 tabular-nums sm:text-[32px]" style={{ color: card.accent }}>
            {card.value}
          </div>
          <div className="text-[13px] text-slate-500">{card.sub}</div>
          <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl" style={{ background: card.accent }} />
        </div>
      ))}
    </div>
  );
}
