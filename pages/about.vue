<template>
    <div>
        <br>
        <div class="row justify-content-center">
            <div class="col col-lg-6 col-md-8 col-10">
                <h3>關於我們</h3>
                <br>
                <p>&nbsp;&nbsp;&nbsp;關於這個網站，成立目的在於，蒐集整理各種店家的菜單，方便大家查詢，資料來源均來自其他網路，
                或網友提供，與店家無任何合作關係，如有資訊錯誤均以店家實際狀況為主，
                若要回報錯誤訊息，可到我們<a href="https://www.facebook.com/lookformenu/">粉絲團私訊我們</a>，謝謝。</p>
                <br>
            </div>
        </div>
        <br>
    </div>
</template>

<script>

export default {
  name: 'about',
  components: {
  },
  data () {
    return {
      title: '關於我們 | 路可菜單網 look for menu',
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { vmid: 'description', name: 'description', content: process.env.description },
        {'property': 'url', content: process.env.base_url + '/about/'},
        {'property': 'og:title', 'content': this.title},
        {'property': 'og:description', 'content': process.env.description},
        {'property': 'og:image', 'content': process.env.base_url + '/assets/Logo.png' },
        {'property': 'og:image:width', content: 300 },
        {'property': 'og:image:height', content: 300 },
        {'property': 'og:url', 'content': process.env.base_url + '/about'}
      ]
    }
  },
  created () {
  }
}
</script>
