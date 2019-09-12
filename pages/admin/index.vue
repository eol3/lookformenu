<template>
  <div>
    <div class="row">
      <div class="col-12">
        <b-form inline>
          <b-button class="mr-2 mb-2" @click="$router.push({ path: '/admin/new/' })" variant="outline-success">新增菜單</b-button>
          <b-button class="mr-2 mb-2" @click="$router.push({ path: '/admin/review/' })" variant="outline-primary">審核菜單</b-button>
          <b-button class="mr-2 mb-2" @click="$router.push({ path: '/admin/label/' })" variant="primary">標籤管理</b-button>
          <b-button class="mr-2 mb-2" @click="$router.push({ path: '/admin/label-class/' })" variant="primary">類別管理</b-button>
          <input type="text" class="form-control mr-2 mb-2" v-model="filter" placeholder="Search">
          <b-button class="mr-2 mb-2" @click="clear_search" variant="outline-primary">清除搜尋</b-button>
          <b-button class="mr-2 mb-2" @click="logout" variant="outline-primary">登出</b-button>
          <a target="_blank" href="https://www.lookformenu.com/">前台首頁</a>
        </b-form>
      </div>
    </div>
    <div>
      <b-table hover 
          :items="items" 
          :fields="fields"
          :filter="filter" 
          @filtered="onFiltered" 
          :current-page="currentPage" 
          :per-page="perPage">
        <template slot="actions" slot-scope="row">
          <b-button size="sm" variant="outline-success" @click="edit(row.item.id)">Edit</b-button>
          <b-button size="sm" variant="outline-primary" @click="preview(row.item.id)">Preview</b-button>
        </template>
        <template slot="used" slot-scope="row">
          <b-button size="sm" variant="link" @click="hide_or_push(row.item)">
            {{ row.item.used==1?"停用":"啟用"}}
          </b-button>
          <b-button size="sm" variant="link" @click="mark_feature(row.item)">
            {{ row.item.mark_feature==1?"取消":"精選"}}
          </b-button>
        </template>
        <template slot="store" slot-scope="row">
          {{ row.item.store+(row.item.branch==""?"":"("+row.item.branch+")") }}
        </template>
        <template slot="update_date" slot-scope="row">
          {{ row.item.update_date  | formatDate }}
        </template>
      </b-table>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" v-on:input="change_page" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials=true;

const indexs = [];

export default {
  layout: 'admin',
  middleware: 'auth',
  loading: false,
  components: {
   
  },
  async asyncData ({context,route,store,redirect, $axios}) {
    store.commit('admin/set_subTitle', '')
    let menu_list = await $axios.$get('/admin/menu/')
    return {
      items: menu_list,
      totalRows: menu_list.length
    }
  },
  data() {
    return{
      title : '管理後台',
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'id',
          sortable: true
        },
        {
          key:'actions'
        },
        {
          key: 'used',
          sortable: false
        },
        {
          key: 'store',
          sortable: true
        },
        {
          key: 'update_by',
          label: 'User',
          sortable: true
        },
        {
          key: 'update_date',
          sortable: true
        }
      ],
      filter: null
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.title }
      ]
    }
  },
  created () {
    this.$store.commit('admin/set_loadding', false)
  },
  filters: {
    formatDate:function(date_string){
      var date = new Date(date_string)
      var day = date.getDate();
      var monthIndex = parseInt(date.getMonth())+1;
      var year = date.getFullYear();
      
      return year + '-' + monthIndex + '-' + day;
    }
  },
  methods: {
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      //this.currentPage = 1
    },
    change_page () {
      // this.$store.commit('set_current_page',this.currentPage)
    },
    clear_search(){
      this.filter = null
    },
    edit: function(val){
      this.$router.push({ path: '/admin/edit/'+val })
    },
    async logout(){
      let result = await this.$axios.$post('/user/logout')
      this.$store.commit('admin/set_auth', null)
      this.$router.push('/admin/login')
    },
    hide_or_push(item){
      let change_used = true
      if(item.used) change_used = false
      else change_used = true
      let res = this.$axios.$put('/admin/menu/'+item.id+'/used/', {used: change_used})
      item.used = change_used
      this.$store.commit('admin/set_msg', {
        show: 5,
        type: 'success',
        text: (change_used) ? '啟用成功' : '停用成功'
      })
    },
    mark_feature(item){
      let change_feature = true
      if(item.mark_feature) change_feature = false
      else change_feature = true
      let res = this.$axios.$put('/admin/menu/'+item.id+'/feature/', {feature: change_feature})
      item.mark_feature = change_feature
      this.$store.commit('admin/set_msg', {
        show: 5,
        type: 'success',
        text: (change_feature) ? '精選成功' : '取消成功'
      })
    }
  }
}
</script>
