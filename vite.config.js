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
      includeAssets: [
        'icons/icon-512.png',
        'icons/icon-192.png',
        'icons/icon-512-maskable.png',
        'icons/icon-192-maskable.png',
        'icons/apple-touch-icon-180.png',
        'icons/apple-touch-icon-152.png',
        'icons/favicon.svg',
        'icons/favicon-64.png',
        'icons/favicon-48.png',
        'icons/favicon-32.png',
        'icons/favicon-16.png',
        'screenshots/desktop.png',
        'screenshots/mobile.png',
      ],
      manifest: {
        id: 'urn:portfolio:omar-el-khouly',
        lang: 'en',
        name: 'Omar Khaled El-Khouly | Software Developer Portfolio',
        short_name: 'Omar Portfolio',
        description: 'Official website and portfolio of Omar Khaled El-Khouly, Software Developer.',
        icons: [
          {
            src: '/icons/icon-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: '/icons/icon-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512-maskable.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-192-maskable.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
        ],
        start_url: '/',
        scope: '/',
        background_color: '#030014',
        theme_color: '#030014',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui', 'browser'],
        categories: ['portfolio', 'productivity'],
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Home',
            short_name: 'Home',
            url: '/',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'CV',
            short_name: 'CV',
            url: '/cv',
            icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
        screenshots: [
          {
            src: '/screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Omar Khaled El-Khouly — Portfolio',
          },
          {
            src: '/screenshots/mobile.png',
            sizes: '412x896',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Omar Khaled El-Khouly — Portfolio',
          },
        ],
      },
      workbox: {
        globPatterns: [
          'index.html',
          'manifest.webmanifest',
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
