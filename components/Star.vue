<template>
    <span v-if="big">
        <img @click="cancel_star" v-if="active" style="width:2rem;cursor: pointer;" src="~/assets/star-active.png">
        <img @click="active_star" v-else style="width:2rem;cursor: pointer;" src="~/assets/star.png">
    </span>
    <span v-else>
        <img @click="cancel_star" v-if="active" class="star-img" src="~/assets/star-active.png">
        <img @click="active_star" v-else class="star-img" src="~/assets/star.png">
    </span>
</template>

<script>
export default {
  props: ['menu_id', 'menu_star', 'big'],
  data () {
    return {
      active: false
      // m_id: this.menu_id
    }
  },
  created () {
    if (this.menu_star === undefined) return
    var mobj = this.menu_star.toString().split('-')
    var index = mobj.indexOf(this.menu_id.toString())
    if (index > -1) {
      this.active = true
    }
  },
  methods: {
    active_star () {
      this.active = true
      var menuStar = this.$cookies.get('menu-star')
      if (menuStar === undefined || menuStar === '') {
        this.$cookies.set('menu-star', this.menu_id, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      } else {
        var mobj = menuStar.toString().split('-')
        var checkDouble = false
        for (var i = 0; i < mobj.length; i++) {
          if (mobj[i] === this.menu_id) {
            mobj.splice(i, 1)
            mobj.splice(0, 0, this.menu_id)
            checkDouble = true
            break
          }
        }
        if (mobj.length > 50) {
          mobj.splice(50, 10)
        }
        if (!checkDouble) {
          mobj.splice(0, 0, this.menu_id)
        }
        menuStar = ''
        for (var key in mobj) {
          menuStar += mobj[key] + '-'
        }
        menuStar = menuStar.substring(0, menuStar.length - 1)
        this.$cookies.set('menu-star', menuStar, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7
        })
      }
    },
    cancel_star () {
      this.active = false
      var menuStar = this.$cookies.get('menu-star')
      if (menuStar === undefined) return
      var mobj = menuStar.toString().split('-')
      var index = mobj.indexOf(this.menu_id)
      if (index > -1) {
        mobj.splice(index, 1)
      }
      menuStar = ''
      for (var key in mobj) {
        menuStar += mobj[key] + '-'
      }
      if (mobj.length > 0) {
        menuStar = menuStar.substring(0, menuStar.length - 1)
      }
      this.$cookies.set('menu-star', menuStar, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      })
    }
  }
}
</script>
