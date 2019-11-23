<template>
  <div class="zong">
     <headertit isleft="true" title="聊天"/>
    <div class="num">
      <mt-cell title="群聊成员" class="shao">{{groupItems.length}}人</mt-cell>
      <div class="friend">
        <ul class="groupList">
          <li class="groupItem"  v-for="(item,i) in groupItems" :key="i">
            <div class="groupBox">
              <img :src="apis+item.avatar"  class="pic" alt=""><br>
              <span>{{item.room_nick}}</span>
            </div>
            
          </li>
          <div class="jus">
            <img src="../../img/zeng.png"  class="pic" alt="" @click="groupIds"/><br>
            <span>邀请好友</span>
          </div> 
        </ul>    
      </div>
    </div>
    <div  @click="name" v-if="auth=='1'">
      <mt-cell title="群聊名称" class="shao" is-link>{{groupDetall.root_name}}</mt-cell>
    </div>
    <div v-if="auth=='0'">
      <mt-cell title="群聊名称" class="shao">{{groupDetall.root_name}}</mt-cell>
    </div>
     <div  @click="product" v-if="auth=='1'">
       <mt-cell title="群介绍" class="shao"  is-link>{{groupDetall.introduction}}</mt-cell>
     </div>
     <div v-if="auth=='0'">
       <mt-cell title="群介绍" class="shao">{{groupDetall.introduction}}</mt-cell>
     </div>
      <div @click="me">
        <mt-cell title="我在本群的昵称" class="qun" is-link>{{groupDetall.room_nick}}</mt-cell>
     </div>
    <div class="an">
      <button v-if="auth=='1'" class="jie"  @click="chai">解散群组</button>
      <button v-if="auth=='0'" class="jie"  @click="chai">退出群组</button>
    </div>
  </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import headertit from "../../components/header/header";
import { mapState, mapMutations } from "vuex";
export default {
  inject:['reload'],
  data(){
    return {
   groupItems: [],
   groupDetall:[],
      channame: "",
      love:"",
      liname:"",
      auth:0
    }
  },
  computed:{
		...mapState([
      'groupId',
      'apis'
    ]),
	},
  methods:{
      ...mapMutations(["MASSAGE_RED","GROUP_Name"]),
     product() {
      MessageBox.prompt("请编辑群介绍").then(({groupId, value, action }) => {
        if (action == "confirm") {
          console.log(this.groupId);
          const a = parseInt(localStorage.getItem("uid"));
          let url = this.$store.state.apis+"/api/api/rootintrdoution";
          this.axios
            .post(url, { uid: a, rootid: this.groupId, introduction:value })
            .then(res=> {
              console.log(res.data)
              if(res.data.status=='ok'){
                this.reload()
              }
              
            })
            .catch(function(error) {
              console.log(error);
            });
            this.love = value;
        }
      });
    },

    me() {
      MessageBox.prompt("请修改昵称").then(({groupId, value, action }) => {
        if (action == "confirm") {
          const a = parseInt(localStorage.getItem("uid"));
          let url = this.$store.state.apis+"/api/api/user_rootnick";
          this.axios
            .post(url, { uid: a, rootid: this.groupId, usernick: value })
            .then(res=> {
              console.log(res.data)
              if(res.data.status=='ok'){
                this.reload()
              }
            })
            .catch(function(error) {
              console.log(error);
            });
           this.liname = value;
        }
      });
    },

name() {
      MessageBox.prompt("请修改群聊名称").then(({groupId, value, action }) => {
        if (action == "confirm") {
          const a = parseInt(localStorage.getItem("uid"));
          let url = this.$store.state.apis+"/api/api/rootedit";
          this.axios
            .post(url, { uid: a, rootid:this.groupId, name: value })
            .then(res=> {
              console.log(res.data)
              if(res.data.status== 200){
              }
              let that=this;
              that.GROUP_Name(value)
               this.reload()
                       //群聊本地
              var rotid="r"+this.groupId
             updatelist(rotid,value);
               that.channame = value;
              
            })
            .catch(function(error) {
              console.log(error);
            });

       
        }
      });
    },

    chai() {
      MessageBox.confirm("", {
        title: "提示",
        message: "确定要退出群组吗？",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action == "confirm") {
            const a = parseInt(localStorage.getItem("uid"));
            const groupId = this.groupId;
            this.websocketsend(
              JSON.stringify({
                url: "drawroot",
                data: {
                  uid: a,
                  rootid: groupId
                }
              })
            );
          }

          this.$router.push({ path: "/groups" });
        })
        .catch(error => {
          if (error == "cancel") {
          }
        });
    },
    groupIds(){  
        this.$router.push('/invite')
    },
     websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.global.ws.send(agentData);
    },

    groupItem(){
      // http://lc.sitedown.top/api/api/root_list?id=**
      let url=this.$store.state.apis+"/api/api/root_list"
      let a = parseInt(localStorage.getItem("uid"));
      this.axios.post(
        url,{
          uid:a,
          id:this.groupId
        }
      ).then(res=>{
        console.log(res.data)
        this.auth=res.data.data.auth
        this.groupItems=res.data.data.rootlist
        this.groupDetall=res.data.data.root
        console.log(this.groupDetall)
      })

    }
  },
  components:{
        headertit
  },
  created(){
     const friend_id = this.$route.params.friend_id;
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
    // status(friend_id)
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
           that.MASSAGE_RED();
      }
      console.log(redata.data.data);
          if (this.global.ws.readyState == 0) {
      this.global.ws.onopen = function() {
        that.list();
      };
    } else {
      this.list();
    }
      if(redata.data.url=="userOne"){
        that.mineList = redata.data.data;
        that.avatar=redata.data.data.avatar
        let nickname = localStorage.getItem("nickname");
        let userImg = localStorage.getItem("avatar");
   
      }
    }

    console.log(this.groupId)
    this.groupItem()
    // console.log(this.$route.params)
  }
};
</script>

<style scoped>
.groupList{
  display: flex;
  flex-wrap:wrap;
  margin: 0.5rem;
  justify-content: space-between;
}
.friend{
  padding-top: 10px;
  background: #f5f5f5
}
li{list-style-type: none;}
.groupBox{
  padding: 0.3rem;
  text-align: center;
}
.groupBox img{
  border-radius: 15%;
}
.groupBox span{
  font-size:18px; 
}
.zong{
  width: 100vw;
  height: 100vh;
  background: #f5f5f5;

}
.jie {
  width: 205px;
  height: 42px;
  background: #4b3ab0;
  font-size: 18px;
  color: #fff;
  border-radius: 4px;
  outline: none;
  border: none;
  letter-spacing:2px;
  margin-top: 15px;
}
.jus{
  display: inline-block;
  padding: 0.3rem;
  text-align: center;
}
.num{
  color: black;
  font-size: 16px
  
}
.pic{
  width: 60px;
  height: 60px;
}
.qun{
  color: black
}
.shao{
  color: black
}
.an {
  margin: 0 auto;
  width: 205px;
}
.mint-cell-wrapper{
  font-size: 18px !important;
}
</style>