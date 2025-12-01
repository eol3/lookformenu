// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  devServer: {
    port: process.env.DEV_PORT ? parseInt(process.env.DEV_PORT) : undefined,
    host: process.env.DEV_HOST,
  },

  css: [
    'bootstrap-icons/font/bootstrap-icons.css',
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/main.css',
  ],

  modules: ['nuxt-auth-utils', 'nuxt-file-storage'],
  runtimeConfig: {
    mysql: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      tz: process.env.DB_TZ,
    },
    session: {
      password: process.env.NUXT_SESSION_PASSWORD || 'YOUR_LONG_SECRET_FALLBACK_KEY_HERE',
      cookie: {
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  fileStorage: {
    mount: 'public/static',
  }
})