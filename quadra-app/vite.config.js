/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  server: {
    // Permite abrir el dev server desde el móvil en la misma red (http://<tu-ip-lan>:5173)
    host: true
  },
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    // En dev, el SW suele romper HMR / caché en localhost; el PWA se prueba con `npm run build && npm run preview`
    devOptions: {
      enabled: false
    },
    workbox: {
      maximumFileSizeToCacheInBytes: 5000000 // 5MB to allow storybook globals to pass
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
      icons: [{
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }, {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }]
    }
  })],
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});