import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar         from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home     from './pages/Home'
import Login    from './pages/Login'
import Register from './pages/Register'
import Menu     from './pages/Menu'
import Cart     from './pages/Cart'
import Orders   from './pages/Orders'
import Profile  from './pages/Profile'
import Admin    from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu"     element={<Menu />} />

          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
          } />

          <Route path="*" element={
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:16, color:'var(--text-muted)' }}>
              <span style={{ fontSize:64 }}>🍔</span>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--text)' }}>404 — Page Not Found</h2>
              <a href="/" className="btn btn-primary">Go Home →</a>
            </div>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
