<template>
  <div>
  	
    <b-row align-h="center">
      <b-col cols="12" md="5">
        <h2>{{ title }}</h2>
      </b-col>
    </b-row>
    
    <b-row align-h="center">
      <b-col cols="12" md="5">
        <form>
          <div class="form-group">
            <label for="exampleFormControlInput1">Acoount:</label>
            <input type="text" class="form-control" v-model="account">
          </div>
          <div class="form-group">
            <label for="exampleFormControlInput1">Password:</label>
            <input type="password" class="form-control" v-model="password">
          </div>
          <b-button type="button" @click="login" variant="primary">Login</b-button>
        </form>
      </b-col>
    </b-row>
    <br>
    
  </div>
</template>

<script>
export default {
	layout: 'admin',
	loading: false,
	data() {
    return{
      title : '登入 - 管理後台',
      account:null,
      password:null,
      showloader:false,
      windowHeight: 0,
      scrolltop:50,
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
  methods: {
    async login(){
      //this.$nuxt.$loading.start()
      this.$store.commit('admin/set_loadding', true)
    	let result = await this.$axios.$post('/user/login', {
    		'account': this.account,
    		'password': this.password
    	}, { progress: false })
    	if (result.laginStatus == 1) {
    	  this.$store.commit('admin/set_auth', this.account)
    	  this.$router.push('/admin/')
    	  
    	} else {
    	  alert('login fail')
    	}
    }
  }
}
</script>