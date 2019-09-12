<template>
    <div>
      <breadbar :show="bread_show"></breadbar>
      <menulist></menulist>
    </div>
</template>

<script>
import axios from 'axios';
import Breadbar from '~/components/Breadbar.vue'
import Menulist from '~/components/Menulist.vue'
import Pageloading from '~/components/Pageloading.vue'
//test
export default {
  components: {
    Menulist, Breadbar, Pageloading
  },
  async asyncData ({ store, params, $axios }) {
    
    if (store.state.menu_path !== '/query/') {
      let resmenu = await $axios.$get('/query')
      store.commit('set_menu_list', resmenu.menu)
      store.commit('set_menu_total', resmenu.menu.length)
      store.commit('set_menu_path', '/query/')
    }
    if (store.state.usual_label.length === 0) {
      let res = await $axios.$get('/label/usual')
      store.commit('set_usual_label', res)
    }
  },
  data () {
    return {
      bread_show: false
    }
  },
  head () {
    return {
      meta: [
        { property:'url', content: process.env.base_url },
        { hid: 'description', name: 'description', content: process.env.description },
        { property:'og:title', content: '路可菜單網 look for menu' },
        { property:'og:url', content: process.env.base_url },
        { property:'og:image', content: process.env.base_url + '/assets/Logo.png' },
        { property:'og:image:width', content: 300 },
        { property:'og:image:height', content: 300 },
        { property:'og:description', content: process.env.description }
      ]
    }
  },
  created () {
  }
}
</script>

<style>

</style>
