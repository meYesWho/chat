<template>
  <div class="friend">
    <audio id="audios" type="audio/mp3">
      <source :src="sss" />
    </audio>
    <headertit title="好友" />
    <div class="showicon">
      <ul class="container">
       <!-- <router-link to="/newfrend" @click.native="firendThing">
					<li>
						<img src="../../img/fiend1.png" alt />
						<p class="blue">新朋友</p>
						<i  class="redSolid"  v-for="( item ,i) in newFriend" :key="i" >{{i+1}}</i>
					</li>
        </router-link> -->
        <router-link to="/groups">
          <li >
            <img src="../../img/fiend3.jpg" class="pic" alt />
            <p class="yellow">群组</p>
          </li>
        </router-link>
        <router-link to="/search">
          <li>
            <img src="../../img/fiend7.jpg" alt />
            <p class="orange">添加好友</p>
          </li>
        </router-link>
        <router-link to="/group">
          <li>
            <img src="../../img/fiend2.jpg" alt />
            <p class="orange">创建群组</p>
          </li>
        </router-link>
      </ul>
      <div class="delete">
        <ul class="message-content">
          <li
            class="message-wrap"
            v-for="(item,i) in verificationselect "
            :key="i"
            @click="deamt(item.friend_id,item.nickname)"
            id="moveDelet"
            @touchstart="down"
            @touchend="end"
            data-type="0"
          >
            <img :src="apis+item.avatar" />
            <h3>{{item.friend_nick}}</h3>
            <p @click.stop="dropFriend(item.friend_id)" style="position: absolute;right: -70px;">删除</p>
            <!-- <van-button square type="danger" text="删除" /> -->
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import animate from "animate.css";
import headertit from "../../components/header/header";
import { mapState, mapMutations } from "vuex";
import { CellSwipe } from "mint-ui";
import { Dialog } from 'vant';
export default {
  name:'friend',
   components: {
    [Dialog.Component.name]: Dialog.Component
  },
  inject: ["reload"],
  data() {
    return {
      friendList: [],
      verificationselect: [],
      newFriend: [],
      friend: [],
      conten: [],
      number: 0,
      show: true,
      startX: 0,
      endX: 0,
      sss: "",
    };
  },
  computed: {
    ...mapState(["firendwarn","apis"]),
  },
  
  methods: {
    ...mapMutations(["CHANGE_RED","MASSAGE_RED"]),
    friendlists() {
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({
          url: "newFriend",
          data: {
            uid: a,
            page: 1
          }
        })
      );
    },
    firendThing() {
      console.log(this.$route.path.indexOf("friend"));
      const a = parseInt(localStorage.getItem("uid"));
      if (this.$route.path.indexOf("friend") == -1) {
        this.axios.get(this.$store.state.apis + "/api/api/onclick?uid=" + a);
      }
    },
    down(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    end(e) {
      this.endX = e.changedTouches[0].clientX;
      this.endY = e.changedTouches[0].clientY;
      console.log(this.startY - this.endY);
      console.log(this.endY - this.startY);
      if (
        e.target.dataset.type == 0 &&
        this.startX - this.endX > 25 &&
        this.startY - this.endY < 50 &&
        this.endY - this.startY < 50
      ) {
        this.restSlide();
        e.target.dataset.type = 1;
      }
      if (
        e.target.dataset.type == 1 &&
        this.startX - this.endX < -25 &&
        this.startY - this.endY < 50 &&
        this.endY - this.startY < 50
      ) {
        this.restSlide();
        e.target.dataset.type = 0;
      }
    },
    restSlide() {
      let listItems = document.querySelectorAll(".cf");
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0;
      }
    },
    dropFriend(Fid) {
      let uid = parseInt(localStorage.getItem("uid"));
      console.log(uid);
      let fid = Fid;
      let url = this.$store.state.apis + "/api/api/friendDel";
      this.$Modal.confirm({
        content: "<p>是否删除此人？</p>",
        onOk: () => {
          console.log(fid);
          this.axios.post(url, { uid, fid }).then(res => {
            if (res.data.status) {
            
              this.$Message.info("删除成功！");
         
            }
                 this.reload();
          });
        },
        onCancel: () => {
          this.$Message.info("取消删除");
        }
      });
      // http://lc.sitedown.top/api/api/friendDel?uid=55&fid=48
      // let uid = parseInt(localStorage.getItem("uid"));
      // let fid=Fid
      // let url='/api/api/api/friendDel'
      // this.axios.post(
      // 	url,{uid,fid}
      // ).then(res=>{
      // 	console.log(res)
      // })
    },

    deamt(friend, username) {
      this.$router.push({
        name: "Massagelist",
        params: {
          friend_id: friend,
          username: username
        }
      });
    },
    list() {
      // console.log(this.global.isopen);
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({
          url: "verificationselect",
          data: {
            uid: a,
            page: 1
          }
        })
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
    Play() {
      var add = document.getElementById("audios");
      add.load();
      add.play();
    }
  },
  components: {
    headertit
  },
  activated() {
      let uidd = parseInt(localStorage.getItem("uid"));
    if (!uidd) {
      this.$router.push({
        path: "/login"
      });
    }


    const friend_id = this.$route.params.friend_id;
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
    that.global.status(friend_id);
    that.global.ws.onmessage = function(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata);
console.log(redata.data.url == "verificationselect");

// if (redata.data.url == "verificationselect") {
//         that.verificationselect = redata.data.data;     
//         console.log('xxxxxxxxxx'+JSON.stringify(that.verificationselect));
//       } else if (redata.data.url == "newFriend") {
//         let newsFriend = redata.data.data;
//         for (let i = 0; i < newsFriend.length; i++) {
//           if (newsFriend[i].type == "get" && newsFriend[i].state == 1) {
//             that.newFriend.push(newsFriend[i]);
//           }
//         }
//       }


      let arr = redata.data.data;
      if (
        redata.data.url == "sendfriendText" ||
        redata.data.url == "sendrootMessage"
      ) {
        let origin_id = arr.origin_id;
        let uid = arr.uid;
        let nick = arr.fnick;
        let favatar = arr.favatar;
        if (uid != that.a && arr.type == 1) {
          arr.origin_id = uid;
        }
        if (arr.type == 2) {
          arr.origin_id = "r" + arr.origin_id;
        }
        if (uid == that.a) {
          arr.usernick = nick;
          arr.useravatar = favatar;
        }
        arr["status"] = 1;
        delete arr.favatar;
        delete arr.fnick;
        //delete arr.userid;
        console.log('188行');
         console.log('186行 写入数据库');
         that.global.saveSqllite([arr]).then(function(data) {
          that.global.selectmessage().then(function(data) {
            that.list = data.reverse();
            
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

             that.MASSAGE_RED();
            //  console.log(that)
      }
      // 		 if (redata.data.url == "sendfriendText") {
      //   // if (redata.data.data.isself == 0) {
      //     console.log("接受到一条新消息，调用一次");
      //     that.sss = require("../../assets/msg.mp3");
      //     that.Play();
      //   // }
      // }
      if (redata.data.url == "verificationselect") {
        that.verificationselect = redata.data.data;
        
        console.log('xxxxxxxxxx'+JSON.stringify(that.verificationselect));
      } else if (redata.data.url == "newFriend") {
        let newsFriend = redata.data.data;
        for (let i = 0; i < newsFriend.length; i++) {
          if (newsFriend[i].type == "get" && newsFriend[i].state == 1) {
            that.newFriend.push(newsFriend[i]);
          }
        }
      }
      console.log(redata);
      // that.friend = redata.data.data;
    };
    // if(this.newFriend.length==0){
    // 	this.CHANGE_RED(false)
    // 	console.log(this.newFriend)
    // }else if(this.newFriend.length>0){
    // 	this.CHANGE_RED(true)
    // }

    if (this.global.ws.readyState == 0) {
      this.global.ws.onopen = function() {
        that.list();
        that.friendlists();
      };
    } else {
      this.list();
      this.friendlists();
	}

  }
};
</script>

<style scoped>

  .friend {
    width: 100vw;
    /* height: 100vh; */
  }
  
  a {
    text-decoration: none;
  }
  
  .mint-header {
    background: #303133;
  }
  
  .container {
    width: 100%;
    display: flex;
    display:-webkit-flex;
    justify-content: space-around;
    -webkit-justify-content:space-around;
    z-index: 22;
    background: #fff;
    padding-bottom: 20px;
    border-bottom: 20px solid #f5f5f5;
  }
  
  .container li {
    top: 10px;
    list-style: none;
    position: relative;
  }
  
  .container p {
    text-align: center;
    font-size: 17px;
    color: #000;
  }
  
  .container img {
    width: 40px;
    height: 40px;
    border-radius: 10%;
    margin-left: 13px;
  }
  
  .message {
    width: 100vw;
    height: 100vh;
    background: #fff;
  }
  .container2 {
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  
  .mint-header {
    background: #4c3bb1;
  }
  
  .message-content {
    margin:0 6px;
    align-items: center;
  }
  .message-content li{
    border-bottom: 1px solid #efefef;
    margin:-8px 0 10px 0; 
    padding-bottom:8px ;
  }
  .message-content li:nth-child(1){
    margin-top:2px; 
  }
  .message-wrap {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 5px;
  }
  .message-wrap>h3{
    font-size: 16px;
  }
  .message-wrap[data-type="0"] {
    transform: translate3d(0, 0, 0);
    transition: 0.5s;
    
    
  }
  .message-wrap[data-type="1"] {
    transform: translate3d(-4rem, 0, 0);
    transition: 0.5s;
  
  
  }
  .message-wrap p {
    background: #ff4949;
    color: #fff;
    width: 60px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .message-content img {
    width: 52px;
    height:52px;
    border-radius: 15%;
    margin-right: 15px;
  }
  
  .redSolid {
    display: inline-block;
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 2px;
    right: 2px;
    color: #fff;
  }
  .showicon {
    width: 100%;
    margin-top: 14px;
    padding-top: 40px;
  }

  </style>