import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fr_cart') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('fr_cart', JSON.stringify(items))
  }, [items])

  const addItem = (menuItem, qty = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === menuItem.id)
      if (exists) return prev.map(i => i.id === menuItem.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { ...menuItem, qty }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const subtotal   = items.reduce((s, i) => s + i.price * i.qty, 0)

  const deliveryFee = parseFloat(import.meta.env.VITE_DELIVERY_FEE || 2.99)
  const freeAbove   = parseFloat(import.meta.env.VITE_FREE_DELIVERY_ABOVE || 30)
  const isFreeDelivery = subtotal >= freeAbove
  const total = subtotal + (isFreeDelivery ? 0 : (subtotal > 0 ? deliveryFee : 0))

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, deliveryFee, isFreeDelivery, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
