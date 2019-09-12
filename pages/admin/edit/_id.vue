<template>
  <div>
  	<b-form inline>
      <label class="mr-sm-2">Store Name:</label>
      <input type="text" class="form-control mr-2" v-model="form.store">
      <b-button variant="primary" @click="branch">New Branch</b-button>
    </b-form>
    <br>
    
    <b-form inline>
      <label class="mr-sm-2">Branch Store Name:</label>
      <input type="text" class="form-control mr-2" v-model="form.branch">
    </b-form>
    <br>
    
    <hr>
    <h5>Picture</h5>
    
    <b-form inline>
        <label class="mr-sm-2">Upload image:</label>
        <b-form-file v-model="images" class="form-control mb-2 mr-sm-2 mb-sm-0" @change="preview" style="width:250px;" plain multiple accept="image/*"></b-form-file>
        <!--<b-button variant="primary" @click="import_pic">Import</b-button>-->
    </b-form>
    <br>
    
    <b-row v-if="form.image.length!=0">
      <b-col md="6">
        <b-table hover :items="form.image" :fields="img_fields">
          <template slot="id" slot-scope="row">
            {{ row.item.id }}
          </template>
          <template slot="picture" slot-scope="row">
            <b-img-lazy rounded :src="row.item.data_url" width="100"/>
          </template>
          <template slot="option" slot-scope="row">
            <b-button size="sm" variant="outline-primary" @click="up(row.index)" :disabled="row.index==0">Up</b-button>
            <b-button size="sm" variant="outline-primary" @click="down(row.index)" :disabled="row.index==form.image.length-1">Down</b-button><br>
            <b-button size="sm" variant="outline-danger" @click="delete_img(row.index)">Delete</b-button>
          </template>
        </b-table>
      </b-col>
    </b-row>
    
    <label>Select Class</label>
    <div>
      <b-button variant="outline-primary" v-for="item in all_label_class" :key="item.id" class="mr-2 mb-2"
                :pressed="item.selected" @click="select_label_class(item)">
        {{ item.name }}
      </b-button>
    </div>
    
    <label>Select Label</label>
    <div>
      <b-button v-for="item in all_label" :key="item.id" variant="outline-success" class="mr-2 mb-2"
                v-if="item.class_id==class_id" :pressed="item.selected" size="sm" @click="select_label(item)">
        {{ item.name }}
      </b-button>
      <b-button v-else-if="class_id==-1" class="mr-2 mb-2" variant="outline-success" :pressed="item.selected" size="sm" @click="select_label(item)">{{ item.name }}</b-button>
    </div>
    <br>
    
    <div class="form-check" v-if="class_id==3">
      <input class="form-check-input" type="checkbox" v-model="save_address" id="defaultCheck1">
      <label class="form-check-label" for="defaultCheck1">
        存地址
      </label>
    </div>
    <br>
    
    <label>New Label</label>
    <b-form inline>
      <input type="text" class="form-control mr-2" v-model="label_name">
      <b-button variant="primary" @click="add_new_label">New Label</b-button>
    </b-form>
    <br>
    
    <b-form inline>
      <label>Address:<b-button variant="outline-primary" size="sm" @click="label_import">標籤帶入</b-button></label>
      <input type="text" class="form-control mr-2" v-model="form.address" size="40">
    </b-form>
    <br>
    
    <b-form inline>
      <label>Tel:</label>
      <input type="text" class="form-control mr-2" v-model="form.tel">
    </b-form>
    <br>
    
    <b-form inline>
      <label>FB Page:</label>
      <input type="text" class="form-control mr-2" v-model="form.fb_page" maxlength="512">
    </b-form>
    <br>
    
    <b-form inline>
      <label>Website:</label>
      <input type="text" class="form-control mr-2" v-model="form.website" maxlength="512">
    </b-form>
    <br>
    
    <label>Feature:</label>
    <b-form-textarea id="textarea1"
                     v-model="form.feature"
                     placeholder="Enter something"
                     :rows="1"
                     :max-rows="6">
    </b-form-textarea>
    <br>
    
    <label>Memo:</label>
    <b-form-textarea id="textarea1"
                     v-model="form.memo"
                     placeholder="Enter something"
                     :rows="2"
                     :max-rows="6">
    </b-form-textarea>
    <br>
    
    <b-button @click="onSubmit" variant="primary" class="mr-2 mb-2">Update Menu</b-button>
  	<b-button class="mr-2 mb-2" @click="$router.push({ path: '/admin/' })" variant="outline-success">返回</b-button>
  </div>
