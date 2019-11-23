<template>
  <div class="tocke">
    <div class="tocke-con">
      <headertit isleft="true" title="邀请好友"/>
      <ul class="tocke-massge" >
        <li v-for="item in showList" :key="item.id">
          <div class="tocke-sip">
            <div class="sip-l">
              <img :src="apis+item.avatar" alt />
              <span>{{ item.nick }}</span>
            </div>
            <div class="sip-r">
                <CheckboxGroup v-model="fids" @on-change="change">
                    <Checkbox v-bind:label="item.friend_id" size="large"  ><span class="imporT"></span></Checkbox>
                </CheckboxGroup>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="invite"   @click="invite">立即邀请（{{fids.length}}）</div>
  </div>
</template>

<script>
import headertit from "../../components/header/header";
import { mapState, mapMutations } from "vuex";
export default {
  inject:['reload'],
  data() {
    return {
      fids:[],
      showList:[],
      single: false,
      tockeList: [
        {
          id: "01",
          img: require("../../img/show1.jpg"),
          title: "小哥哥"
        },
        {
            id:"02",
            img:require("../../img/show4.jpg"),
            title:"小姐姐"
        },{
            id:"03",
            img:require("../../img/show3.jpg"),
            title:"哈哈哈"
        }
      ]
    }
  },
  components:{
        headertit
  },
  computed:{
		...mapState([
      'groupId',
      'apis'
    ]),
	},
  methods:{
      ...mapMutations(["MASSAGE_RED"]),
      change(data){
        console.log(data)
      },
      invite() {
        let fids=this.fids.splice(0)       
        let fidS=fids.join(',')
        const a = parseInt(localStorage.getItem("uid"));
        this.websocketsend(JSON.stringify({
          url: "rootInvitation",
          data: {
            uid: a,
            id: this.groupId,
            fids:fidS
          }
      }))
      this.global.ws.onmessage = (e)=>{
        const redata = JSON.parse(e.data);
        console.log(redata.status==='ok')
        if(redata.status==='ok'){
          this.reload()
        }
      }
    },
    friendList(){
      const a = parseInt(localStorage.getItem("uid"));
      let url=this.$store.state.apis+'/api/api/invatfriendList'
      this.axios.post(url,{uid:a,rootid:this.groupId}).then(res=>{    
        this.showList=res.data.data
      })
    },
    websocketonerror(e) {
      //错误
      console.log("WebSocket连接发生错误");
    },
    websocketsend(agentData) {
      //数据发送
      this.global.ws.send(agentData);

    },
  },
  created(){
    this.friendList()
    var that = this;
      if (
        redata.data.url =="sendfriendText" ||
        redata.data.url == "sendrootMessage"
      ) {
        
        let origin_id = arr.origin_id;
        console.log( JSON.stringify(arr))
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
         that.global.saveSqllite([arr]).then(function(data) {
           console.log('187行 写入数据库');
          that.global.selectmessage().then(function(data) {
            console.log(JSON.stringify(data));
            for (var key in data) {
              var sendtime = data[key]["send_time"];
              var d = new Date(sendtime * 1000);
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
              var timeData = h + ":" + m + ":" + s;
              data[key]["send_time"] = timeData;
            }
            that.list = data.reverse();
            console.log(JSON.stringify(data));
            console.log(data[key]["send_time"]);
          });
         });
         that.MASSAGE_RED();
      }
  }
 
};
</script>

<style >
.tocke {
  width: 100%;
  /* background-color: #ededed; */
  position: relative;
}
.chat-top {
  width: 100%;
  height: 40px;
  background-color:#26a2ff;
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
  font-size: 14px;
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
.tocke-con {
  position: relative;
}
.tocke-massge {
  width: 100%;
  background: #fff;
  padding-top: 76px;
}
.tocke-massge > li {
  border-bottom: 1px solid #ededed;
  padding: 0px 10px 2px 10px;
}
.tocke-sip {
  width: 100%;
  height: 56px;
  position: relative;
}
.sip-l > img {
  display: block;
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-top: 5px;
  border-radius: 15%;
}
.sip-l > span {
  font-size: 16px;
  color: #333;
  line-height: 50px;
}
.sip-r {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}
.invite {
  width: 175px;
  height: 40px;
  margin: auto;
  background-color: rgb(76, 59, 177);
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
  color: #f2f2f2;
  margin-top: 10px;
  font-size:18px; 
}
.imporT{
  margin: 0;
}
.ivu-checkbox-large .ivu-checkbox-inner{
  width: 30px !important; 
  height: 30px !important;
}
.ivu-checkbox-large .ivu-checkbox-checked .ivu-checkbox-inner:after{
   width: 18px !important; 
  height: 22px !important;
}
/* .ivu-checkbox .ivu-checkbox-inner{
  width: 30px !important; 
  height: 40px !important;
} */
</style>