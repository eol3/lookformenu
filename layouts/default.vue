<template>
  <div>
    <headbar :showLablebar="showLablebar"></headbar>
    <b-container>
        <nuxt/>
        <footerbar></footerbar>
        <gotop></gotop>
    </b-container>
    <loader></loader>
  </div>
</template>

<script>
import Headbar from '~/components/Headbar.vue'
import Gotop from '~/components/Gotop.vue'
import Footerbar from '~/components/Footerbar.vue'
import Loader from '~/components/Loader.vue'

export default {
  name: 'Index',
  components: {
    Headbar, Gotop, Footerbar, Loader
  },
  data () {
    return {
      showLablebar: false
    }
  },
  created () {
    this.check_route()
  },
  mounted () { 
  },
  methods: {
    check_route(){
      if(this.$route.fullPath.indexOf("query")>=1){
        this.showLablebar = true
      } else {
        this.showLablebar = false
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.check_route()
    }
  }
}
</script>
