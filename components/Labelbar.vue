<template>
    <div class="container py-3">
        <div class="label-row px-2">
          <b-button variant="outline-primary" v-for="item in $store.state.class_label_list" :key="item.id" class="mr-2 mb-2"
                :pressed="item.id==class_id" @click="select_label_class(item)">
                {{ item.name }}
            </b-button>
        </div>
        <div class="label-row px-2">
          <b-button variant="outline-success" v-for="(item, key) in $store.state.label_list" :key="key" class="mr-2 mb-2"
                v-show="item.class_id==class_id" v-bind:class="{ active: item.selected }" size="sm" @click="select_label(item, key)">
                {{ item.name }}
            </b-button>
        </div>
        <div class="label-row px-2">
          <div class="custom-control custom-checkbox custom-control-inline">
            <input type="checkbox" class="custom-control-input" id="multi_search_check" :checked="$store.state.multi_search" @click="change_multi_search">
            <label class="custom-control-label mr-2" for="multi_search_check">多選查詢</label>
            <router-link v-show="$route.query.s!==undefined || $route.query.labels!==undefined" to="/query/" @click.native="clear">清除查詢</router-link>
            <!--<a href="#!" @click="clear">清除查詢</a>-->
          </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'labelbar',
  data () {
    return {
      class_id: this.$store.state.class_label_selected_id
    }
  },
  created () {
  },
  methods: {
    change_multi_search () {
      this.$store.commit('set_multi_search', !this.$store.state.multi_search)
    },
    select_label_class (item) {
      this.class_id = item.id
      this.$store.commit('set_class_label_selected_id', item.id)
    },
    select_label (item, key) {
      if (!this.$store.state.multi_search) {
        this.$store.commit('clear_label_select')
        this.$store.commit('set_label_select', { key: key, val: true })
        this.$router.push({path: '/query/?labels=' + item.id})
      } else {
        var val = !this.$store.state.label_list[key].selected
        this.$store.commit('set_label_select', { key: key, val: val })
        var lids = ''
        for (key in this.$store.state.label_list) {
          if (this.$store.state.label_list[key].selected) {
            lids += this.$store.state.label_list[key].id + '-'
          }
        }
        lids = lids.substring(0, lids.length - 1)
        var sc = ''
        if (this.$store.state.sc !== '') {
          sc = '?s=' + this.$store.state.sc
        }
        if (lids === '') {
          this.$router.push({path: '/query/' + sc})
        } else if (sc === '') {
          this.$router.push({path: '/query/?labels=' + lids})
        } else {
          this.$router.push({path: '/query/' + sc + '&labels=' + lids})
        }
      }
    },
    clear () {
      this.$emit('clear_sc')
      this.$store.commit('clear_label_select')
    }
  }
}
</script>
