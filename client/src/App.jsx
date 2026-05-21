import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import './App.css'
import KPICards from './components/KPICards'
import ComparisonChart from './components/ComparisonChart'
import ApprovedRejectedCharts from './components/ApprovedRejectedCharts'
import ChatAssistant from './components/ChatAssistant'
import ChatPage from './pages/ChatPage'
import OverviewPage from './pages/OverviewPage'
import SettingsPage from './pages/SettingsPage'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function computeCityStats(props) {
  const map = new Map()
  props.forEach(p => {
    const city = p.tenant || p.city || 'Unknown'
    const entry = map.get(city) || { city, collection: 0, approved: 0, rejected: 0, pending: 0, total: 0 }
    entry.collection += Number(p.collection_inr || 0)
    entry.total += 1
    if (p.status === 'Approved') entry.approved += 1
    if (p.status === 'Rejected') entry.rejected += 1
    if (p.status === 'Pending') entry.pending += 1
    map.set(city, entry)
  })
  return Array.from(map.values())
}

function buildDataSummary(props) {
  const total = props.length
  const collections = props.reduce((s, p) => s + Number(p.collection_inr || 0), 0)
  return `Records: ${total}, Total collection: ₹${Math.round(collections).toLocaleString('en-IN')}`
}

function buildDetailedSummary(props) {
  const map = new Map()
  props.forEach(p => {
    const city = p.tenant || p.city || 'Unknown'
    const entry = map.get(city) || { city, collection: 0, approved: 0, rejected: 0, pending: 0, total: 0 }
    entry.collection += Number(p.collection_inr || 0)
    entry.total += 1
    if (p.status === 'Approved') entry.approved += 1
    if (p.status === 'Rejected') entry.rejected += 1
    if (p.status === 'Pending') entry.pending += 1
    map.set(city, entry)
  })
  const rows = Array.from(map.values()).sort((a,b)=>b.collection-a.collection)
  const lines = rows.map(r => `${r.city}: ${r.total} properties, Collection ₹${Math.round(r.collection).toLocaleString('en-IN')}, Approved ${r.approved}, Rejected ${r.rejected}, Pending ${r.pending}`)
  const top = rows[0]
  const summary = `Top city by collection: ${top?.city || 'N/A'} (₹${Math.round(top?.collection||0).toLocaleString('en-IN')}).` 
  return `${summary}\n\n${lines.join('\n')}`
}

function App() {
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [properties, setProperties] = useState([])
  const [selectedTenant, setSelectedTenant] = useState('All Cities')

  const API = import.meta.env.VITE_API || 'http://localhost:4000'

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/properties`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setProperties(Array.isArray(data) ? data : (data.properties || []))
      } catch (err) {
        console.error('Could not load properties', err)
      }
    }
    load()
  }, [])

  function toggleSidebar() {
    setSidebarCollapsed(s => !s)
  }

  const tenants = useMemo(() => {
    const setT = new Set()
    properties.forEach(p => {
      const city = p.tenant || p.city || 'Unknown'
      setT.add(city)
    })
    return ['All Cities', ...Array.from(setT).sort()]
  }, [properties])

  const filteredProperties = useMemo(() => {
    if (!selectedTenant || selectedTenant === 'All Cities') return properties
    return properties.filter(p => (p.tenant || p.city || 'Unknown') === selectedTenant)
  }, [properties, selectedTenant])

  const cityStats = useMemo(() => computeCityStats(filteredProperties), [filteredProperties])
  const overallSummary = useMemo(() => buildDetailedSummary(properties), [properties])
  const isSettingsPage = location.pathname.startsWith('/settings')

  function handleLogout() {
    logout()
  }

  if (loading) return null
  if (!user) return <Login />

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <Sidebar onLogout={handleLogout} collapsed={sidebarCollapsed} user={user} />
      <div className="flex flex-col flex-1 min-w-0 bg-white">
        <Header onToggleSidebar={toggleSidebar} />

        <main className={isSettingsPage ? 'flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto p-6 lg:p-8'}>
          <Routes>
            <Route path="/overview" element={
              <OverviewPage
                tenants={tenants}
                selectedTenant={selectedTenant}
                setSelectedTenant={setSelectedTenant}
                filteredProperties={filteredProperties}
                cityStats={cityStats}
              />
            } />
            <Route path="/chat" element={<ChatPage dataSummary={overallSummary} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
