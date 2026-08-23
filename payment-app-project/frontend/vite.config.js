import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/favicon-32.png', 'icons/apple-touch-icon.png'],
            manifest: {
                name: 'Nehemiah Building Payment Wallet',
                short_name: 'Nehemiah Wallet',
                description: 'Member payments, dues, and receipt tracking for Nehemiah Building.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                background_color: '#0f172a',
                theme_color: '#2bb7a6',
                icons: [
                    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                    { src: '/icons/maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
                    { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],
            },
            workbox: {
                // API calls always hit the network — never serve stale payment/auth data from cache
                navigateFallbackDenylist: [/^\/api\//],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts',
                            expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                ],
            },
        }),
    ],
    server: {
        port: 5173,
    },
});
