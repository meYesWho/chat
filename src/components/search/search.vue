<template>
  <div class="safetyInfo">
    <mt-header title="搜索" class="new-top" fixed>
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <div class="btn">
      <div class="serchBtn">
        <input type="text" name id placeholder="通过登录名搜索好友" @keyup.enter='btn()' value="search" v-model="search" />
        <p class="button">
          <img src="../../assets/sou.png" class="suo" @click="btn" alt />
        </p>
      </div>
      <ul class="show-con">
        <li class="cf" v-if="show">
          <div class="showcon-l">
            <img :src="apis+list.avatar" alt />
            <p>{{list.nickname}}</p>
          </div>
          <div class="showcon-r">
            <i-button
              v-if="list.friend==0"
              type="primary"
              @click="add(list.id,list.nickname)"
              class="show-btn"
            >加好友</i-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import headertit from "../../components/header/header";
import { mapState, mapMutations } from "vuex";
// $('#errorCode').on('keypress',function(event){
// if(event.keyCode==13){
//   $('#codeSubmit').trigger('click');
// }
// });
export default {
  name: "HelloWorld",
  inject: ["reload"],
  data() {
    return {
      search: "",
      searchData: "",
      list: [],
      show: false
    };
  },
      computed: {
    ...mapState(["apis"]),
  
  },
  methods: {
  ...mapMutations(["MASSAGE_RED"]),
    add(id, nickname) {
      // friendAdd?uid=**&id=**&nickname=**
      const a = parseInt(localStorage.getItem("uid"));
      this.$Modal.confirm({
        content: "<p>是否添加对方为好友？</p>",
        onOk: () => {
          this.websocketsend(
            JSON.stringify({
              url: "friendAdd",
              data: {
                uid: a,
                id: id,
                nickname: nickname
              }
            })
          );
          this.global.ws.onmessage = e => {
            const addFriend = JSON.parse(e.data);
            if (addFriend.data.url == "friendAdd") {
              if(addFriend.status=='ok'){
                   this.$Message.info("添加成功");
                    this.reload();     
              }else if(addFriend.Code== "001" ){
                    let  info=addFriend.msg
                    this.$Message.info(info)
              }              
            } else if (addFriend.msg == "好友关系已存在") {
              this.$Message.info("好友关系已存在");
              this.reload();
            }else{
                  this.$Message.info("您不够权限");
            }
          };
        },
        onCancel: () => {
          this.$Message.info("已取消");
        }
      });
    },
    btn() {
      let that = this;
      const a = parseInt(localStorage.getItem("uid"));
      this.axios
        .post(this.$store.state.apis + "/api/api/serachuser", {
          uid: a,
          username: this.search
        })
        .then(function(res) {
          if (res.data.status == "ok") {
            console.log(1)
            let arr = res.data.data;
            that.list = arr;
            that.show = true;
          } else {
            that.$Message.error(res.data.msg);
          }
        })
        .catch(function(error) {
          console.log(2)
          console.log(error);
        });
        
    },
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.global.ws.send(agentData);
    }
  },
  created(){
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
        that.global.saveSqllite([arr]).then(function(data){
          selectmessage().then(function(data) {
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
         that.MASSAGE_RED();


      }
      if(redata.data.url=="userOne"){
        that.mineList = redata.data.data;
        that.avatar=redata.data.data.avatar
        let nickname = localStorage.getItem("nickname");
        let userImg = localStorage.getItem("avatar");
   
      }
      

}
  },
  components: {
    headertit
  }
};


</script>


<style scoped>
.suo{
  width: 20px;
  height: 20px;
}
.safetyInfo {
  width: 100vw;
  height: 50vh;
  position: relative;
  background: #f1f1f1;
}
.btn {
  width: 100vw;
  position: absolute;
  left: 0;
  top: 50px;
}

.btn input {
  height: 36px;
  width: 90%;
  outline: none;
  border-right: none;
  /* border-top-left-radius: 14px; */

  padding: 8px 0;
  padding-left: 20px;
  vertical-align: bottom;
  font-size: 16px;
}
.ivu-btn .ivu-btn-primary {
  height: 30px;
}
.serchBtn {
  width: 96%;
  margin: 25px auto;
  background: #fff;
    border: 1px solid #e8e8e8;
  border-radius: 14px;
}
.button {
  height: 36px;
  display: inline-block;
  border-left: none;
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 8px 10px;
  text-align: right;
  position: absolute;
  right: 10px;
}
.message-content {
  padding: 0 6px;
  flex-direction: row;
  width: 100vw;
  align-items: center;
}
.message-wrap {
  width: 100%;
  height: 68px;
  margin-bottom: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.message-content img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 5px;
}

.show-con {
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  padding-bottom: 4.5rem;
}

.show-con > li {
  width: 97%;
  background: #fff;
  overflow: hidden;
  margin: 2px auto 2px;
  padding: 10px;
  position: relative;
  border-radius: 8px;
  border-bottom: 1px solid #f1f1f1;
}

.show-con > li .showcon-l {
  float: left;
}

.show-con > li .showcon-l > img {
  display: block;
  float: left;
  width: 45px;
  height: 45px;
  border-radius: 50%
}

.show-con > li .showcon-l > p {
  float: left;
  font-size: 14px;
  line-height: 45px;
  margin-left: 10px;
}

.show-con > li .showcon-r {
  float: right;
}

.show-btn {
  font-size: 12px;
  background-color: #26a2ff;
  position: absolute;
  right: 7px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
