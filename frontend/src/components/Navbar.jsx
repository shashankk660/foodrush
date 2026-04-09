import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🍔</span>
          <span className="navbar__logo-text">
            {import.meta.env.VITE_APP_TITLE || 'FoodRush'}
          </span>
        </Link>

        <div className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}>
          <NavLink to="/menu" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Menu</NavLink>
          {user && <NavLink to="/orders" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>My Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => `navbar__link navbar__link--admin${isActive ? ' active' : ''}`} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
        </div>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/cart" className="navbar__cart-btn">
                <span>🛒</span>
                {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
              </Link>
              <div className="navbar__user-menu">
                <button className="navbar__user-btn">
                  <span className="navbar__avatar">{user.name?.[0]?.toUpperCase()}</span>
                  <span className="navbar__user-name">{user.name.split(' ')[0]}</span>
                  <span className="navbar__chevron">▾</span>
                </button>
                <div className="navbar__dropdown">
                  <Link to="/profile" className="navbar__dropdown-item">👤 Profile</Link>
                  <Link to="/orders" className="navbar__dropdown-item">📦 My Orders</Link>
                  <div className="navbar__dropdown-divider" />
                  <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </div>
          )}
          <button className="navbar__hamburger" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  )
}
