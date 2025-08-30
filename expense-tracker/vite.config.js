import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'Expense Tracker',
        short_name: 'Expense Tracker',
        description: 'Track your income and expenses offline',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/spending-1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/spending.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})