<template>
  <!-- 公用头部组件 -->
  <div class="header">
    <mt-header :title="title"   fixed>
      <router-link to slot="left" v-show="isleft">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
  </div>
</template>

<script>
export default {
  name: "headertit",
  props: {
    title: String,
    isleft: false
  },
  data() {
    return {
    };
  }
};
</script>

<style>
.header {
  width: 100vw;
  /* height: 50px;
  background: #303133 !important; */
}

.message{
  margin-top: 64px;
}
.mint-header {
  height: 50px !important;
  background: #303133 !important;
}
.mint-header-title {
  text-align: left;
  padding: 10px 0;
  font-size: 20px !important;
}
.mint-header-button {
  flex: 0 !important;
}
.mintui{
  font-size: 30px !important;
}
</style>

