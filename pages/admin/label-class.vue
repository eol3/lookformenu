<template>
	<div>
		<form class="form-inline">
        <div class="form-group mb-2">
            <label class="mr-2">New Label Class</label>
            <input type="text" class="form-control mr-2" v-model="label_class_name">
            <b-button @click="add_label_class" variant="outline-success">Add</b-button>
        </div>
    </form>
    <br>
    
    <b-row>
        <b-col cols="11" md="6">
            <b-table hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" fixed="fixed">
                <template slot="name" slot-scope="row">
                    <input v-if="row.item.editable" v-model="row.item.name" @change="edit_change=true" size="5">
                    <span v-else>{{ row.item.name }}</span>
                </template>
                <template slot="actions" slot-scope="row">
                  <b-button v-if="row.item.editable" size="sm" variant="outline-success" @click="edit_label(row.item)">Finish</b-button>
                  <b-button v-else size="sm" variant="outline-success" @click="row.item.editable=true">Edit</b-button>
                </template>
            </b-table>
            <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
        </b-col>
    </b-row>
    <br>
    
    <b-button @click="$router.go(-1)">Back</b-button>
    <br><br><br>
	</div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  
  components: {
   
  },
  async asyncData ({store,redirect, $axios}) {
  	let res = await $axios.$get('/label_class/')
  	for(let i in res){
  		res[i].editable = false
  	}
  	return{
  		items: res,
  		totalRows: res.length,
  	}
  },
  data() {
    return{
    	fields: [
        {
          key: 'id',
          sortable: true,
          class:"id-head"
        },
        {
          key: 'name',
          sortable: true
        },
        {
          key:'actions'
        }
      ],
    	label_class_name:"",
      class_id:null,
      currentPage: 1,
      perPage: 5,
      edit_change:false
    }
  },
  methods: {
  	async add_label_class() {
  		if(this.label_class_name==""){
  			this.$store.commit('admin/set_msg', {
	        show: 5,
	        type: 'danger',
	        text: '新增失敗: 不能空白'
	      })
  		}
  		let res = await this.$axios.$post('/admin/label_class/',{
  			name: this.label_class_name
  		})
  		if(res.status){
  			this.items.push({
  				id: res.new_label_class_id,
  				name: this.label_class_name,
  				editable: false
  			})
	    	this.$store.commit('admin/set_msg', {
	        show: 5,
	        type: 'success',
	        text: '新增類別成功: ' + this.label_class_name
	      })
	    }
  	},
  	async edit_label(item){
	    if(!this.edit_change){
	        item.editable = false;
	        return;
	    }
	    let res = await this.$axios.$put('/admin/label_class/'+item.id, {name: item.name})
	    if(res.status){
	    	item.editable = false;
	    	this.edit_change = false
	    	this.$store.commit('admin/set_msg', {
	        show: 5,
	        type: 'success',
	        text: '編輯類別成功: ' + item.name
	      })
	    }
  	}
  }
}
</script>