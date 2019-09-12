<template>
  <div>
    <b-row class="mx-md-4 mx-0">
        <b-col class="mobile-col" cols="6" sm="6"  md="4" lg="3"
                v-for="(item,index) in $store.state.menu_list" :key="index"
                v-if="index<$store.state.limit">
            <div class="card mb-4">
              <div class="square">
                <!--<div v-if="item.first_img_filename==''"></div>
                <img v-else-if="index<10" @load="test" class="card-img-top pointer_img" :src="$config.api_base_url+'/public/thumbnail/'+item.first_img_filename"/>-->
                <router-link :to="'/menu/'+item.id+'/'">
                  <b-img-lazy v-if="item.fm!=''" class="card-img pointer_img" :src="item.img_domain + '/thumbnail/' + item.fm"/>
                </router-link>
              </div>
              <div class="card-body">
                  <h5>
                    <router-link :to="'/menu/'+item.id+'/'" class="black-link">
                      {{ item.store+(item.branch==""?"":"("+item.branch+")") }}
                    </router-link>
                  </h5>
                  <div class="float-left ml-3">
                    <star :menu_id="item.id" :menu_star="menu_star"></star>
                  </div>
                  <div class="float-right mr-3">
                    <router-link :to="'/menu/'+item.id" class="black-link">
                      <span class="mobile-hide">More</span>
                      <img src="~/assets/arrow-right.svg">
                    </router-link>
                  </div><br>
                  <div class="mt-2 float-none" style="height:2px;background-color:#ffdf3a;"></div>
              </div>
            </div>
        </b-col>
        <b-col v-if="$store.state.menu_total==0">
          <p style="font-size:28px;padding-top:18px;text-align:center;">
              尚無資料
              <br><br>
          </p>
        </b-col>
    </b-row>
    <b-row class="justify-content-md-center mx-md-5 mx-4" v-show="$store.state.limit < $store.state.menu_total">
        <b-col md="6">
            <button type="button" class="btn btn-outline-secondary" @click="load_more" style="width:100%;">
              載入更多
            </button>
        </b-col>
    </b-row>
  </div>
</template>

<script>
import Star from '~/components/Star.vue'

export default {
  components: {
    Star
  },
  data () {
    return {
      height: 0,
      msg: '載入中...',
      menu_star: [],
      api_base_url: process.env.api_base_url
    }
  },
  created () {
    this.menu_star = this.$cookies.get('menu-star')
  },
  methods: {
    setData (menu) {
      this.menu_items = menu
    },
    load_more () {
      this.$store.commit('set_add_limit')
    }
  },
  watch: {
    '$route' (to, from) {
    }
  }
}
</script>
