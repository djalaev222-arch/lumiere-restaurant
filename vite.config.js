import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the repo from /<repo-name>/, not from the domain
  // root — only relevant for the gh-pages build (Render deploys serve from
  // "/" so this env var stays unset there).
  base: process.env.GH_PAGES ? '/lumiere-restaurant/' : '/',
})
