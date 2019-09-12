<template>
  <div>
    <breadbar :show="bread_show" :items="bread_items"></breadbar>
    <menulist></menulist>
  </div>
</template>

<script>
import axios from 'axios';
import Breadbar from '~/components/Breadbar.vue'
import Menulist from '~/components/Menulist.vue'

export default {
  name: 'Index',
  components: {
    Menulist, Breadbar
  },
  async asyncData ({ store, params, $axios }) {
    if (store.state.menu_path !== '/feature/') {
      let resmenu = await $axios.$get('/query/feature')
      store.commit('set_menu_list', resmenu)
      store.commit('set_menu_total', resmenu.length)
      store.commit('set_menu_path', '/feature/')
    }
  },
  data () {
    return {
      title: '特色精選 | 路可菜單網 look for menu',
      description: '挑選一些較具有特色的店家菜單。' + process.env.description,
      menu_loaded: false,
      bread_show: true,
      bread_items: [{text: '首頁', href: '/'}, {text: '特色精選', href: '/feature/'}]
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { property:'url', content: process.env.base_url + '/feature/' },
        { hid: 'description', name: 'description', content: this.description },
        { property:'og:title', content: this.title },
        { property:'og:url', content: process.env.base_url + '/feature/' },
        { property:'og:image', content: process.env.base_url + '/assets/Logo.png' },
        { property:'og:image:width', content: 300 },
        { property:'og:image:height', content: 300 },
        { property:'og:description', content: this.description }
      ]
    }
  }
}
</script>
