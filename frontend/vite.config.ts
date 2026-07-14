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
        description: 'Poortland Operations',
        theme_color: '#FAF6EE',
        background_color: '#FAF6EE',
        display: 'standalone',
        icons: [{ src: '/icoon.svg', sizes: 'any', type: 'image/svg+xml' }]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        // Stabiele libraries in aparte chunks zodat ze gecachet blijven over uitrollen heen.
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/gezond': 'http://localhost:5000'
    }
  }
})
