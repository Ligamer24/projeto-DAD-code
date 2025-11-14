import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
        tailwindcss(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            devOptions: {
                enabled: true,
            },
            includeAssets: ['favicon.ico', 'icons/logo.png'],
            manifest: {
                id: '/?source=pwa',
                name: 'Bisca Royal',
                short_name: 'BiscaRoyal',
                description: 'Play Bisca Royal - leaderboard, history, shop and more.',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                display_override: ['standalone', 'minimal-ui'],
                background_color: '#bbf451',
                theme_color: '#bbf451',
                orientation: 'portrait-primary',
                lang: 'en',
                categories: ['games', 'entertainment'],
                icons: [
                    {
                        src: '/icons/logo.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/logo.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/logo.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ],
                screenshots: []
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        allowedHosts: ['redycore.dpdns.org'],
    }
})
