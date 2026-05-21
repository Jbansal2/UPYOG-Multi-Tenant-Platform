import React from 'react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Settings</h3>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">App Theme</label>
            <div className="mt-2">
              <select className="rounded-md border border-gray-200 px-3 py-1 text-sm">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Notifications</label>
            <div className="mt-2 flex items-center gap-3">
              <input type="checkbox" id="notif" />
              <label htmlFor="notif" className="text-sm text-gray-600">Enable in-app notifications</label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Data Source</label>
            <div className="mt-2 text-sm text-gray-600">Using MongoDB at MONGODB_URI (local)</div>
          </div>

        </div>
      </div>
    </div>
  )
}
