<template>
  <div>
    <br>
    <b-table hover 
        :items="items" 
        :fields="fields"
        :filter="filter" 
        @filtered="onFiltered" 
        :current-page="currentPage" 
        :per-page="perPage">
      <template slot="actions" slot-scope="row">
        <b-button size="sm" variant="outline-success" @click="review(row.item.id)">審核</b-button>
      </template>
      <template slot="used" slot-scope="row">
        <span v-if="row.item.used==1" class="text-success">已審核</span>
        <span v-else-if="row.item.used==0">未審核</span>
        <span v-else-if="row.item.used==-1" class="text-warning">駁回</span>
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
    let menu_list = await $axios.$get('/admin/menu/suggest/')
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
    review(val){
      this.$router.push({ path: '/admin/review/'+val })
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
