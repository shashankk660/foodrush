import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import MenuItemCard from '../components/MenuItemCard'
import './Menu.css'

export default function Menu() {
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [items, setItems]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [activecat, setActivecat]   = useState(null)
  const [vegOnly, setVegOnly]       = useState(false)
  const [search, setSearch]         = useState('')

  useEffect(() => {
    const catParam = searchParams.get('cat')
    api.get('/api/menu/categories').then(r => {
      setCategories(r.data)
      if (catParam) {
        const match = r.data.find(c => c.name.toLowerCase() === catParam.toLowerCase())
        if (match) setActivecat(match.id)
      }
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activecat) params.category_id = activecat
    if (vegOnly) params.vegetarian = true
    api.get('/api/menu/items', { params })
      .then(r => setItems(r.data))
      .finally(() => setLoading(false))
  }, [activecat, vegOnly])

  const filtered = search
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.description?.toLowerCase().includes(search.toLowerCase()))
    : items

  return (
    <div className="menu-page page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="menu-header anim-fade-up">
          <div>
            <h1 className="section-title">Our Menu</h1>
            <p className="menu-subtitle">Fresh, delicious, delivered fast</p>
          </div>
          <div className="menu-search-wrap">
            <span className="menu-search-icon">🔍</span>
            <input className="input-field menu-search" type="text" placeholder="Search dishes..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Filters */}
        <div className="menu-filters anim-fade-up delay-1">
          <div className="menu-cats">
            <button className={`menu-cat-btn${!activecat ? ' active' : ''}`} onClick={() => setActivecat(null)}>All</button>
            {categories.map(c => (
              <button key={c.id} className={`menu-cat-btn${activecat === c.id ? ' active' : ''}`} onClick={() => setActivecat(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <label className="menu-veg-toggle">
            <input type="checkbox" checked={vegOnly} onChange={e => setVegOnly(e.target.checked)} />
            <span className="menu-veg-pill">🌿 Veg Only</span>
          </label>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="menu-empty">
            <span style={{ fontSize: 48 }}>🍽️</span>
            <p>No dishes found. Try a different filter.</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filtered.map((item, i) => (
              <div key={item.id} className={`anim-fade-up delay-${Math.min(i + 1, 5)}`}>
                <MenuItemCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
