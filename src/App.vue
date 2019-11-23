<template>
  <div class="container">
   <keep-alive include="friend,mine">
 <router-view v-if="isRouterAlive" />
     </keep-alive>
    <tabbar v-if="$route.meta.footShow" />
    <!-- <my-audio></my-audio> -->
  </div>
</template>

<script>
import ReconnectingWebSocket from 'reconnecting-websocket';
import tabbar from "./components/tabbar/tabbar";
export default {
  provide (){
     return {
       reload:this.reload
     }
  },
  data() { 
    return {
       isRouterAlive:true
    };
  },
  created() {
  if(localStorage.getItem("uid")!=null && !(this.global.ws.readyState)){
      this.localSocket();
    }
 },
  methods:{
    reload (){
       this.isRouterAlive = false
       this.$nextTick(function(){
          this.isRouterAlive = true
       })
    },
    websocketonopen(e) {
      console.log(e);
      const a = parseInt(localStorage.getItem("uid"));
      if(a){
          this.global.ws.send(JSON.stringify({url:"joingroup",data:{uid:a}}))
      //  setInterval(() => {
      //      console.log(2222)
      //         this.global.ws.send("ping")
      //   }, 2000);
      console.log("WebSocket连接成功");
      }
    },
    localSocket() {
      let that = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        that.ws = new ReconnectingWebSocket("ws://104.202.61.194:7272");
        that.global.setWs(that.ws);
        that.global.ws.onopen = that.websocketonopen();
        that.global.openDB();
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
  },
  components: {
     name: "App",
    tabbar: tabbar,
  
  }
  // watch:{
  //   $router(e){
  //     if(e.name=='Login'){
  //       this.tabtype=false;
  //     }else if(e.name=='Rege'){
  //       this.tabtype=false;
  //     }else {
  //       this.tabtype=true;
  //     }
  //   }
  // }
};
</script>




<style>

html,
body {
  margin: 0;
  width: 100vw;
  /* height: 100vh; */
}
input{
  background:none;  
    outline:none;  
    border:none;
    -webkit-appearance: none;

}
.container{
  overflow-x: hidden;
}
li{
  list-style: none;
}
.app-login {
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-image: url(./assets/bgc.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
}
.from {
  width: 80%;
}
.colorgreen{
  background: #5fb878 !important;
   word-wrap: break-word; 
   word-break: break-word;
}
.colorwhite{
  background: #fff !important;
  color:black !important;
  word-wrap: break-word;
  word-break: break-word;
}




/* 聊天样式 */
.emotin {
  height: auto;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 40px;
  z-index: 999;
  background: #fff;
  display: none;
  margin-bottom: 16px;
}
.emotin-show {
  display: block;
}
.emotin-none {
  display: none;
}
.img-display1 {
  display: none;
}
.img-display2 {
  display: inline-block;
}
.img-display3 {
  display: inline-block;
}
.img-display4 {
  display: none;
}
.chat-content p {
  /* background: #4c3bb1; */
  border-radius: 13px;
  max-width: 170px;
  height: auto;
  line-height: 27px;
  color: #fff;
  padding: 10px;
  font-size: 15px;
}


.chat-send,.chat-first {
  /* display: flex;
  justify-content: flex-start; */
  align-items: center;
  margin-bottom: 10px;
}

.bobo {
  display: flex;
  margin-top: 10px;
}
.boboTime {
  text-align: center;
}
.boboTime span {
  padding: 3px;
  color: #989494;
  border-radius: 3px;
}
.chat-send > .bobo {
  justify-content: flex-start;
}
.chat-first > .bobo {
  justify-content: flex-end;
}
.chat-content .bobo>img {
  width: 48px;
  height: 48px;
  border-radius: 15%;
  margin: 0 8px;
}

.content-r p {
  flex: right;
}

.chat-top {
  width: 100%;
  height: 40px;
  overflow: hidden;
  background-color:#08c261;
  position: relative;
}

.chatop-r {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.chat-top > p {
  float: left;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}

.chatop-l {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.chat-fooder {
     width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px #f5f5f5 solid;
    position: fixed;
    /* bottom: 0; */
    /* top: 60px; */
    bottom: 0;
}
.chat-bot {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    justify-content: space-around;
    -webkit-justify-content: space-around;
    align-items: center;
    -webkit-align-items: center;
}
#chatimg > img {
  margin-top: 5px;
  
}

.chat-bot > img {
  width: 34px;
  height: 34px;
}

.chat-bot #chatimg > img {
  width: 40px;
  height: 40px;
  margin-right:4px; 
}

.chat-content {
  width: 100%;
  height: auto;
  position: relative;
  top: 50px;
  bottom: 50px;
  overflow: scroll;
 
}

.chat-content.time {
  width: 100%;
  position: absolute;
  top: -20px;
  text-align: center;
}
.chat-content p img {
  vertical-align:middle;
  max-width: 100%;
}
.cdh{
     width: 48px;
    /* height: 100%; */
    /* top: 30px; */
    position: relative;
  
}
.tu-img {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top:8px;
    z-index: -1;
}
.tu{
  height: 20px;
  margin-left:10px; 
}
.van-overlay {
  background: #000;
}
</style>
