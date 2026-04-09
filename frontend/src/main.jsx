import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f5f0e8',
            border: '1px solid #e8622a',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#e8622a', secondary: '#f5f0e8' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f5f0e8' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
