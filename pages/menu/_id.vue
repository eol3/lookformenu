<template>
  <div>
    <br>
    <b-row class="justify-content-md-center mx-md-4">
        <b-col md="7" lg="8" sm="12">
            <div class="menu-img-wrap" v-if="img_items.length!=0">
              <div style="margin:10px;display: inline-block;" v-for="(item,index) in img_items" :key="item.id">
                  <img style="width:260px;" class="rounded pointer_img"
                      :src="item.domain+'/images/'+item.filename"
                      @click="show(index)">
              </div>
            </div>
            <div style="text-align:center;font-size:16px;margin-bottom:0.5rem;margin-top:0.25rem">
              <i>點擊圖片可查看原始大小圖片</i>
            </div>
                <h3>
                  {{ full_store }}
                  <star :menu_id="menu.id" :menu_star="menu_star" :big="true"></star>
                </h3>
                <p v-html="menu.feature"></p>
                <label v-show="menu_label_items.length!=0">分類標籤：</label>
                <b-button variant="outline-success" v-for="item in menu_label_items" :key="item.id" class="mr-2 mb-2"
                    size="sm" @click="$router.push('/query/?labels='+item.label_id)">
                    {{ item.label_name }}
                </b-button>
                <br>
                <table class="table table-bordered">
                  <tbody>
                    <tr v-show="menu.branch!=''">
                        <td class="text-center">分店</td>
                        <td>{{ menu.branch }}</td>
                    </tr>
                    <tr v-show="menu.address!=''">
                        <td class="w-25 text-center">地址</td>
                        <td class="w-75">
                          {{ menu.address }}
                          <a :href="'https://www.google.com.tw/maps/place/'+menu.address" target="_blank">
                            <img src="~/assets/google-maps.png" title="在Google Maps開啟">
                          </a>
                        </td>
                    </tr>
                    <tr v-show="menu.tel!=''">
                        <td class="text-center">電話</td>
                        <td>
                          <a :href="'tel:'+menu.tel">
                            {{ menu.tel }}
                          </a>
                        </td>
                    </tr>
                    <tr v-show="menu.fb_page!=''">
                        <td class="text-center">粉絲專頁</td>
                        <td>
                          <a target="_blank" :href="menu.fb_page">
                            點此開啟連結
                          </a>
                        </td>
                    </tr>
                    <tr v-show="menu.website!=''">
                        <td class="text-center">官方網站</td>
                        <td>
                          <a target="_blank" :href="menu.website">
                            點此開啟連結
                          </a>
                        </td>
                    </tr>
                    <tr v-show="menu.memo!=''">
                        <td class="text-center">備註</td>
                        <td><span v-html="menu.memo"></span></td>
                    </tr>
                  </tbody>
                </table>
                <p style="font-size:14px">
                  註:所有資訊以實際店家為主(<router-link to="/about/">瞭解詳情</router-link>)<br>
                  <i>
                    最後更新於&nbsp;{{menu.update_date | formatDate}}
                  </i>
                </p>
                <br>
            <center>
              <Adsense
                  data-ad-client="ca-pub-2899968580738465"
                  data-ad-slot="5325212590">
              </Adsense>
              <br>
              <button type="button" class="btn btn-outline-secondary" @click="back" style="width:80%;">
                  <img src="~/assets/arrow-left.svg">
                  返回上一頁
              </button>
            </center>
            <br><br>
            <h4 class="ml-2">相關菜單</h4>
            <div class="ml-2 mr-2" style="height:2px;background-color:#ffdf3a;"></div>
            <br>
            <b-row class="mx-md-1 mx-2">
              <b-col v-for="(item,index) in relate_menu" cols="6" lg="3" :key="index" class="mobile-col">
                <div class="square">
                  <router-link :to="'/menu/'+item.id+'/'" class="black-link">
                    <b-img-lazy style="width:100%" :src="item.img_domain+'/thumbnail/'+item.fm"/>
                  </router-link>
                </div>
                <h5 class="mt-2 ml-2">
                  <router-link :to="'/menu/'+item.id+'/'" class="black-link">
                    {{ item.store+(item.branch==""?"":"("+item.branch+")") }}
                  </router-link>
                  <star :menu_id="item.id" :menu_star="menu_star"></star>
                </h5>
              </b-col>
            </b-row>
        </b-col>
        <b-col md="5" lg="4" sm="12">
          <br class="mobile-show">
          <br class="mobile-show">
          <h4 class="ml-2">今日推薦</h4>
          <div class="ml-2 mr-2" style="height:2px;background-color:#ffdf3a;"></div>
          <div v-for="(item,index) in day_menu" style="padding:7% 14% 1% 14%;" :key="index">
            <div class="square">
              <router-link :to="'/menu/'+item.id+'/'">
                <b-img-lazy class="card-img-top pointer_img" :src="item.img_domain+'/thumbnail/'+item.fm"/>
              </router-link>
            </div>
            <h5 class="mt-2 ml-2">
              <router-link :to="'/menu/'+item.id+'/'" class="black-link">
                {{ item.store+(item.branch==""?"":"("+item.branch+")") }}
              </router-link>
              <star :menu_id="item.id" :menu_star="menu_star"></star>
            </h5>
          </div>
          <Adsense
              data-ad-client="ca-pub-2899968580738465"
              data-ad-slot="5325212590">
          </Adsense>
        </b-col>
    </b-row>
    <br><br>
    <viewer :options="options" @inited="inited" ref="viewer">
      <img v-for="item in img_items" style="display:none;" :key="item.id" :src="item.domain+'/images/'+item.filename">
    </viewer>
  </div>
