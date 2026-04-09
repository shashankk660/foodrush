import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Admin.css'

const CURRENCY = import.meta.env.VITE_APP_CURRENCY || '₹'
const STATUS_OPTIONS = ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled']
const TABS = ['Overview', 'Orders', 'Menu Items']

function statusLabel(s) {
  return s === 'out_for_delivery' ? 'Out for Delivery' : s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Admin() {
  const [tab, setTab]           = useState('Overview')
  const [orders, setOrders]     = useState([])
  const [items, setItems]       = useState([])
  const [categories, setCats]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm]         = useState({ name:'', description:'', price:'', image_url:'', is_vegetarian:false, is_available:true, prep_time_minutes:20, category_id:'', rating:4.5 })
  const [saving, setSaving]     = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/api/orders/all'),
      api.get('/api/menu/items'),
      api.get('/api/menu/categories'),
    ]).then(([o, m, c]) => {
      setOrders(o.data); setItems(m.data); setCats(c.data)
    }).finally(() => setLoading(false))
  }, [])

  const stats = {
    totalOrders:   orders.length,
    totalRevenue:  orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total_amount, 0),
    activeOrders:  orders.filter(o => !['delivered','cancelled'].includes(o.status)).length,
    totalItems:    items.length,
  }

  const handleStatusChange = async (orderId, status) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/status`, { status })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: data.status } : o))
      toast.success('Order status updated!')
    } catch { toast.error('Failed to update status.') }
  }

  const openForm = (item = null) => {
    setEditItem(item)
    setForm(item ? {
      name: item.name, description: item.description || '', price: item.price,
      image_url: item.image_url || '', is_vegetarian: item.is_vegetarian,
      is_available: item.is_available, prep_time_minutes: item.prep_time_minutes,
      category_id: item.category_id, rating: item.rating,
    } : { name:'', description:'', price:'', image_url:'', is_vegetarian:false, is_available:true, prep_time_minutes:20, category_id: categories[0]?.id || '', rating:4.5 })
    setShowForm(true)
  }

  const handleSaveItem = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), prep_time_minutes: parseInt(form.prep_time_minutes), category_id: parseInt(form.category_id), rating: parseFloat(form.rating) }
      if (editItem) {
        const { data } = await api.put(`/api/menu/items/${editItem.id}`, payload)
        setItems(prev => prev.map(i => i.id === editItem.id ? data : i))
        toast.success('Item updated!')
      } else {
        const { data } = await api.post('/api/menu/items', payload)
        setItems(prev => [data, ...prev])
        toast.success('Item created!')
      }
      setShowForm(false)
    } catch (err) { toast.error(err.response?.data?.detail || 'Save failed.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item?')) return
    try {
      await api.delete(`/api/menu/items/${id}`)
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success('Item deleted.')
    } catch { toast.error('Delete failed.') }
  }

  const toggleAvailability = async (item) => {
    try {
      const { data } = await api.put(`/api/menu/items/${item.id}`, { is_available: !item.is_available })
      setItems(prev => prev.map(i => i.id === item.id ? data : i))
    } catch { toast.error('Failed.') }
  }

  if (loading) return <div className="page-loader page-wrapper"><div className="spinner" /></div>

  return (
    <div className="admin-page page-wrapper">
      <div className="container">
        <div className="admin-header anim-fade-up">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Manage orders, menu, and monitor your business</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs anim-fade-up delay-1">
          {TABS.map(t => (
            <button key={t} className={`admin-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── Overview ───────────────────────────── */}
        {tab === 'Overview' && (
          <>
            <div className="admin-stats">
              {[
                { label:'Total Orders',   value: stats.totalOrders,                       icon:'📦', color:'#e8622a' },
                { label:'Total Revenue',  value: `${CURRENCY}${stats.totalRevenue.toFixed(2)}`, icon:'💰', color:'#22c55e' },
                { label:'Active Orders',  value: stats.activeOrders,                      icon:'🔥', color:'#f59e0b' },
                { label:'Menu Items',     value: stats.totalItems,                        icon:'🍽️', color:'#60a5fa' },
              ].map((s, i) => (
                <div key={s.label} className={`admin-stat-card anim-fade-up delay-${i+1}`} style={{ '--c': s.color }}>
                  <span className="admin-stat-icon">{s.icon}</span>
                  <div>
                    <div className="admin-stat-value">{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-recent">
              <h3 className="admin-section-title">Recent Orders</h3>
              <div className="admin-orders-table">
                <div className="admin-table-head">
                  <span>#</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span><span>Date</span>
                </div>
                {orders.slice(0, 8).map(o => (
                  <div key={o.id} className="admin-table-row">
                    <span className="admin-table-id">#{o.id}</span>
                    <span>{o.user_id}</span>
                    <span>{o.items.length} item{o.items.length !== 1 ? 's' : ''}</span>
                    <span style={{ fontWeight: 600 }}>{CURRENCY}{o.total_amount.toFixed(2)}</span>
                    <span><span className={`badge badge-${o.status}`}>{statusLabel(o.status)}</span></span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Orders ─────────────────────────────── */}
        {tab === 'Orders' && (
          <div className="admin-orders-full anim-fade-in">
            <h3 className="admin-section-title">All Orders ({orders.length})</h3>
            <div className="admin-orders-table">
              <div className="admin-table-head" style={{ gridTemplateColumns: '60px 1fr 1fr 100px 180px 120px' }}>
                <span>#</span><span>Items</span><span>Address</span><span>Total</span><span>Status</span><span>Date</span>
              </div>
              {orders.map(o => (
                <div key={o.id} className="admin-table-row" style={{ gridTemplateColumns: '60px 1fr 1fr 100px 180px 120px' }}>
                  <span className="admin-table-id">#{o.id}</span>
                  <span style={{ fontSize: 13 }}>{o.items.map(i => i.menu_item?.name || `Item`).join(', ')}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{o.delivery_address.slice(0, 40)}…</span>
                  <span style={{ fontWeight: 600 }}>{CURRENCY}{o.total_amount.toFixed(2)}</span>
                  <select
                    className="admin-status-select"
                    value={o.status}
                    onChange={e => handleStatusChange(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                  </select>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Menu Items ─────────────────────────── */}
        {tab === 'Menu Items' && (
          <div className="admin-menu anim-fade-in">
            <div className="admin-menu-header">
              <h3 className="admin-section-title">Menu Items ({items.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={() => openForm()}>+ Add Item</button>
            </div>
            <div className="admin-menu-grid">
              {items.map(item => (
                <div key={item.id} className="admin-menu-card">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} alt={item.name} className="admin-menu-card__img" />
                  <div className="admin-menu-card__body">
                    <div className="admin-menu-card__top">
                      <span className="admin-menu-card__name">{item.name}</span>
                      <span className="admin-menu-card__price">{CURRENCY}{item.price.toFixed(2)}</span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.category?.name}</span>
                    <div className="admin-menu-card__actions">
                      <button
                        className={`btn btn-sm ${item.is_available ? 'btn-ghost' : 'btn-outline'}`}
                        onClick={() => toggleAvailability(item)}
                        style={{ fontSize: 12 }}
                      >{item.is_available ? 'Available' : 'Unavailable'}</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => openForm(item)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Form ─────────────────────────── */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button className="admin-modal__close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveItem} className="admin-modal__form">
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="input-field" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price *</label>
                  <input className="input-field" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="input-field" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} style={{ resize: 'none' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input className="input-field" value={form.image_url} onChange={e => setForm(p => ({...p, image_url: e.target.value}))} placeholder="https://..." />
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="input-field" value={form.category_id} onChange={e => setForm(p => ({...p, category_id: e.target.value}))} required>
                    <option value="">Select…</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Prep Time (min)</label>
                  <input className="input-field" type="number" min="1" value={form.prep_time_minutes} onChange={e => setForm(p => ({...p, prep_time_minutes: e.target.value}))} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Rating (0–5)</label>
                  <input className="input-field" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm(p => ({...p, rating: e.target.value}))} />
                </div>
                <div className="admin-checkboxes">
                  <label className="admin-checkbox-label">
                    <input type="checkbox" checked={form.is_vegetarian} onChange={e => setForm(p => ({...p, is_vegetarian: e.target.checked}))} />
                    🌿 Vegetarian
                  </label>
                  <label className="admin-checkbox-label">
                    <input type="checkbox" checked={form.is_available} onChange={e => setForm(p => ({...p, is_available: e.target.checked}))} />
                    ✅ Available
                  </label>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : (editItem ? 'Save Changes' : 'Create Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
