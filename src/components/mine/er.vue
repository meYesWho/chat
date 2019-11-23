<template>
  <div class="zong">
    <headertit title="分享" isleft="true"/>
    <!-- <router-link to="/mine" slot="left">
      <mt-button icon="back"></mt-button>
    </router-link> -->
    <div class="ma">
      <div class="nu">
        <img src="http://qr.liantu.com/api.php?text=http://lc.sitedown.top/api/api/download
" alt />
        <div class="num">
          <span class="num1">192.168.31.244</span>
          <span class="num2">http://192.168.31.244</span>
        </div>
      </div>
      <div class="weixin">
        <img src="http://qr.liantu.com/api.php?text=http://lc.sitedown.top/api/api/download
" alt />
        <span class="sao">使用微信扫一扫</span>
      </div>
    </div>
    <!-- <div class="btn">
      <div class="btn1">复制链接</div>
      <div class="btn2">保存图片</div>
    </div> -->
  </div>
</template>
<script>
import headertit from "../../components/header/header";
export default {
  components: {
    headertit
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.zong {
  background: #eeeeee;;
  width: 100vw;
  height: 85vh;
  overflow: hidden;
}
.ma {
  width: 350px;
  height: 320px;
  background: #ffffff;
  margin: 85px auto;
  position: relative;
}
.nu {
  display: flex;
  margin: 0 15px;
  position: absolute;
  top: 5%;
}
.nu img {
  width: 50px;
  height: 50px;
}
.num {
  margin-left: 10px;
}
.num .num1 {
  font-size: 17px;
  font-weight: bold;
  display: block;
}
.num .num2 {
  font-size: 13px;
  color: black;
  position: absolute;
  margin-top: 12px;
}
.weixin {
  margin: 0 auto;
  text-align: center;
  margin-top: 50px;
  width: 150px;
}
.weixin img {
  width: 100%;
  margin-top: 112px;
}
.btn {
  margin: 15px 12px;
}
.btn .btn1 {
  width: 160px;
  height: 36px;
  border: 2px solid #26a2ff;
  border-radius: 7px;
  float: left;
  text-align: center;
  line-height: 32px;
  color: #26a2ff;
}
.btn .btn2 {
  width: 160px;
  height: 36px;
  border: 2px solid #26a2ff;
  border-radius: 7px;
  float: right;
  background: #26a2ff;
  color: #ffffff;
  text-align: center;
  line-height: 32px;
}
</style>