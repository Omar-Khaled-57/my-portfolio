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
          const lottieChunk = fs
            .readdirSync(assetsDir)
            .find((f) => /^lottie-[0-9A-Za-z_-]+\.js$/.test(f))
          const preloads = []
          if (homeChunk) {
            preloads.push(`<link rel="modulepreload" href="/assets/${homeChunk}">`)
          }
          // The hero animation can only start once lottie-web has parsed and
          // rendered the animation data, so on desktop these two assets get a
          // head start. They are deliberately NOT fetchpriority=high (the entry
          // chunk must win the queue on slow networks) and they are only
          // injected when the device is desktop: mobile loads lottie lazily
          // after LCP, so preloading it there wastes bandwidth and outruns
          // index/react-vendor on throttled connections.
          if (lottieChunk) {
            preloads.push(`<script>
  (function () {
    // matchMedia read at parse time can observe the pre-emulation viewport
    // (~800px), which makes mobile/headless runs wrongly select the desktop
    // path and preload lottie back into the critical path. Read it after the
    // first frame so device emulation is applied, then preload lottie only
    // for real desktop clients.
    requestAnimationFrame(function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        var l = document.createElement("link");
        l.rel = "modulepreload";
        l.href = "/assets/${lottieChunk}";
        document.head.appendChild(l);
        var j = document.createElement("link");
        j.rel = "preload";
        j.as = "fetch";
        j.href = "/animations/lottie.json";
        j.type = "application/json";
        j.crossOrigin = "anonymous";
        document.head.appendChild(j);
      }
    });
  })();
</script>`)
          }
          // Self-hosted Poppins (latin subset). Preloading the two weights that
          // paint the hero pre-empts the font-swap reflow CLS measured on
          // mobile once the typewriter/paragraph become visible.
          preloads.push(
            `<link rel="preload" href="/fonts/Poppins-400.woff2" as="font" type="font/woff2" crossorigin>`,
            `<link rel="preload" href="/fonts/Poppins-700.woff2" as="font" type="font/woff2" crossorigin>`,
          )
          if (preloads.length > 0) {
            html = html.replace(
              '<head>',
              `<head>\n${preloads.join('\n')}`,
            )
          }
        }
        fs.writeFileSync(htmlPath, html)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: [
        'icons/icon-512.png',
        'icons/icon-192.png',
        'icons/icon-512-maskable.png',
        'icons/icon-192-maskable.png',
        'icons/apple-touch-icon-180.png',
        'icons/apple-touch-icon-152.png',
        'icons/favicon-64.png',
        'icons/favicon-48.png',
        'icons/favicon-32.png',
        'icons/favicon-16.png',
        'screenshots/desktop.png',
        'screenshots/mobile.png',
      ],
      manifest: {
        id: '/',
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
        },
      },
    },
  },
})
