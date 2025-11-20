// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: process.env.DEV_PORT ? parseInt(process.env.DEV_PORT) : undefined,
    host: process.env.DEV_HOST,
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/main.css',
  ]
})