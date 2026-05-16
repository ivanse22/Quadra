import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

const hasQueryParam = (search, key) => new RegExp(`[?&]${key}(=|&|$)`).test(search)

const isMazeUrl = (() => {
  if (typeof window === 'undefined') return false
  try {
    return window.location.pathname === '/home' ||
      window.location.pathname.startsWith('/maze/') ||
      hasQueryParam(window.location.search, 'mazeTask') ||
      hasQueryParam(window.location.search, 'maze')
  } catch {
    return false
  }
})()

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
