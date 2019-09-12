<template>
  <div>
  	<b-row class="justify-content-md-center mx-md-4">
      <b-col md="10" sm="12">
        <div class="menu-img-wrap" v-if="img_items.length!=0">
          <div style="margin:10px;display: inline-block;" v-for="(item,index) in img_items" :key="item.id">
              <img style="width:260px;" class="rounded pointer_img"
                  :src="item.domain+'/tmp/'+item.filename"
                  @click="show(index)">
          </div>
        </div>
        <h3>{{ menu.store }}</h3>
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
                    {{ menu.fb_page }}
                  </a>
                </td>
            </tr>
            <tr v-show="menu.website!=''">
                <td class="text-center">官方網站</td>
                <td>
                  <a target="_blank" :href="menu.website">
                    {{ menu.website }}
                  </a>
                </td>
            </tr>
            <tr v-show="menu.memo!=''">
                <td class="text-center">備註</td>
                <td><span v-html="menu.memo"></span></td>
            </tr>
          </tbody>
        </table>
        <center>
          <button class="btn btn-primary" @click="onReview">確認審核</button>
          <button type="button" class="btn btn-outline-secondary" @click="back">返回</button>
          <button class="btn btn-warning" @click="reject">駁回</button>
        </center>
      </b-col>
    </b-row>
    <viewer :options="options" @inited="inited" ref="viewer">
      <img v-for="item in img_items" style="display:none;" :key="item.id" :src="item.domain+'/tmp/'+item.filename">
    </viewer>
  </div>
</template>

<script>
import Viewer from "v-viewer/src/component.vue"

export default {
	layout: 'admin',
	middleware: 'auth',
	components: {
    Viewer
  },
  async asyncData ({params, store, $axios}) {
  	let resmenu = await $axios.$get('/admin/menu/suggest/' + params.id);
    
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
    
  	return {
  		menu: resmenu,
  		img_items: resmenu.image,
  		options: options
  	}
  },
  data() {
  	return{
  		images: [],	
  		img_fields:[{key: 'id'},{key: 'picture'},{key: 'option'}],
  		del_img: [],
  	}
  },
  methods: {
  	async onReview(){
      // this.$router.push({ path: '/branch/'+this.form.main_store_id })
      this.$store.commit('admin/set_loadding', true)
      let res = await this.$axios.$put('/admin/menu/suggest/' + this.menu.id + '/review/')
      this.$store.commit('admin/set_loadding', false)
      if(!res.status) alert('error!')
      this.$store.commit('admin/set_msg', {
        show: 5,
        type: 'success',
        text: '審核成功'
      })
      this.$router.push('/admin/review/')
    },
    async reject() {
      let res = await this.$axios.$put('/admin/menu/suggest/' + this.menu.id + '/reject/')
      if(!res.status) alert('error!')
      this.$store.commit('admin/set_msg', {
        show: 5,
        type: 'warning',
        text: '駁回成功'
      })
      this.$router.push('/admin/review/')
    },
    inited (viewer) {
      this.$viewer = viewer;
    },
    show (index) {
      this.$viewer.view(index);
      this.$viewer.show(3);
    },
    back () {
      this.$router.go(-1)
    },
  }
}
</script>