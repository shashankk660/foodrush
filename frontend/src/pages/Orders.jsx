import { useState, useEffect } from 'react'
import api from '../api/axios'
import './Orders.css'

const CURRENCY = import.meta.env.VITE_APP_CURRENCY || '₹'
const STATUS_STEPS = ['pending','confirmed','preparing','out_for_delivery','delivered']

function statusLabel(s) {
  return s === 'out_for_delivery' ? 'Out for Delivery' : s.charAt(0).toUpperCase() + s.slice(1)
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/api/orders/my')
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page-loader page-wrapper"><div className="spinner" /></div>

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <h1 className="section-title anim-fade-up" style={{ marginBottom: 32 }}>My Orders</h1>

        {orders.length === 0 ? (
          <div className="orders-empty anim-fade-up">
            <span style={{ fontSize: 56 }}>📦</span>
            <h3>No orders yet</h3>
            <p>Place your first order to see it here!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, i) => (
              <div key={order.id} className={`order-card anim-fade-up delay-${Math.min(i + 1, 5)}`}>
                <div className="order-card__header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-card__left">
                    <span className="order-card__id">Order #{order.id}</span>
                    <span className={`badge badge-${order.status}`}>{statusLabel(order.status)}</span>
                  </div>
                  <div className="order-card__right">
                    <span className="order-card__total">{CURRENCY}{order.total_amount.toFixed(2)}</span>
                    <span className="order-card__date">{new Date(order.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    <span className="order-card__chevron">{expanded === order.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.status !== 'cancelled' && (
                  <div className="order-progress">
                    {STATUS_STEPS.map((step, idx) => {
                      const activeIdx = STATUS_STEPS.indexOf(order.status)
                      const done = idx <= activeIdx
                      return (
                        <div key={step} className={`order-progress__step${done ? ' done' : ''}`}>
                          <div className="order-progress__dot" />
                          <span className="order-progress__label">{statusLabel(step)}</span>
                          {idx < STATUS_STEPS.length - 1 && <div className={`order-progress__line${done && idx < activeIdx ? ' done' : ''}`} />}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Expanded Items */}
                {expanded === order.id && (
                  <div className="order-card__body">
                    <div className="divider" style={{ margin: '12px 0' }} />
                    {order.items.map(oi => (
                      <div key={oi.id} className="order-item-row">
                        <span className="order-item-row__name">{oi.menu_item?.name || `Item #${oi.menu_item_id}`}</span>
                        <span className="order-item-row__qty">×{oi.quantity}</span>
                        <span className="order-item-row__price">{CURRENCY}{(oi.unit_price * oi.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="divider" style={{ margin: '12px 0' }} />
                    <div className="order-addr">
                      <span>📍</span>
                      <span>{order.delivery_address}</span>
                    </div>
                    {order.special_instructions && (
                      <div className="order-addr" style={{ marginTop: 6 }}>
                        <span>📝</span>
                        <span>{order.special_instructions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
