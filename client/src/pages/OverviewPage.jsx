import React from 'react'
import KPICards from '../components/KPICards'
import ComparisonChart from '../components/ComparisonChart'
import ApprovedRejectedCharts from '../components/ApprovedRejectedCharts'

export default function OverviewPage({ tenants, selectedTenant, setSelectedTenant, filteredProperties, cityStats, credentials }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <section className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Tenant:</div>
          <div>
            <select
              value={selectedTenant}
              onChange={e => setSelectedTenant(e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1 text-sm"
            >
              {tenants.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <KPICards data={filteredProperties} />
      </section>

      <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <ComparisonChart cityStats={cityStats} activeChart="collection" />
        <ApprovedRejectedCharts cityStats={cityStats} />
      </section>
    </div>
  )
}
