<template>
<div class="mine">
    <!-- header -->
    <headertit title="我的" />
    <!-- Head portrait -->
    <div>
      <div class="door">
        <div class="mine-pop">
          <div class="mine-big">
            <div class="mine-im">
              <img v-if="mineList!=null" 
              :src="mineList.avatar"
              alt @click="userImg" />
              <input id="upload_file" type="file" @change="afterRead($event)" style="display:none" />
            </div>
            <div class="mine-fon">
              <p v-if="mineList!=null" @click="userName($event)">
                <img src="../../img/pin.png" class="picture" alt v-show="isImg" />
                <input
                  type="text"
                  value="mineList.nickname"
                  v-model="mineList.nickname"
                  disabled
                  :class="{userName:show}"
                  @blur="changeForUserName"
                  ref="gain"
                  class="input-xiu"
                  style="font-size:16px"
                />

                <Button type="info"   size="small"  v-show="showBtn" @click="changeForUserName">确定</Button>
                <!-- < img src="../../img/pin.png" alt @click="nickName"> -->
              </p >
            </div>
            <!-- <div class="fon">{{ item.title }}</div> -->
          </div>
        </div>
        <!-- menu -->
        <!-- <router-link to="/safe">
      
        </router-link>-->
        <!-- <div class="tosafe">
      <p>消息免打扰</p >
      <i-switch @on-change="change" size="small" class="switu" />
        </div>-->
        <!-- <router-link to="/er">
          <div class="tosafe">
            <p>分享站点</p >
            < img src="../../img/left.png" alt />
          </div>
        </router-link>-->
      </div>
    </div>
    <div class="mylist">
      <div class="tosafes" @click="yy">
        <p>退出</p >
        <img src="../../img/left.png" alt />
      </div>
      <div class="tosafe" @click="checkUpdate">
        <p>最新版本</p >
        <img src="../../img/left.png" alt />
      </div>
    </div>
    <div class="mylist"> 
        <div class="tosafe myset" @click="startNation">
        <p>设置</p >
        <img src="../../img/left.png" alt />
    </div>
    </div>
    
  </div>
