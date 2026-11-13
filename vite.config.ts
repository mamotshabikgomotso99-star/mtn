import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createCatalogHandler } from './server/catalog.mjs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'mtn-catalog-api',
      configureServer(server) {
        server.middlewares.use('/api/mtn/promotions', createCatalogHandler())
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
