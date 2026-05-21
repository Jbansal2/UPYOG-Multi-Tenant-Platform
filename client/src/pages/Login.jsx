import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  async function handleLogin(e) {
    e.preventDefault()
    try {
      await login(user, pass)
      setError('')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white p-5 font-sans box-border">
      <form className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-[440px] flex flex-col text-[#09090b]" onSubmit={handleLogin}>
        <div className="px-6 pt-6 pb-0 mb-6">
          <div className="flex items-center mb-2">
            <h2 className="m-0 text-[20px] font-semibold text-[#09090b] tracking-tight">Login to your account</h2>
          </div>
          <p className="m-0 text-[14px] text-[#71717a] text-left">Enter your username below to login to your account</p>
        </div>
        
        <div className="px-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-[14px] font-medium text-[#09090b]">Username</label>
            <input 
              value={user} 
              onChange={e => setUser(e.target.value)} 
              placeholder="m@example.com"
              className="w-full px-3 py-2.5 bg-white border border-[#e4e4e7] rounded-lg text-[#09090b] text-[14px] transition-colors box-border placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b]"
            />
          </div>
          
          <div className="flex flex-col gap-2 text-left">
            <div className="flex justify-between items-center">
              <label className="text-[14px] font-medium text-[#09090b]">Password</label>
              <a href="#" className="text-[14px] text-[#09090b] no-underline font-medium hover:underline">Forgot your password?</a>
            </div>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-[#e4e4e7] rounded-lg text-[#09090b] text-[14px] transition-colors box-border placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] focus:ring-1 focus:ring-[#09090b]"
            />
          </div>
          
          {error && <div className="bg-red-50 border border-red-200 text-red-500 px-3 py-2.5 rounded-lg text-[13px] text-left mt-1">{error}</div>}
        </div>

        <div className="mt-6 p-6 flex flex-col gap-3 bg-[#fafafa] border-t border-gray-200 rounded-b-xl">
            <button type="submit" className="w-full p-2.5 rounded-lg bg-[#09090b] text-white border-none text-[14px] font-medium cursor-pointer transition-colors flex items-center justify-center hover:bg-[#27272a]">Login</button>
        </div>
      <div className="px-6 mt-3 mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
          <div className="flex items-center">
            <div>
              <div className="font-medium text-[13px]">Demo credentials</div>
              <div className="text-[13px] text-[#6b7280]">Username: <span className="text-[#111827] font-medium">admin</span> &nbsp; Password: <span className="text-[#111827] font-medium">secret123</span></div>
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
  )
}
