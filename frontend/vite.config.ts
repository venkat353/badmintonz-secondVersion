import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
      host: true,  // Allow access from outside the container
      port: 5173,
      // FIX: Add your domain here to stop the "Blocked request" error
      allowedHosts: [
        'badmintoz.shop',
        'www.badmintoz.shop',
        '3.109.187.78' // Good to keep the IP allowed too just in case
      ]
    }
})
