<template>
  <div>
    <breadbar :show="bread_show" :items="bread_items" :center="true" :link="link_name"></breadbar>
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
  async asyncData ({ store, app, $axios }) {
    const menuStar = app.$cookies.get('menu-star')
    if(menuStar === undefined || menuStar === ''){
     store.commit('set_menu_list', [])
     store.commit('set_menu_total', 0)
     store.commit('set_menu_path', '/star/')
     return
   } else {
      let resmenu = await $axios.$get('/menu/?history=' + menuStar)
      store.commit('set_menu_list', resmenu)
      store.commit('set_menu_total', resmenu.length)
      store.commit('set_menu_path', '/star/' + menuStar)
    }
  },
  data () {
    return {
      title: '星號標記 | 路可菜單網 look for menu',
      description: '在這裡可以查閱用星號標記過的菜單。' + process.env.description,
      menu_loaded: false,
      bread_show: true,
      link_name: '清除星號標記',
      bread_items: [{text: '首頁', href: '/'}, {text: '星號標記', href: '/star/'}]
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { vmid: 'description', name: 'description', content: this.description },
        {'property': 'url', content: process.env.base_url + '/star/'},
        {'property': 'og:title', 'content': this.title},
        {'property': 'og:description', 'content': this.description},
        {'property': 'og:image', 'content': process.env.base_url + '/assets/Logo.png' },
        {'property': 'og:url', 'content': process.env.base_url + '/star/'}
      ]
    }
  },
  methods: {
  }
}
</script>
