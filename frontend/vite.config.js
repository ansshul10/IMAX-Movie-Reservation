import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "./",  // Ensures correct path resolution on Netlify
  plugins: [react()],
})
