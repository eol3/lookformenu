<template>
    <div>
      <breadbar :show="bread_show"></breadbar>
      <menulist></menulist>
    </div>
</template>

<script>
import Breadbar from '~/components/Breadbar.vue'
import Menulist from '~/components/Menulist.vue'

export default {
  components: {
    Menulist, Breadbar
  },
	async asyncData ({ store, params, $axios }) {
		let resmenu = await $axios.$get('/menu/1');
    console.log(resmenu.image)
	},
	data () {
    return {
      bread_show: false
    }
  },
  created() {
  }
}
</script>