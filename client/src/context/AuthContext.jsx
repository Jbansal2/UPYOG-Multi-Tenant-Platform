import React, { createContext, useContext, useEffect, useState } from 'react'

const API = import.meta.env.VITE_API

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API}/api/me`, { credentials: 'include', cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    check()
  }, [])

  async function login(username, password) {
    const res = await fetch(`${API}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
      cache: 'no-store',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Login failed')
    }
    const data = await res.json().catch(() => ({}))
    setUser(data.user || { username })
    setCredentials({ username, password })
    return true
  }

  async function logout() {
    await fetch(`${API}/api/logout`, { method: 'POST', credentials: 'include', cache: 'no-store' })
    setUser(null)
    setCredentials(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, credentials, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