</template>

<script>

export default {
	layout: 'admin',
	middleware: 'auth',
  async asyncData ({params, store, $axios}) {
  	let resmenu = await $axios.$get('/admin/menu/' + params.id);
  	for(let i in resmenu.image){
  		resmenu.image[i]['data_url'] = resmenu.image[i].domain + '/images/' + resmenu.image[i].filename
  	}
  	let reslabel = await $axios.$get('/admin/label')
    var all_label = reslabel;
    for(var i in all_label){
        var obj = resmenu.label.find(function (obj) { return obj.label_id === all_label[i].id; });
        if(obj !== undefined){
          all_label[i].selected = true;
        }else all_label[i].selected = false;
    }
    
    let resclass = await $axios.$get('/admin/label_class')
    var all_label_class = resclass;
    all_label_class[0].selected= true;
    all_label_class.push({id:0,name:'No class'});
    all_label_class.unshift({id:-1,name:'All'});
    
  	return {
  		form: resmenu,
  		preview_imgs: resmenu.image,
  		all_label: all_label,
      all_label_class: all_label_class,
  	}
  },
  data() {
  	return{
  		images: [],	
  		img_fields:[{key: 'id'},{key: 'picture'},{key: 'option'}],
  		del_img: [],
  		class_id: 1,
  		label_name: '',
  		save_address: false
  	}
  },
  methods: {
  	branch(){
      this.$router.push({ path: '/branch/'+this.form.main_store_id })
    },
    async onSubmit() {
    	
    	this.$store.commit('admin/set_loadding', true)
    	
    	if(this.save_address){
        var address_str=this.form.address+"-";
        var label_id;
        for(var i in this.all_label){
          if(this.all_label[i].class_id==3 && this.all_label[i].selected){
            label_id = this.all_label[i].id;
            break;
          }
        }
        for(var i in this.all_label){
          if(this.all_label[i].class_id==5 && this.all_label[i].selected){
            address_str += this.all_label[i].id + "-"
            break;
          }
        }
        for(var i in this.all_label){
          if(this.all_label[i].class_id==6 && this.all_label[i].selected){
            address_str += this.all_label[i].id + "-"
            break;
          }
        }
        for(var i in this.all_label){
          if(this.all_label[i].class_id==7 && this.all_label[i].selected){
            address_str += this.all_label[i].id;
            break;
          }
        }
        
        let res = await this.$axios.$put('/admin/label/' + label_id + '/address', 
          { address: address_str },
          { progress: false })
    	}
    	
    	let formdata = new FormData()
      for(let i in this.form.image){
      	if(this.form.image[i].file !== undefined){
        	formdata.append('images', this.form.image[i].file);
        	delete this.form.image[i].data_url
      	}
      }
      this.form.selected_label = []
      for(let i in this.all_label){
        if(this.all_label[i].selected){
          this.form.selected_label.push(this.all_label[i])
        }
      }
      formdata.append('form', JSON.stringify(this.form));
      formdata.append('del_img', JSON.stringify(this.del_img))
      
      let res = await this.$axios.$put('/admin/menu/' + this.$route.params.id, formdata, { 
        'Content-Type': 'multipart/form-data',
        progress: false
      })
      if(res.status){
        this.$router.push('/admin/')
        //this.$store.commit('admin/set_loadding', false)
      }else{
        console.log(res)
      }
    },
    async preview(e) {
      let len = this.form.image.length
      for(var key in e.target.files){
        if(e.target.files[key].name === undefined)break
        let res = await this.readFileAsync(e.target.files[key])
        let obj = {
          'file': e.target.files[key],
          'data_url': res,
          'priority': len,
        }
        this.form.image.splice(len, 0, obj)
        console.log(this.form.image)
        len += 1
      }
    },
    up(index){
      let tmp = this.form.image[index-1]
      let tmp_priority = this.form.image[index-1].priority
      let priority = this.form.image[index].priority
      this.form.image[index-1] = this.form.image[index]
      this.form.image[index] = tmp
      this.$set(this.form.image, index, tmp)
      this.$set(this.form.image[index], 'priority', priority)
      this.$set(this.form.image[index-1], 'priority', tmp_priority)
    },
    down(index){
      let tmp = this.form.image[index+1]
      let tmp_priority = this.form.image[index+1].priority
      let priority = this.form.image[index].priority
      this.form.image[index+1] = this.form.image[index]
      this.form.image[index] = tmp
      this.$set(this.form.image, index, tmp)
      this.$set(this.form.image[index], 'priority', priority)
      this.$set(this.form.image[index+1], 'priority', tmp_priority)
    },
    delete_img(index){
      // let obj = this.form.image[index]
      // console.log(this.form.image[index])
      if(this.form.image[index].id !== undefined){
        this.del_img.push(this.form.image[index]) 
      }
      this.form.image.splice(index, 1)
      
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
    async add_new_label(){
      if(this.label_name==''){
        this.$store.commit('admin/set_msg', {
          show: 5,
          type: 'danger',
          text: '新增失敗:不能空白'
        })
        return
      }
      if(this.class_id==-1){
        this.$store.commit('admin/set_msg', {
          show: 5,
          type: 'danger',
          text: '新增失敗:必須選擇類別'
        })
        return
      }
      let res = await this.$axios.$post('/admin/label/', {
        class_id: this.class_id,
        name: this.label_name,
      })
      this.$store.commit('admin/set_msg', {
        show: 5,
        type: 'success',
        text: '新增標籤成功: ' + this.label_name
      })
      this.all_label.push({
        class_id: this.class_id,
        id: res.new_label_id,
        name: this.label_name,
        selected: false,
        address: ''
      })
    },
    select_label(item){
      item.selected=!item.selected;
      if(item.address!=""){
        var obj = item.address.split('-')
        if(item.selected){
          this.form.address=obj[0];
          for(var i in this.all_label){
            if(this.all_label[i].id==obj[1] || this.all_label[i].id==obj[2] || this.all_label[i].id==obj[3]){
              this.all_label[i].selected=true;
            }
          }
        }else{
          this.form.address="";
          for(var i in this.all_label){
            if(this.all_label[i].id==obj[1] || this.all_label[i].id==obj[2] || this.all_label[i].id==obj[3]){
              this.all_label[i].selected=false;
            }
          }
        }
      }
    },
    select_label_class(item){
      for(var key in this.all_label_class){
        this.all_label_class[key].selected=false
      }
      item.selected=true;
      this.class_id = item.id
    },
    label_import(){
      this.form.address = this.get_label_address();
    },
    get_label_address(){
      var str="";
      for(var i in this.all_label){
          if(this.all_label[i].class_id == 5){
            if(this.all_label[i].selected){
              str += this.all_label[i].name;
              break;
            }
          }
      }
      for(var i in this.all_label){
          if(this.all_label[i].class_id == 6){
            if(this.all_label[i].selected){
              str += this.all_label[i].name;
              break;
            }
          }
      }
      for(var i in this.all_label){
          if(this.all_label[i].class_id == 7){
            if(this.all_label[i].selected){
              str += this.all_label[i].name;
              break;
            }
          }
      }
      return str
    }
  }
}
</script>