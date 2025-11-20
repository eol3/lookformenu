//import pkg from './package'
const axios = require('axios')

const base_url = 'http://localhost:8080'
const host = 'localhost'

module.exports = {
  mode: 'universal',

  env: {
    base_url: base_url,
    api_base_url: process.env.BASE_URL || 'https://api.lookformenu.com',
    title: '路可菜單網 look for menu~',
    description: '路可菜單網(look for menu)蒐集整理各種餐廳菜單、飲料店菜單、速食店菜單、早餐店菜單、咖啡廳菜單、便當菜單、DM菜單，方便查詢。',
    session: null
  },

  server: {
    port: 8080, // default: 3000
    host: host, // default: localhost
  },

  /*
  ** Headers of the page
  */
  head: {
    title: '路可菜單網 look for menu',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '路可菜單網(look for menu)蒐集整理各種餐廳菜單、飲料店菜單、速食店菜單、早餐店菜單、咖啡廳菜單、便當菜單、DM菜單，方便查詢。' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ffdf3b' },

  /*
  ** Global CSS
  */
  css: [
    '~/css/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-google-adsense', ssr: false },
    '~/plugins/axios'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    'cookie-universal-nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/component-cache',
    ['@nuxtjs/google-analytics', {
      id: 'UA-10504013-10',
      autoTracking: {
        pageviewOnLoad: false
      },
      debug: {
        sendHitTask: process.env.NODE_ENV === 'production'
      }
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: base_url + '/api'
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    publicPath: '/src/',
    cache: true,
    hardSource: true,
    parallel: true,
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },

  sitemap: {
    path: '/sitemap.xml',
    hostname: process.env.base_url,
    cacheTime: 1000 * 60 * 15,
    gzip: true,
    generate: false, // Enable me when using nuxt generate
    exclude: [
      '/admin/*',
      '/test',
    ],
    routes (callback) {
      axios.all([
        axios.get(base_url + '/api/query'),
        axios.get(base_url + '/api/label')
      ])
      .then(axios.spread((menu, label) => {
        let menu_routes = menu.data.menu.map(menu => '/menu/' + menu.id + '/')
        let label_routes = label.data.map(label => '/query/?labels=' + label.id)
        callback(null, menu_routes.concat(label_routes))
      })).catch(callback)
    }
  }
}
