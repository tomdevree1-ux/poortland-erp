import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// PWA conform masterdocument 4.9: installeerbaar met app shell caching.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Poortland ERP',
        short_name: 'Poortland',
        description: 'Het atelier, op 1 scherm.',
        theme_color: '#0F160F',
        background_color: '#FAF6EE',
        display: 'standalone',
        icons: [{ src: '/icoon.svg', sizes: 'any', type: 'image/svg+xml' }]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/gezond': 'http://localhost:5000'
    }
  }
})
