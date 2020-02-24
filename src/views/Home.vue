<template>
    <div class="home">
<!--        <img alt="Vue logo" src="../assets/logo.png">-->
        <p><span>fly.js</span><span>omiv(Store)</span></p>
    </div>
</template>

<script>
  import fly from "../components/fly";
  import omiv from "../components/omiv";
    export default {
        name: 'home',
        components: {fly,omiv}
    }
</script>
<style lang="scss" scoped>
  .home {
    >p{
      width: 60vw;
      height: 30px;
      background: rgba(0, 0, 0, 0.22);
      display: flex;
      margin: 0 auto;
      line-height: 30px;
      span{
        flex: 1;
        &:nth-of-type(1){
          background: rgba(0, 0, 0, 0.73);
          color: wheat;
        }
      }
    }
  }
</style>
