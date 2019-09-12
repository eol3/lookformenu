<template>
    <div v-if="$store.state.admin.loadding" :style="'height:'+windowHeight+'px'" class="loader">
        <p v-if="parent_show=='error'" style="text-align:center;">
            <br>
            載入失敗，請重新整理頁面
        </p>
      <div v-else class="loader-inner" :style="'margin-top:'+scrolltop+'px;'" ></div>
    </div>    
</template>

<script>
export default {
    props: ['parent_show'],
    data () {
        return{
            showloader:false,
            windowHeight: 500,
            scrolltop:50
        }
    },
    methods:{
        show(){
            this.setvalue();
            this.showloader = true;
        },
        hide(){
            this.showloader = false;
        },
        setvalue(){
            if (process.browser) {
                let that = this;
                this.$nextTick(function(event) {
                    that.scrolltop = window.scrollY + 50;
                    if(window.innerHeight > document.body.clientHeight){
                        that.windowHeight = window.innerHeight;
                    }else that.windowHeight = document.body.clientHeight;
                })
            }
        }
    },
    created:function (){
        this.setvalue();
    },
    mounted() {
        this.$store.watch(
            (state) => state.admin.loadding,
            (newValue, oldValue) => {
                if (newValue) {
                   this.setvalue() 
                }
            },
        );
    },
}
</script>

<style>
  .loader{
    position:absolute;
    top:0;
    left:0;
    background-color:#f8f9fa;
    width:100%;
    height:100vh;;
    z-index:9999;
    opacity:0.95;
  }
  .loader-inner {
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid #FFDE3D; /* Blue */
    border-radius: 50%;
    margin:10% auto;
    width: 130px;
    height: 130px;
    animation: spin 2s linear infinite;
  }
</style>