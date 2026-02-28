import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site at https://himayetsu.github.io/ — repo name himayetsu.github.io, so base is root
export default defineConfig({
  plugins: [react()],
  base: '/',
})
