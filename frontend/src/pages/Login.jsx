import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card anim-fade-up">
        <div className="auth-brand">
          <span className="auth-brand-icon">🍔</span>
          <span className="auth-brand-name">{import.meta.env.VITE_APP_TITLE || 'FoodRush'}</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to continue ordering</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Sign In →'}
          </button>
        </form>

        <div className="auth-demo">
          <p>Demo credentials:</p>
          <code>admin@foodrush.com / Admin@1234</code>
        </div>

        <p className="auth-footer-link">
          Don't have an account? <Link to="/register">Create one →</Link>
        </p>
      </div>
    </div>
  )
}
