import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

function renderBlockOptimizer() {
  return {
    name: 'render-block-optimizer',
    transformIndexHtml(html) {
      html = html.replace(
        /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g,
        '<link rel="preload" href="$1" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
      )
      return html
    },
    writeBundle({ dir }) {
      const htmlPath = path.join(dir, 'index.html')
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf-8')
        const assetsDir = path.join(dir, 'assets')
        if (fs.existsSync(assetsDir)) {
          const homeChunk = fs
            .readdirSync(assetsDir)
            .find((f) => /^Home-[0-9A-Za-z_-]+\.js$/.test(f))
          if (homeChunk) {
            html = html.replace(
              '<head>',
              `<head>\n<link rel="modulepreload" href="/assets/${homeChunk}">`
            )
          }
        }
        html = html.replace(
          /<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/,
          ''
        )
        html = html.replace(
          '</body>',
          '<script type="module" src="/registerSW.js"></script>\n</body>'
        )
        fs.writeFileSync(htmlPath, html)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.png', 'icons/ico.png'],
      manifest: {
        short_name: 'Omar Portfolio',
        name: 'Omar Khaled El-Khouly | Software Developer Portfolio',
        description: 'Official website and portfolio of Omar Khaled El-Khouly, Software Developer.',
        icons: [
          {
            src: '/icons/icon.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any maskable',
          },
          {
            src: '/icons/ico.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable',
          },
        ],
        start_url: '/',
        background_color: '#030014',
        theme_color: '#030014',
        display: 'standalone',
        orientation: 'portrait',
      },
      workbox: {
        globPatterns: [
          'index.html',
          'manifest.json',
          'icons/*.png',
          'fonts/*.woff2',
          'assets/index-*.js',
          'assets/index-*.css',
          'assets/react-vendor-*.js',
        ],
        runtimeCaching: [
          {
            urlPattern: /^\/assets\/.*\.(js|css|woff2|json|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'asset-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /^https:\/\/ayuxygpqinjeoupittlb\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
    renderBlockOptimizer(),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'lottie': ['lottie-web'],
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
})
