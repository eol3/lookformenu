<template>
  <div>
    <!--<br>
    <labelbar :p_class_id="p_class_id"></labelbar>-->
    <breadbar :show="bread_show" :items="bread_items"></breadbar>
    <menulist></menulist>
  </div>
</template>

<script>
import axios from 'axios';
import Labelbar from '~/components/Labelbar.vue'
import Breadbar from '~/components/Breadbar.vue'
import Menulist from '~/components/Menulist.vue'

export default {
  name: 'Query',
  components: {
    Menulist, Breadbar, Labelbar
  },
  async asyncData ({ store, params, route, query, $axios }) {
    if (store.state.menu_path !== route.fullPath) {
      let resmenu = await $axios.$get(route.fullPath)
      store.commit('set_menu_list', resmenu.menu)
      store.commit('set_menu_total', resmenu.menu.length)
      store.commit('set_menu_path', route.fullPath)
    }
    if (store.state.label_list.length === 0) {
      let resclass = await $axios.$get('/label_class')
      store.commit('set_class_label', resclass)
      let reslabel = await $axios.$get('/label/')
      for (var i in reslabel) {
        reslabel[i].selected = false
      }
      store.commit('set_label', reslabel)
    }

    var head_keywords = '', lidArr = [], key=0, selected_class = false, p_class_id = 1

    if(query.s === undefined && query.labels === undefined){
      for(key in store.state.label_list) {
        head_keywords += store.state.label_list[key].name + ','
        store.commit('set_label_select', { key: key, val: false })
      }
    }else if(query.s !== undefined && query.labels === undefined){
      head_keywords += query.s + ','
      store.commit('set_sc', query.s)
      store.commit('set_multi_search', false)
    }else if(query.labels !== undefined){
      if(query.s !== undefined){
        head_keywords += query.s + ','
        store.commit('set_sc', query.s)
        store.commit('set_multi_search', true)
      }
      lidArr = query.labels.split('-').map( Number );
      if (lidArr.length > 1){
        store.commit('set_multi_search', true)
      }
      for(key in store.state.label_list) {
        if (lidArr.indexOf(store.state.label_list[key].id) !== -1) {
          store.commit('set_label_select', { key: key, val: true })
          head_keywords += store.state.label_list[key].name + ','
          if(!selected_class){
            store.commit('set_class_label_selected_id', store.state.label_list[key].class_id)
            selected_class = true
          }
        }else{
          store.commit('set_label_select', { key: key, val: false })
        }
      }
    }

    head_keywords = head_keywords.substring(0, head_keywords.length - 1)

    var bread_items = [{text: '首頁', to: '/'}, {text: '分類查詢', to: '/query/'}], title = ''
    if (query.s === undefined && query.labels === undefined) {
      bread_items.splice(2, 1)
      title = '分類查詢'
    } else {
      title = head_keywords
      if (bread_items.length === 2) {
        bread_items.splice(2, 0, {text: head_keywords})
      } else {
        bread_items.splice(2, 1, {text: head_keywords})
      }
    }

    return {
      title: title,
      bread_items: bread_items,
      p_class_id: p_class_id,
      head_keywords: head_keywords
    }
  },
  data () {
    return {
      description: '依照各種分類標籤或輸入關鍵字，查詢相關菜單。' + process.env.description,
      menu_loaded: false,
      bread_show: true
    }
  },
  head () {
    return {
      title: this.title + ' | 路可菜單網 look for menu',
      meta: [
        { property:'url', content: process.env.base_url + '/query/' },
        { hid: 'description', name: 'description', content: this.description },
        { name: 'keywords', content: this.head_keywords },
        { property:'og:title', content: this.title + ' | 路可菜單網 look for menu' },
        { property:'og:url', content: process.env.base_url + '/query/' },
        { property:'og:image', content: process.env.base_url + '/assets/Logo.png' },
        { property:'og:image:width', content: 300 },
        { property:'og:image:height', content: 300 },
        { property:'og:description', content: this.description }
      ]
    }
  },
  methods: {
    get_menu_by_label: async function () {
      let resmenu = await this.$axios.$get(this.$route.fullPath)
      this.$store.commit('set_menu_list', resmenu.menu)
      this.$store.commit('set_menu_total', resmenu.menu.length)
      this.$store.commit('set_menu_path', this.$route.fullPath)
    },
    check_label () {
      if (this.$route.query.s === undefined && this.$route.query.labels === undefined) {
        this.bread_items.splice(2, 1)
        this.title = '分類查詢'
        return
      }
      this.head_keywords = ''
      if (this.$route.query.s !== undefined) {
        this.head_keywords += this.$route.query.s + ','
        this.$store.commit('set_sc', this.$route.query.s)
      }
      var lidArr = []
      if (this.$route.query.labels !== undefined) {
        lidArr = this.$route.query.labels.split('-').map( Number );
        for (var key in this.$store.state.label_list) {
          if (lidArr.indexOf(this.$store.state.label_list[key].id) !== -1) {
            this.$store.commit('set_label_select', { key: key, val: true })
            this.head_keywords += this.$store.state.label_list[key].name + ','
          } else {
            this.$store.commit('set_label_select', { key: key, val: false })
          }
        }
      } else {
        this.$store.commit('clear_label_select')
      }
      this.head_keywords = this.head_keywords.substring(0, this.head_keywords.length - 1)
      this.title = this.head_keywords
      if (this.bread_items.length === 2) {
        this.bread_items.splice(2, 0, {text: this.head_keywords})
      } else {
        this.bread_items.splice(2, 1, {text: this.head_keywords})
      }
    }
  },
  watch: {
    '$route' (to, from) {
      var len = this.$store.state.menu_list.length -1
      this.$store.commit('set_menu_list_blank', len)
      this.get_menu_by_label()
      this.check_label()
    }
  }
}
</script>
