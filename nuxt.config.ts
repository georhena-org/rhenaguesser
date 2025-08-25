// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'RhenaGuesser',
      link: [
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }
      ]
    },
    baseURL: '/rhenaguesser/'
  },
  future: {
      compatibilityVersion: 4
  },
  ssr: false,

  modules: [
      '@nuxtjs/leaflet',
      '@nuxt/icon',
      '@pinia/nuxt'
  ],

  css: [
      '@/assets/styles/global.scss',
      '@panoramax/web-viewer/build/index.css'
  ],

  vite: {
      css: {
          preprocessorOptions: {
              scss: {
                  api: 'modern'
              }
          }
      },
      server: {
        allowedHosts: [".ngrok-free.app"]
      }
  },

  devtools: {
      enabled: false
  },

  nitro: {
      preset: 'node-server',
      experimental: {
          websocket: true,
      },
      externals: {
          inline: ['vue', 'vue/server-renderer']
      }
  },

  compatibilityDate: '2025-01-21'
})
