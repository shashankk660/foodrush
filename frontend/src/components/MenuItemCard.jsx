import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './MenuItemCard.css'

const CURRENCY = import.meta.env.VITE_APP_CURRENCY || '₹'

export default function MenuItemCard({ item }) {
  const { addItem, items } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const inCart = items.find(i => i.id === item.id)

  const handleAdd = async () => {
    if (!user) { navigate('/login'); return }
    setAdding(true)
    addItem(item)
    toast.success(`${item.name} added to cart!`)
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <div className="mic">
      <div className="mic__img-wrap">
        <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} alt={item.name} className="mic__img" loading="lazy" />
        <div className="mic__badges">
          {item.is_vegetarian && <span className="badge badge-veg">🌿 Veg</span>}
        </div>
        <div className="mic__rating">⭐ {item.rating.toFixed(1)}</div>
      </div>
      <div className="mic__body">
        <div className="mic__meta">
          <span className="mic__category">{item.category?.name}</span>
          <span className="mic__time">⏱ {item.prep_time_minutes}m</span>
        </div>
        <h3 className="mic__name">{item.name}</h3>
        <p className="mic__desc">{item.description}</p>
        <div className="mic__footer">
          <span className="mic__price">{CURRENCY}{item.price.toFixed(2)}</span>
          <button
            className={`btn btn-primary btn-sm mic__add-btn${adding ? ' adding' : ''}`}
            onClick={handleAdd}
          >
            {inCart ? `+1 (${inCart.qty})` : adding ? '✓' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
