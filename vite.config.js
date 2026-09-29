import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Only VITE_-prefixed variables reach the browser bundle (Vite's default,
  // stated explicitly). This is a static site: anything exposed here is public,
  // so database URLs, API secrets and tokens must never use this prefix.
  envPrefix: 'VITE_',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
})
