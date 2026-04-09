import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const APP_TITLE   = import.meta.env.VITE_APP_TITLE   || 'FoodRush'
const APP_TAGLINE = import.meta.env.VITE_APP_TAGLINE || 'Crave. Click. Devour.'
const FREE_ABOVE  = import.meta.env.VITE_FREE_DELIVERY_ABOVE || 30
const CURRENCY    = import.meta.env.VITE_APP_CURRENCY || '₹'

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Average delivery in under 30 minutes, guaranteed.' },
  { icon: '🍽️', title: 'Chef Curated', desc: 'Every dish crafted by top culinary professionals.' },
  { icon: '🔒', title: 'Secure & Safe', desc: 'End-to-end encrypted payments, zero hassle.' },
  { icon: '📦', title: 'Live Tracking', desc: 'Watch your order journey in real-time.' },
]

const CUISINES = [
  { emoji: '🍔', name: 'Burgers', color: '#e8622a' },
  { emoji: '🍕', name: 'Pizza',   color: '#d97706' },
  { emoji: '🍣', name: 'Sushi',   color: '#0891b2' },
  { emoji: '🍰', name: 'Desserts',color: '#c026d3' },
  { emoji: '🥤', name: 'Drinks',  color: '#16a34a' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home page-wrapper">
      {/* ── Hero ─────────────────────────────── */}
      <section className="home__hero">
        <div className="home__hero-bg">
          <div className="home__hero-blob blob1" />
          <div className="home__hero-blob blob2" />
          <div className="home__hero-grain" />
        </div>
        <div className="container home__hero-content">
          <div className="home__hero-text anim-fade-up">
            <div className="home__hero-badge">🔥 #1 Food Delivery App</div>
            <h1 className="home__hero-title">
              {APP_TITLE.split('').map((ch, i) =>
                <span key={i} style={{ animationDelay: `${i * 0.04}s` }}>{ch}</span>
              )}
            </h1>
            <p className="home__hero-tagline">{APP_TAGLINE}</p>
            <p className="home__hero-desc">
              Premium restaurant food delivered to your door.{' '}
              Free delivery on orders above {CURRENCY}{FREE_ABOVE}.
            </p>
            <div className="home__hero-ctas">
              <Link to="/menu" className="btn btn-primary btn-lg">Explore Menu →</Link>
              {!user && <Link to="/register" className="btn btn-ghost btn-lg">Join Free</Link>}
            </div>
          </div>
          <div className="home__hero-visual anim-fade-up delay-3">
            <div className="home__hero-card">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" alt="hero food" />
              <div className="home__hero-pill home__hero-pill--1">
                <span>⭐ 4.9</span> Top Rated
              </div>
              <div className="home__hero-pill home__hero-pill--2">
                <span>🚀</span> 25 min avg
              </div>
              <div className="home__hero-pill home__hero-pill--3">
                <span>🍽️</span> 200+ Dishes
              </div>
            </div>
          </div>
        </div>
        <div className="home__hero-scroll">
          <span>Scroll to explore</span>
          <div className="home__hero-scroll-line" />
        </div>
      </section>

      {/* ── Cuisines ─────────────────────────── */}
      <section className="home__cuisines">
        <div className="container">
          <div className="home__section-header anim-fade-up">
            <h2 className="section-title">What are you craving?</h2>
            <Link to="/menu" className="btn btn-ghost btn-sm">See all →</Link>
          </div>
          <div className="home__cuisines-grid">
            {CUISINES.map((c, i) => (
              <Link to={`/menu?cat=${c.name}`} key={c.name}
                className={`home__cuisine-card anim-fade-up delay-${i + 1}`}
                style={{ '--accent': c.color }}>
                <span className="home__cuisine-emoji">{c.emoji}</span>
                <span className="home__cuisine-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────── */}
      <section className="home__features">
        <div className="container">
          <h2 className="section-title anim-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
            Why choose <span style={{ color: 'var(--brand)' }}>{APP_TITLE}?</span>
          </h2>
          <div className="home__features-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`home__feature-card anim-fade-up delay-${i + 1}`}>
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      {!user && (
        <section className="home__cta">
          <div className="container">
            <div className="home__cta-card anim-fade-up">
              <div className="home__cta-glow" />
              <h2 className="section-title">Ready to order?</h2>
              <p>Sign up in seconds and get your first delivery delivered with love.</p>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────── */}
      <footer className="home__footer">
        <div className="container">
          <span className="home__footer-brand">🍔 {APP_TITLE}</span>
          <span className="home__footer-copy">© {new Date().getFullYear()} {APP_TITLE}. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
