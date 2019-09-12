<template>
    <b-row class="mx-md-4 mt-2 mb-2 justify-content-between align-items-center">
        <b-col cols="12" :md="md_num" :lg="lg_num">
            <div v-if="show" class="px-2 py-1">
              <b-breadcrumb :items="items" style="background-color:white;margin-bottom:0;"/>
            </div>
            <div v-else class="px-2 py-3">
              常用分類：
              <span v-for="(item,index) in $store.state.usual_label" :key="index">
                <router-link :to="'query/?labels='+item.id">{{item.name}}</router-link>
                <span v-if="index!=$store.state.usual_label.length-1">,</span>
              </span>
              ...<router-link to="/query/">所有分類</router-link>
            </div>
        </b-col>
        <b-col cols="12" :md="cmd_num" :lg="clg_num" v-if="center">
          <div class="center" style="text-align:center" v-if="$store.state.menu_total>0">
            <button type="button" class="btn btn-link" @click="clear" v-if="center">{{ link }}</button>
          </div>
        </b-col>
        <b-col cols="12" md="6" lg="4">
            <div class="input-group input-group-sm sort-bar mt-1" v-if="$store.state.menu_total>0">
              <div class="input-group-prepend" style="background-color:white;">
                <span class="input-group-text">排序</span>
              </div>
              <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-outline-secondary" @click="sort_default">預設</button>
                <button class="btn btn-outline-secondary" @click="sort_rand">隨機</button>
                <button class="btn btn-outline-secondary" @click="sort_update">更新日期</button>
              </div>
            </div>
        </b-col>
    </b-row>
</template>

<script>
export default {
  props: ['show', 'items', 'info', 'center', 'link'],
  data () {
    return {
      md_num: 6,
      cmd_num: 1,
      lg_num: 7,
      clg_num: 1
      /* bread_show: true,
      items: [{
        text: 'Admin',
        href: '#'
      }, {
        text: 'Manage',
        href: '#'
      }, {
        text: 'Library',
        active: true
      }],
      bread_info: 'xxx' */
    }
  },
  created () {
    if (this.center) {
      this.md_num = 4
      this.cmd_num = 2
      this.lg_num = 4
      this.clg_num = 4
    }
  },
  methods: {
    sort_default () {
      this.$store.commit('set_menu_sort', 'default')
    },
    sort_rand () {
      this.$store.commit('set_menu_sort', 'rand')
    },
    sort_update () {
      this.$store.commit('set_menu_sort', 'update')
    },
    getRndInteger (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    clear () {
      if (this.link === '清除星號標記') {
        this.$cookies.remove('menu-star')
        this.$store.commit('set_menu_list_clear')
      } else if (this.link === '清除瀏覽紀錄') {
        this.$cookies.remove('menu-history')
        this.$store.commit('set_menu_list_clear')
      }
    }
  }
}
</script>

<style>
    .sort-bar{
        width:14rem;
        float:right;
    }
    @media (max-width: 768px) {
        .sort-bar{
          float:none;
          margin:0 auto;
        }
    }
</style>
