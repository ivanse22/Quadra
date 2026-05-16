import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

const isMazeUrl = typeof window !== 'undefined' && (
  window.location.pathname === '/home' ||
  window.location.pathname.startsWith('/maze/') ||
  new URLSearchParams(window.location.search).has('mazeTask') ||
  new URLSearchParams(window.location.search).has('maze')
)

// Registrar Service Worker silenciosamente para modo Offline y cache
if (import.meta.env.PROD && !isMazeUrl) {
  registerSW({ immediate: true })
}

// Evitar quedar pegados a cache PWA en iOS Simulator/Safari y en pruebas Maze.
if ((import.meta.env.DEV || isMazeUrl) && typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    }).catch(() => {})
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key))
    }).catch(() => {})
  }
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
