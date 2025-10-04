import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Match the port that Ngrok is forwarding
    strictPort: true, // Don't try another port if 5174 is in use
    host: true, // Listen on all addresses, including LAN and public addresses
    cors: true, // Enable CORS for all origins
    allowedHosts: ['localhost', 'b08d-2409-40c1-315b-8920-c824-3294-93e7-6aa0.ngrok-free.app'] // Explicitly allow the Ngrok domain
  }
})
