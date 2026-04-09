import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import './Profile.css'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const [form, setForm]     = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' })
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-page page-wrapper">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <div className="profile-sidebar anim-fade-up">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div className="profile-avatar-ring" />
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <span className="profile-email">{user?.email}</span>
            <span className={`badge badge-${user?.role === 'admin' ? 'confirmed' : 'veg'}`} style={{ marginTop: 8 }}>
              {user?.role === 'admin' ? '👑 Admin' : '🍽️ Foodie'}
            </span>
            <div className="profile-meta">
              <div className="profile-meta-row"><span>📅 Member since</span><span>{new Date(user?.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></div>
              {user?.phone && <div className="profile-meta-row"><span>📱 Phone</span><span>{user.phone}</span></div>}
            </div>
            <button className="btn btn-danger btn-block btn-sm" style={{ marginTop: 24 }} onClick={logout}>Sign Out</button>
          </div>

          {/* Form */}
          <div className="profile-form-card anim-fade-up delay-1">
            <h3 className="profile-form-title">Edit Profile</h3>
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="input-field" value={form.name} onChange={set('name')} minLength={2} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="input-field" value={user?.email} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="input-field" value={form.phone} onChange={set('phone')} placeholder="+91 9999999999" />
              </div>
              <div className="form-group">
                <label className="form-label">Default Delivery Address</label>
                <textarea className="input-field" rows={3} value={form.address} onChange={set('address')} placeholder="123 Main St, City" style={{ resize: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={saving}>
                {saving ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
