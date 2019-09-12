<template>
  <div class="headbar">
  <b-navbar toggleable="md">
    <b-container>
      <router-link class="navbar-brand" to="/">
        <img src="~assets/Logo.png" width="30" height="30" clas-s="d-inline-block align-top" alt="Logo">
        路可菜單網
      </router-link>
      <b-navbar-toggle target="nav_collapse" class="mb-1"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse" v-model="showCollapse">
        <b-navbar-nav>
          <li class="nav-item">
            <router-link class="nav-link" to="/feature/">特色精選</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/query/">分類查詢</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/star/">星號標記</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/history/">瀏覽紀錄</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/suggest/">建議菜單</router-link>
          </li>
        </b-navbar-nav>
      </b-collapse>
      <div class="input-group search-input ml-auto">
          <input type="text" class="form-control input-lg" v-model="sub_sc" @keyup="enter" placeholder="Search" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="search">
              <img src="~assets/search.svg">
            </button>
          </div>
      </div>
    </b-container>
  </b-navbar>
  <labelbar v-if="showLablebar" @clear_sc="clear_sc"></labelbar>
  </div>
</template>

<script>
import Labelbar from '~/components/Labelbar.vue'

export default {
  name: 'headbar',
  props: ['showLablebar'],
  components: {
    Labelbar
  },
  data () {
    return {
      sub_sc: this.$store.state.sc,
      showCollapse: false
    }
  },
  created () {
  },
  methods: {
    enter (e) {
      if (e.keyCode === 13) this.search()
    },
    search () {
      if (this.$store.state.multi_search) {
        if (this.$route.query.labels === undefined) {
          var labels = ''
        } else {
          labels = '&labels=' + this.$route.query.labels
        }
        var p = '/query/' + '?s=' + this.sub_sc + labels
        this.$router.push({path: p})
      } else {
        this.$router.push({path: '/query/?s=' + this.sub_sc})
      }
    },
    clear_sc () {
      this.sub_sc = ''
    }
  }
}
</script>