</template>

<script>
import Star from '~/components/Star.vue'
import 'viewerjs/dist/viewer.css'
import Viewer from "v-viewer/src/component.vue"

export default {
  name: 'menu-id',
  components: {
    Star, Viewer
  },
  async asyncData ({ params,redirect,store, $axios }) {
    
    let resmenu = await $axios.$get('/menu/'+params.id)
    
    var i,keywords="";
    for(i in resmenu.label){
      keywords += resmenu.label[i].label_name+","
    }
    
    var options={};
    if(resmenu.image.length>1){
      options={toolbar: {
        prev: 1,
        reset: {
          show: 1,
          size: 'large',
        },
        next:1
      },title:0}
    }else{
      options={toolbar: 0,navbar:false,title:0}
    }
    
    return{
        full_store:resmenu.store+(resmenu.branch==""?"":"("+resmenu.branch+")"),
        menu:resmenu,
        img_items:resmenu.image,
        menu_label_items:resmenu.label,
        relate_menu:resmenu.relate_menu,
        day_menu:resmenu.day_menu,
        head_keywords:keywords,
        client_render:false,
        options:options
    };
  },
  data () {
    return {
      loaded: false,
      menu_star: [],
      description: '路可菜單網(look for menu)蒐集整理各種餐廳菜單、飲料店菜單、速食店菜單、早餐店菜單、咖啡廳菜單、便當菜單、DM菜單，方便查詢。'
    }
  },
  head () {
    return {
      title: this.menu.store+" | 路可菜單網 look for menu",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property:'url', content: 'https://www.lookformenu.com'+this.$route.fullPath },
        { name: 'keywords', content: this.head_keywords },
        { hid: 'description', name: 'description', content: '有關'+this.full_store+'的菜單，和店家其他資訊。'+this.description },
        { property:'og:title', content: this.menu.store+' | 路可菜單網 look for menu' },
        { property:'og:url', content: 'https://www.lookformenu.com'+this.$route.fullPath },
        { property:'og:image', content: process.env.baseUrl+'/public/thumbnail/'+this.menu.first_img_filename },
        { property:'og:image:width', content: this.img_items[0].width },
        { property:'og:image:height', content: this.img_items[0].height },
        { property:'og:description', content: '有關'+this.menu.store+'的菜單，和店家其他資訊。'+this.description }
      ]
    }
  },
  created () {
    if(process.client){
      this.menu_star = this.$cookies.get('menu-star')
      this.set_cookie()
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
      // this.$store.commit('set_reload', false)
    },
    inited (viewer) {
      this.$viewer = viewer;
    },
    show (index) {
      this.$viewer.view(index);
      this.$viewer.show(3);
    },
    set_cookie () {
      var menuHistory = this.$cookies.get('menu-history')
      if (menuHistory === undefined || menuHistory === null) {
        this.$cookies.set('menu-history', this.menu.id, {path: '/',maxAge: 60 * 60 * 24 * 7})
      } else {
        var mobj = menuHistory.toString().split('-')
        var checkDouble = false
        for (var i = 0; i < mobj.length; i++) {
          if (mobj[i] === this.menu.id) {
            mobj.splice(i, 1)
            mobj.splice(0, 0, this.menu.id)
            checkDouble = true
            break
          }
        }
        if (mobj.length > 50) {
          mobj.splice(50, 10)
        }
        if (!checkDouble) {
          mobj.splice(0, 0, this.menu.id)
        }
        menuHistory = ''
        for (var key in mobj) {
          menuHistory += mobj[key] + '-'
        }
        menuHistory = menuHistory.substring(0, menuHistory.length - 1)
        this.$cookies.set('menu-history', menuHistory, {path: '/',maxAge: 60 * 60 * 24 * 7})
      }
    }
  },
  filters: {
    formatDate (dateString) {
      var date = new Date(dateString.replace(' ', 'T'))
      var day = date.getDate()
      var monthIndex = parseInt(date.getMonth()) + 1
      var year = date.getFullYear()
      return year + '-' + monthIndex + '-' + day
    }
  },
}
</script>

