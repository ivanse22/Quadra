import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    // Permite abrir el dev server desde el móvil en la misma red (http://<tu-ip-lan>:5173)
    host: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // En dev, el SW suele romper HMR / caché en localhost; el PWA se prueba con `npm run build && npm run preview`
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Quadra — Tu plata, clara.',
        short_name: 'Quadra',
        description: 'Gestión financiera para freelancers colombianos',
        theme_color: '#BDF300',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
