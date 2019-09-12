
export const state = () => ({
  api_base_url: 'https://api.lookformenu.com',
  base_url: process.env.base_url,
  counter: 333,
  documentHeight: 0,
  limit: 20,
  page_load: false,
  menu_list: [],
  menu_total: 0,
  label_list: [],
  class_label_list: [],
  class_label_selected_id: 1,
  reload: true,
  menu_path: '',
  menu_sort: '',
  multi_search: false,
  sc: '',
  usual_label: [],
  csrf_token: ''
})

export const mutations = {
  set_add_limit (state) {
    state.limit = state.limit + 20
  },
  set_init_limit (state) {
    state.limit = 20
  },
  set_page_load (state, val) {
    state.page_load = val
  },
  set_menu_list (state, val) {
    state.menu_list = val
  },
  set_menu_list_blank (state, len) {
    if(len>12)len = 11;
    for(var i=0;i<=len;i++){
      state.menu_list[i].first_img_filename = '';
      state.menu_list[i].store = '';
      state.menu_list[i].branch = '';
    }
  },
  set_menu_list_clear (state, val) {
    state.menu_list = []
    state.menu_total = 0
  },
  set_menu_total (state, val) {
    state.menu_total = val
  },
  set_label (state, val) {
    state.label_list = val
  },
  clear_label_select (state) {
    for (var key in state.label_list) {
      state.label_list[key].selected = false
    }
  },
  set_label_select (state, { key, val }) {
    state.label_list[key].selected = val
  },
  set_class_label (state, val) {
    state.class_label_list = val
  },
  set_class_label_selected_id (state, val) {
    state.class_label_selected_id = val
  },
  set_reload (state, val) {
    state.reload = val
  },
  set_menu_path (state, val) {
    state.menu_path = val
  },
  set_menu_sort (state, val) {
    state.menu_sort = val
    if (val === 'default') {
      state.menu_list.sort(function (a, b) { return b.id - a.id })
    } else if (val === 'rand') {
      state.menu_list.sort(function (a, b) { return Math.random() - 0.5 })
    } else if (val === 'update') {
      state.menu_list.sort(function (a, b) {
        return new Date(b.update_date.replace(' ', 'T')) - new Date(a.update_date.replace(' ', 'T'))
      })
    }
  },
  set_sc (state, val) {
    state.sc = val
  },
  set_multi_search (state, val) {
    state.multi_search = val
  },
  set_usual_label (state, val) {
    state.usual_label = val
  },
  set_csrf_token (state, val) {
    state.csrf_token = val
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.user === undefined) {
      commit('admin/set_auth', false) 
    } else {
      commit('admin/set_auth', req.session.user)
    }
    
    //set csrf
    commit('set_csrf_token', req.csrfToken())
  }
}