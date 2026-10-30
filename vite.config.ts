import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { mockBackend } from './server/mockBackend.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockBackend()],
})