</template>
<script>
import headertit from "../../components/header/header";
import { Switch } from "iview";
import { MessageBox } from "mint-ui";
import { Dialog } from "vant";
import {  mapMutations } from "vuex";
export default {
  name: "mine",
  components: {
    headertit
  },
  name: "early_feedback",
  inject: ["reload"],
  data() {
    return {
      mineList: { nickname: "", avatar: "" },
      avatar: require("../../img/left.png"),
      show: true,
      showBtn: false,
      visb: false,
      iconBase64: "",
      isImg: true
    };
  },
  methods: {
 ...mapMutations(["MASSAGE_RED"]),
    checkUpdate(){
      checkUpdate()
    },
    startNation() {
      startNation();
    },
    changeForUserName() {
       this.$refs.gain.style.borderBottom="1px solid #2db7f5"
      this.reload();
      const a = parseInt(localStorage.getItem("uid"));
      const b = this.mineList.nickname;
      localStorage.setItem("nickName", b);
      let url =
        this.$store.state.apis +
        "/api/api/userEdit?uid=" +
        a +
        "&nickname=" +
        b;
      this.axios
        .get(url)
        .then(res => {
          if (res.data.status == "ok") {
            this.reload();
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    userName(e) {
      let input = e.target;
      let that = this;
      that.isImg = false;
      if (input) {
        input.disabled = false;
        input.focus();
        this.show = false;
        this.showBtn = true;
      }
    },
    userImg() {
      document.getElementById("upload_file").click();
    },
    afterRead(e) {
      const uid = parseInt(localStorage.getItem("uid"));
      console.log(uid);
      let avatar = e.target.files[0];
      console.log(avatar);
      var formData = new FormData();
      formData.append("uid", uid);
      formData.append("avatar", avatar);
      console.log(formData);
      this.service
        .post("/api/api/userupload", formData)
        .then(res => {


          if (res.data.Code =="001") {
          } else if (res.data.Code == "200") {
            let that=this;
              localStorage.userImg='http://chat.zp600.com'+res.data.data.avatar 
              
              localStorage.nickName=res.data.data.nickname
              that.mineList.avatar = 'http://chat.zp600.com'+res.data.data.avatar;   
      
              that.mineList.nickName = res.data.data.nickname;    
          this.$Message.success("上传成功");
          }
          this.reload();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    
    nickName(e) {
      console.log(e);
    },
    choseUname() {
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({
          url: "userEdit",
          data: { uid: a, nickname: nickname }
        })
      );
    },
    list() {
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(JSON.stringify({ url: "userOne", data: { uid: a } }));
    },
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.global.ws.send(agentData);
    },
    change(status) {
      if (status == true) {
        this.$Message.info("已开启");
      } else {
        this.$Message.info("已关闭");
      }
    },
    yy() {
      MessageBox.confirm("", {
        title: "提示",
        message: "确定要退出登录吗？",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action == "confirm") {
             this.global.emptyout();
            this.$router.replace({ path: "/login" }); 
            
      }
            this.global.ws.close();
          window.localStorage.removeItem("uid");
           window.localStorage.removeItem("userName");
             window.localStorage.removeItem("nickName");
        })
        .catch(error => {
          if (error == "cancel") {
          }
        });
    }
  },
  watch: {
    // afterRead(){
    //       localStorage.userImg
    //      ="http://104.202.61.194/uploads/avatar/20190926/3bf682da4d7933d41562f85844b856c7.jpg"
    // }
  },
  created() {
    //     var arr = redata.data.data;
    //     if(redata.data.url=="userOne"){
    //     localStorage.setItem("userImg", redata.data.data.avatar);
    //   }


    //   var addLog = openintvaltion();
    // if (!addLog) {
    //   Dialog.confirm({
    //     message: "系统检测到您没有打开通知权限，是否确定打开"
    //   })
    //     .then(() => {
    //       startNation();
    //     })
    //     .catch(() => {});
    // }
    let uidd = parseInt(localStorage.getItem("uid"));
    if (!uidd) {
      this.$router.push({
        path: "/login"
      });
    }
    const friend_id = this.$route.params.friend_id;
    var that = this;

    that.mineList.avatar = localStorage.userImg;
    console.log(localStorage)
    if(localStorage.nickName){
          that.mineList.nickname = localStorage.nickName;
    }else{
          that.mineList.nickname = localStorage.userName;
    }
    var username = that.$route.params.username;
    that.username = username;
    status(friend_id);
    that.global.ws.onmessage = function(e) {
      //数据接收
      const redata = JSON.parse(e.data);
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
          
          that.MASSAGE_RED();
        // tongzhi(timeData, redata.data.data.msgtext);
      }
      console.log(redata.data.data);
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
.picture {
  position: absolute;
  top: 5px;
  right: 0;
}
.cf {
  display: block;
  content: "";
  clear: both;
}

li {
  list-style: none;
}
.mine {
  background-color: #ededed !important;
}
.mine-t {
  background-color: rgb(76, 59, 177);
}
.mine-im {
  display: flex;
  justify-content: center;
}
.mine-im > img {
  display: block;
  width: 60px;
  height: 60px;
  border-radius: 15%;
}
.mine-pop {
  display: flex;
  width: 100%;
  height: 150px;
  justify-content: center;
  align-items: center;
}
.mine-fon {
  display: flex;
  justify-content: center;
  margin-top:16px; 
}
.mine-fon > p {
  float: left;
  margin-top: 5px;
  position: relative;
}
.mine-fon > p > img {
  width: 20px;
  height: 20px;
  display: block;
  float: right;
  margin: 2px 0 0 5px;
}
.fon {
  font-size: 8px;
}
.mylist {
  background-color: #ffffff;
}
.myset{
  background-color: #ffffff;
}
.tosafe {
  width: 90%;
  height: 54px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.tosafes {
  width: 90%;
  height: 54px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 10px;
  border-bottom: 1px solid #f1f1f1;
}
.tosafe > p {
  font-size: 18px;
  color: #999;
  font-weight: 500;
}
.tosafes > p {
  font-size: 18px;
  color: #999;
  font-weight: 500;
}
.tosafes > img {
  display: block;
  width: 8px;
  height: 10px;
  position: absolute;
  right: 10px;
}
.tosafe > img {
  display: block;
  width: 8px;
  height: 10px;
  position: absolute;
  right: 10px;
}
.switu {
  position: absolute;
  right: 10px;
}

.picBtn,
.nameBtn {
  margin: 10px 0;
  outline: none;
  border: none;
}
.userName {
  border: 0;
  text-align: center;
  background: #fff;
  padding: 5px;
  
}
input:focus{   
    border-bottom: 1px solid  #2db7f5 !important;
}
.vise {
  background: #f5f5f5;
}
.door {
  margin-top: 10px;
  padding-top: 50px;
  background-color: #ffffff;
}

.ivu-btn-info{
  margin-left:10px !important; 
}
.ivu-btn>span{
  font-size: 16px !important;
}
.input-xiu{
  border-radius: 0;
  color: #000 !important;
  font-size: 22px !important;
}
</style>