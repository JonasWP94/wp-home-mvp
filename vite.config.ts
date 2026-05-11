import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/apps/wpilot-home/',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
        wizard: './wizard.html',
        mvp: './mvp.html',
        mvpDash: './mvp-dashboard.html',
        thankyou: './thankyou.html',
      },
    },
  },
})
