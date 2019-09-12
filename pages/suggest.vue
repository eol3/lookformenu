<template>
    <div>
        <br>
        <div class="row justify-content-center">
            <div class="col col-lg-6 col-md-8 col-10">
            	<h3>提交建議菜單</h3>
            </div>
        </div>
        <br>
        <div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">店家名稱:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.store">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">分店名稱:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.branch">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">選擇圖片:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<b-form-file v-model="images" class="form-control mb-2 mr-sm-2 mb-sm-0" ref="myFiles" @change="preview" style="width:250px;" plain multiple accept="image/*"></b-form-file>
							<div class="row" v-if="preview_imgs.length!=0">
								<div class="col-4 col-lg-3" v-for="(item, index) in preview_imgs" style="margin-top:6px">
									<span @click="delete_img(index)" class="close-icon"></span>
									<img :src="item.data_url" width="100%">
								</div>
							</div>
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">地址:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.address">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">電話:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.tel">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">Facebook 粉絲專頁:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.fb_page" maxlength="512">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">店家網址:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<input type="text" class="form-control" v-model="form.fb_page" maxlength="512">
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">特色描述:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<b-form-textarea id="textarea1"
						                     v-model="form.feature"
						                     placeholder="Enter something"
						                     :rows="1"
						                     :max-rows="6">
						    </b-form-textarea>
						</div>
				</div>
				<br>
				<div class="row justify-content-center">
            <div class="col col-lg-2 col-12 text-center">
							<p class="suggest-form-label">備註:</p>
						</div>
						<div class="col col-lg-6 col-12">
							<b-form-textarea id="textarea1"
						                     v-model="form.memo"
						                     placeholder="Enter something"
						                     :rows="2"
						                     :max-rows="6">
						    </b-form-textarea>
						</div>
				</div>
				<br>
        <div class="row justify-content-center">
        	<div class="col-4">
        		<button class="btn btn-primary" :disabled="disabled_button" @click="onSubmit">確認提交</button>
        	</div>
        </div>
        <br><br>
    </div>
</template>

<script>

export default {
  name: 'suggest',
  components: {
  },
  data () {
    return {
      title: '提交建議菜單 | 路可菜單網 look for menu',
      form: {
        store: '',
        branch:'',
        feature:'',
        address:'',
        tel:'',
        fb_page:'',
        website:'',
        memo:'',
      },
      disabled_button: false,
      images: null,
      preview_imgs: []
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { vmid: 'description', name: 'description', content: process.env.description },
        {'property': 'url', content: process.env.base_url + '/suggest/'},
        {'property': 'og:title', 'content': this.title},
        {'property': 'og:description', 'content': process.env.description},
        {'property': 'og:image', 'content': process.env.base_url + '/assets/Logo.png' },
        {'property': 'og:image:width', content: 300 },
        {'property': 'og:image:height', content: 300 },
        {'property': 'og:url', 'content': process.env.base_url + '/suggest/'}
      ]
    }
  },
  created () {
  },
  methods: {
  	async onSubmit() {
  	  
  		if(this.form.store==''){
  			alert('店家名稱不能空白')
  			return
  		}
  		
  		this.disabled_button = true
  		this.$store.commit('admin/set_loadding', true)
  		
  		let formdata = new FormData()
  		formdata.append('form', JSON.stringify(this.form))
  		for(let i in this.preview_imgs){
        formdata.append('images', this.preview_imgs[i].file);
      }
  		
  		let res = await this.$axios.$post('/menu/suggest/', formdata, { 
        'Content-Type': 'multipart/form-data'
      })
      if(res.status){
      	alert('提交成功！')
      	this.$store.commit('admin/set_loadding', false)
        this.$router.push('/')
      }else{
        console.log(res)
      }
  	},
  	async preview(e) {
      let len = this.preview_imgs.length
      for(var key in e.target.files){
        if(e.target.files[key].name === undefined)break
        let res = await this.readFileAsync(e.target.files[key])
        let obj = {
          'file': e.target.files[key],
          'data_url': res,
          'priority': key,
        }
        this.preview_imgs.splice(len, 0, obj)
        len += 1
      }
    },
    delete_img(index){
      this.preview_imgs.splice(index, 1)
    },
  	readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
    
        reader.onload = () => {
          resolve(reader.result);
        };
    
        reader.onerror = reject;
    
        reader.readAsDataURL(file);
      })
    },
  }
}
</script>
