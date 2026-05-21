import React, { createContext, useContext, useEffect, useState } from 'react'

const API = import.meta.env.VITE_API || 'http://localhost:4000'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch(`${API}/api/me`, { credentials: 'include' })
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
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Login failed')
    }
    const me = await fetch(`${API}/api/me`, { credentials: 'include' })
    const data = await me.json()
    setUser(data.user)
    setCredentials({ username, password })
    return true
  }

  async function logout() {
    await fetch(`${API}/api/logout`, { method: 'POST', credentials: 'include' })
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
