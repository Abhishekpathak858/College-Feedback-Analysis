import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from '@/components/ErrorBoundary'
import './index.css'

// Auto-remove Netlify HUD badge elements
if (typeof window !== "undefined") {
  const removeNetlifyBadge = () => {
    document.querySelectorAll('iframe[src*="netlify"], div[data-nf-variant], [class*="netlify-hud"], [id*="netlify-hud"]').forEach(el => el.remove())
  }
  window.addEventListener("DOMContentLoaded", removeNetlifyBadge)
  setInterval(removeNetlifyBadge, 1000)
}

// Register PWA Service Worker for standalone Android App support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.log('ServiceWorker registration skipped:', err)
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
