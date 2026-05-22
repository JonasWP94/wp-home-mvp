import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GH_PAGES=true → Build für jonaswp94.github.io/wp-home-mvp/
// Default → wechselpilot.com/apps/wpilot-home/
const BASE = process.env.GH_PAGES === 'true' ? '/wp-home-mvp/' : '/apps/wpilot-home/';

export default defineConfig({
  plugins: [react()],
  base: BASE,
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
