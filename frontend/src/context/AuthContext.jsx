import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('fr_token')
    if (token) {
      api.get('/api/auth/me')
        .then(r => setUser(r.data))
        .catch(() => { localStorage.removeItem('fr_token'); localStorage.removeItem('fr_user') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('fr_token', data.access_token)
    const me = await api.get('/api/auth/me')
    setUser(me.data)
    return me.data
  }

  const register = async (payload) => {
    await api.post('/api/auth/register', payload)
    return login(payload.email, payload.password)
  }

  const logout = () => {
    localStorage.removeItem('fr_token')
    localStorage.removeItem('fr_user')
    setUser(null)
  }

  const updateProfile = async (payload) => {
    const { data } = await api.put('/api/auth/me', payload)
    setUser(data)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
