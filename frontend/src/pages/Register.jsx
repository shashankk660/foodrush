import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const user = await register(form)
      toast.success(`Welcome to FoodRush, ${user.name.split(' ')[0]}! 🎉`)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-card anim-fade-up" style={{ maxWidth: 480 }}>
        <div className="auth-brand">
          <span className="auth-brand-icon">🍔</span>
          <span className="auth-brand-name">{import.meta.env.VITE_APP_TITLE || 'FoodRush'}</span>
        </div>
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join thousands of happy foodies</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="input-field" type="text" placeholder="John Doe" value={form.name} onChange={set('name')} required minLength={2} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="input-field" type="tel" placeholder="+91 9999999999" value={form.phone} onChange={set('phone')} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea className="input-field" rows={2} placeholder="123 Main St, City, State" value={form.address} onChange={set('address')} style={{ resize: 'none' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Create Account →'}
          </button>
        </form>
        <p className="auth-footer-link">
          Already have an account? <Link to="/login">Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
