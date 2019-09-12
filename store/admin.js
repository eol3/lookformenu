export const state = () => ({
  subTitle: '',
	adminAlert: {
	  show: 0,
	  type: '',
	  text: 'test',
	},
	auth:null,
	counter: 0,
	currentPage:1,
	index_filter:null,
	/*label:{},
	label_class:{}*/
	limit:10,
	class_id:1,
	height_postion:0,
	loadding: false
})

export const mutations = {
	increment (state) {
    state.counter++
  },
  set_subTitle(state,val){
    state.subTitle = val;
  },
  set_auth(state,val){
    state.auth = val;
  },
  set_loadding(state,val){
    state.loadding = val;
  },
  set_msg(state,val){
      state.adminAlert.show = val.show;
      state.adminAlert.type = val.type;
      state.adminAlert.text = val.text;
  },
  set_current_page(state,page){
    state.currentPage = page;
  },
  set_filter(state,filter){
    state.index_filter = filter;
  },
  set_add_limit(state){
    state.limit = state.limit + 10;
  },
  set_init_limit(state){
    state.limit = 10;
  },
  set_class_id(state,val){
    state.class_id = val;
  },
  set_height_position(state,val){
    state.height_postion = val;
    //console.log(val)
  }
}