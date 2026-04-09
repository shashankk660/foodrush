import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import './Cart.css'

const CURRENCY = import.meta.env.VITE_APP_CURRENCY || '₹'

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, subtotal, deliveryFee, isFreeDelivery, total } = useCart()
  const { user } = useAuth()
  const navigate  = useNavigate()

  const [address, setAddress]             = useState(user?.address || '')
  const [instructions, setInstructions]   = useState('')
  const [placing, setPlacing]             = useState(false)

  const handlePlaceOrder = async () => {
    if (!address.trim()) { toast.error('Please enter a delivery address.'); return }
    setPlacing(true)
    try {
      await api.post('/api/orders', {
        items: items.map(i => ({ menu_item_id: i.id, quantity: i.qty })),
        delivery_address: address,
        special_instructions: instructions || null,
      })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page page-wrapper">
        <div className="container">
          <div className="cart-empty anim-fade-up">
            <span style={{ fontSize: 64 }}>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our menu!</p>
            <Link to="/menu" className="btn btn-primary btn-lg">Browse Menu →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <h1 className="section-title anim-fade-up" style={{ marginBottom: 32 }}>Your Cart</h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item, i) => (
              <div key={item.id} className={`cart-item anim-fade-up delay-${Math.min(i + 1, 5)}`}>
                <img src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'} alt={item.name} className="cart-item__img" />
                <div className="cart-item__info">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <span className="cart-item__price">{CURRENCY}{item.price.toFixed(2)}</span>
                </div>
                <div className="cart-item__controls">
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span className="cart-qty-val">{item.qty}</span>
                  <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="cart-item__subtotal">{CURRENCY}{(item.price * item.qty).toFixed(2)}</span>
                <button className="cart-item__remove" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary anim-fade-up delay-2">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__row">
              <span>Subtotal</span><span>{CURRENCY}{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery</span>
              <span style={{ color: isFreeDelivery ? 'var(--success)' : 'inherit' }}>
                {isFreeDelivery ? 'FREE' : `${CURRENCY}${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            {!isFreeDelivery && (
              <p className="cart-free-msg">Add {CURRENCY}{(parseFloat(import.meta.env.VITE_FREE_DELIVERY_ABOVE || 30) - subtotal).toFixed(2)} more for free delivery!</p>
            )}
            <div className="divider" />
            <div className="cart-summary__row cart-summary__total">
              <span>Total</span><span>{CURRENCY}{total.toFixed(2)}</span>
            </div>

            <div className="divider" />
            <div className="form-group">
              <label className="form-label">Delivery Address *</label>
              <textarea className="input-field" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Enter your delivery address" style={{ resize: 'none' }} required />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">Special Instructions</label>
              <textarea className="input-field" rows={2} value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Extra napkins, no onions, etc." style={{ resize: 'none' }} />
            </div>

            <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }} onClick={handlePlaceOrder} disabled={placing}>
              {placing ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : `Place Order • ${CURRENCY}${total.toFixed(2)}`}
            </button>
            <button className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 8 }} onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  )
}
