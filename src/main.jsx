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

// Clean up any stale service workers or old caches from previous builds
if (typeof window !== "undefined" && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      reg.unregister().catch(() => {})
    }
  }).catch(() => {})
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        if (key.includes('campushub') || key.includes('v1')) {
          caches.delete(key).catch(() => {})
        }
      })
    }).catch(() => {})
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
