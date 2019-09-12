<template>
	<div>
		<b-form inline>
        <label class="mr-sm-2">Select Class</label>
        <b-form-select v-model="class_id" :options="options" class="mr-sm-2"/>
    </b-form>
    <br>
    <b-row>
        <b-col cols="11" md="6">
            <b-table hover :items="items" :fields="fields" :current-page="currentPage" :per-page="perPage" fixed="fixed">
                <template slot="name" slot-scope="row">
                    <input v-if="row.item.editable" v-model="row.item.name" @change="edit_change=true" size="5">
                    <span v-else>{{ row.item.name }}</span>
                </template>
                <template slot="class_name" slot-scope="row">
                    <b-form-select v-if="row.item.editable" v-model="row.item.class_id" @change="edit_change=true" :options="options" size="sm"/>
                    <span v-else>{{ row.item.class_name }}</span>
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
  	let resitems = await $axios.$get('/admin/label/')
    let resclass = await $axios.$get('/admin/label_class/')
  	let options = [{value:0,text:'Please Select'}];
  	
  	for(var i=0;i<resclass.length;i++){
        var id = resclass[i].id;
        var name = resclass[i].name;
        options[i+1] = {value:id,text:name};
    }
    
    for(var i in resitems){
        resitems[i].editable = false;
    }
    
  	return{
  		items: resitems,
  		all_items: resitems,
      totalRows: resitems.length,
  		options: options
  	}
  },
  data() {
    return{
    	class_id: 0,
    	currentPage: 1,
      perPage: 7,
      filter:null,
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
          key: 'class_name',
          sortable: true
        },
        {
          key:'actions'
        }
      ],
    }
  },
  methods: {
  	async edit_label(item){
	    if(!this.edit_change){
	        item.editable=false;
	        return;
	    }
	    let res = await this.$axios.$put('/admin/label/'+item.id, {name: item.name, class_id: item.class_id})
	    if(res.status){
	    	item.editable = false;
	    	item.class_name = this.options[item.class_id].text
	    	this.edit_change = false
	    	this.$store.commit('admin/set_msg', {
	        show: 5,
	        type: 'success',
	        text: '編輯標籤成功: ' + item.name
	      })
	    }
  	},
  },
  watch:{
	  class_id(){
	      var class_id = this.class_id;
	      
	      this.items = this.all_items.filter(function (obj) { 
	          if(class_id==0)return true;
	          else return obj.class_id === class_id;
	      });
	      this.totalRows = this.items.length
	  },
  }
}
</script>