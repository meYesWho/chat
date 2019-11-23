<template>
  <div class="big">
    <van-swipe  :autoplay="3000" :loop="false" indicator-color="red">
      <van-swipe-item class="num1" touchable>
        <span class="num">第一步:点击设置按钮,进入页面</span>
        <img src="../../img/one.png" alt />
      </van-swipe-item>
      <van-swipe-item class="num2">
        <span class="num">第二步:点开权限管理</span>
        <img src="../../img/two.png" alt />
      </van-swipe-item>
      <van-swipe-item class="num3">
        <span class="num">第三步:开启锁屏通知</span>
        <img src="../../img/three.png" alt />
      </van-swipe-item>
    </van-swipe>
      <button @click="an" class="niu">我知道了</button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created(){
this.global.ws.onmessage = function(e) {
   const redata = JSON.parse(e.data);

}
  },
  methods: {
    an() {
      this.$router.replace({ path: "/" });
    }
  }
};
</script>
<style scoped>
.van-swipe{
    height: 100vh;
}
.big {
  width: 100vw;
  height: 100vh;
}
.num {
  font-size: 20px;
  color: black;
 font-family: SimSun
}
.num1 img {
  width: 100%;
  height: 95%;
}
.num2 img {
  width: 100%;
   height: 95%;
}
.num3 img {
  width: 100%;
   height: 95%;
}
.niu {
  width: 150px;
  height: 30px;
  border-radius: 20px;
  color: #fff;
  border: 2px solid #d5d5d5;
  text-align: center;
  background: #9e9e9e;
  display: block;
  margin: 0 auto;
  position: fixed;
    bottom: 10%;
    left: 30%;
}

</style>