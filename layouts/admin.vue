<template>
	<b-container>
	  <b-alert class="alert-fixed" 
	    :show="$store.state.admin.adminAlert.show"
	    dismissible
	    :variant="$store.state.admin.adminAlert.type"
      @dismiss-count-down="countDownChanged"
      @dismissed="clearAlert">
	    {{ $store.state.admin.adminAlert.text + '。(' + dismissCountDown + ')' }}
	  </b-alert>
		<h2>
		  <router-link to="/admin/">
		    管理後台
		  </router-link>
		  {{ subTitle }}
		</h2>
    <nuxt/>
    <loader></loader>
  </b-container>
</template>

<script>
import Loader from '~/components/Loader.vue'

export default {
  components: {
    Loader
  },
	data() {
    return{
      title : '管理後台',
      subTitle: '',
      dismissCountDown: 0
    }
  },
  created() {
      //if (this.$store.state.admin.subTitle === '') return ''
      //else return ' - ' + this.$store.state.admin.subTitle
  },
	head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: this.title }
      ]
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    clearAlert(){
      this.dismissCountDown=0
      this.$store.commit('admin/set_msg', {
        show: 0,
        type: '',
        text: ''
      })
    }
  },
  watch: { 
   '$route.path'() {
      const path = this.$route.path
      //console.log(path)
      switch (path) {
        case '/admin/':
          this.subTitle = ''
          break;
        case '/admin/new/':
          this.subTitle = ' - 新增菜單'
          break;
        case '/admin/edit/':
          this.subTitle = ' - 編輯菜單'
          break;
        case '/admin/label-class/':
          this.subTitle = ' - 類別管理'
          break;
        case '/admin/label/':
          this.subTitle = ' - 標籤管理'
          break;
        case '/admin/review/':
          this.subTitle = ' - 審核菜單'
          break;
      }
    }
  }
}
</script>