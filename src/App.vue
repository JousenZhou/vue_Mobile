<template>
  <div id="app" >
    <router-view/>
    <p>fly请求测试</p>
    <p>当前ip地址:【{{ip}}】</p>
    <p>当前位置:【{{location}}】</p>
  </div>
</template>
<script>
  import {testApi} from "./api/api";
  export default {
    data(){
      return{
          location:'',
          ip:''
      }
    },
    mounted() {
      testApi({}).then(res=>{
        res=res.replace('var returnCitySN = ','');
        res=res.replace(';','');
        res=JSON.parse(res);
        this.location = res['cname'];
        this.ip = res['cip'];
      })
    }
  }
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

p{
  height: 20px;
  font-size: 14px;
  color: salmon;
  &:first-of-type{
    color: #2c3e50;
  }
}
</style>
