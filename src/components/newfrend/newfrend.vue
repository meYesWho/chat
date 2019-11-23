<template>
  <div class="shao">
    <mt-header title="新的朋友" class="new-top">
      <router-link to="/friend" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <ul class="new-con">
      <li v-for="(item,i) in newFriend" :key="i" >
        <div class="new-c">
          <img :src="item.avatar" alt />
          <span>{{ item.nickname }}</span>
        </div>
        <p v-if="item.type=='get' & item.status==2" class="ionBtn" v-html="htmlText" @click="choseFriend($event,item.fid,item.friend_status)">
        </p>
        <p v-else-if="item.type=='send' & item.status==2">待验证</p>
        <p v-else-if="item.type=='send' & item.status==1">已通过</p>
        <p v-else-if="item.type=='send' & item.status==0">对方已拒绝</p>
        <p v-else-if="item.type=='get' & item.status==1">已同意</p>
        <p v-else-if="item.type=='get' & item.status==0">已拒绝</p>
      </li>
    </ul>
  </div>
</template>

<script>
import animate from "animate.css";
export default {
  inject:['reload'],
  data() {
    return {
      newFriend: [
        {
          avatar: require("../../img/show1.jpg"),
          newName: "大二老阿姨",
          friend_status: 0
        }
      ],
      htmlText:
        '<button style="color: #fff;margin: 0 0 0 5px;padding:5px 15px;border-radius: 15px;border: 1px solid rgb(76, 59, 177);background: rgb(76, 59, 177);outline: none;">同意</button><button style="color: #fff;margin: 0 0 0 5px;padding:5px 15px;border-radius: 15px;border: 1px solid rgb(76, 59, 177);background: rgb(76, 59, 177);outline: none;">拒绝</button>',
      showBtn: true
    };
  },
  computed: {},
  methods: {
    list() {
      console.log(this.global.isopen);
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({ url:"newFriend", data: { uid: a, page: 1 } })
      );
    },
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.global.ws.send(agentData);
    },
    choseFriend(e,id,status){
      let childrenList=[];
      if(e.target.innerText=='同意'){
        // friendverification?uid=**&fid=**
          this.htmlText='已同意'
          const a = parseInt(localStorage.getItem("uid"));
          this.websocketsend(
              JSON.stringify({ url: "friendverification", data: { uid: a, fid: id ,status:status} })
          );
          this.reload()
      }else if(e.target.innerText=='拒绝'){
          // friendRefuse?uid=**&id=**
          this.htmlText='已拒绝'
          const a = parseInt(localStorage.getItem("uid"));
          this.websocketsend(
              JSON.stringify({ url: "friendRefuse", data: { uid: a, fid: id} })
          );
           this.reload()
      }
    }
  },
  created() {    
    const friend_id = this.$route.params.friend_id;
    var that = this;
     var username = that.$route.params.username;
    that.username = username;
    status(friend_id)
    this.global.ws.onmessage = function(e) {
      //数据接收
     const redata = JSON.parse(e.data);
       let arr = redata.data.data;
       if (redata.data.url == "sendfriendText" || redata.data.url == "sendrootMessage"){
         let origin_id = arr.origin_id;
         let uid = arr.uid;
         let nick = arr.fnick;
         let favatar = arr.favatar;
         if(uid!=that.a && arr.type==1){
           arr.origin_id=uid;
         }
         if(arr.type==2){
           arr.origin_id = "r"+arr.origin_id;
         }
         if(uid==that.a){
           arr.usernick=nick;
           arr.useravatar = favatar;
         }
        arr["status"]=1;
        delete arr.favatar;
        delete arr.fnick;
        //delete arr.userid;
        console.log(arr)
        that.global.saveSqllite([arr]).then(function(data) {
          that.global.selectmessage().then(function(data) {
            console.log(12321321);
            that.list = data.reverse();
            console.log(JSON.stringify(data));
          });
        });
         var d = new Date();
          // 获取年，getFullYear()返回4位的数字
          var year = d.getFullYear();
          // 获取月，月份比较特殊
          var month = d.getMonth() + 1;
          // 变成两位
          month = month < 10 ? "0" + month : month;
          // 获取日
          var day = d.getDate();
          //时
          var h = d.getHours();
          h = h < 10 ? "0" + h : h;
          //分
          var m = d.getMinutes();
          m = m < 10 ? "0" + m : m;
          //秒
          var s = d.getSeconds();
          s = s < 10 ? "0" + s : s;
          day = day < 10 ? "0" + day : day;
          var timeData =
            year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
          // tongzhi(timeData, redata.data.data.msgtext);
        
      }
      // console.log(redata.data.data)
      that.newFriend = redata.data.data.newfriends;
      console.log(redata);
    };
    if (this.global.ws.readyState == 0) {
      this.global.ws.onopen = function() {
        that.list();
      };
    } else {
      this.list();
    }
  }
};
</script>

<style scoped>
.shao{
  position: absolute;
  top: 0;
  width: 100%;
  background: #fff;
}
.new-top {
  background-color: #26a2ff;
}

.new-con {
  width: 100%;
}

.new-con > li {
  width: 100%;
  overflow: hidden;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.new-con > li > .new-c {
  display: flex;
  align-items: center;
}

.new-con > li > .new-c > img {
  display: block;
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
}

.new-con > li > .new-c > span {
  color: #333;
}

.new-con > li > p {
  color: #555;
}
.ionBtn button {
  color: #fff;
  margin: 0 0 0 5px;
  padding: 5px 15px;
  border-radius: 15px;
  border: 1px solid rgb(76, 59, 177);
  background: rgb(76, 59, 177);
  outline: none;
}
</style>