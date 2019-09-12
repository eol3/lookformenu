<template>
    <div class="gotop" @click="scroll" title="移至頂端" v-if="show">
      <img src="~/assets/arrow-up-circle.svg">
    </div>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      windowHeight: 500,
      scrolltop: 50
    }
  },
  methods: {
    scroll () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    handleScroll (event) {
      if (process.browser) {
        if (window.scrollY > 400) {
          this.show = true
        } else {
          this.show = false
        }
      }
    }
  },
  created: function () {
    let that = this
    if (process.browser) {
      this.$nextTick(function (event) {
        window.addEventListener('scroll', that.handleScroll)
      })
    }
  }
}
</script>

<style>
.gotop{
  cursor: pointer;
  position:fixed;
  bottom:0px;
  right:0px;
  text-align:center;
  width:60px;
  height:60px;
  padding-top:12px;
}
@media (max-width: 768px) {
  .gotop{
    width:48px;
    height:48px;
    padding-top:6px;
  }
}
</style>
