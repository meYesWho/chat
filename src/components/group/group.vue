<template>

  <div class="group">
    <headertit isleft="true" title="创建群组"/>
    <div class="group-al animated zoomIn">
      <span>创建群组</span>
      <input type="text" placeholder="请填写群名称" v-model="groupname" />
      <p @click="establish">创建</p>
    </div>
  </div>
</template>

<script>
import animate from "animate.css";
import headertit from "../../components/header/header";
import { mapMutations } from "vuex";
import { Toast } from 'mint-ui';
export default {
  methods: {
     ...mapMutations(["MASSAGE_RED"]),
    establish() {
        let that =this
        const a = parseInt(localStorage.getItem("uid"));
        this.axios.post(this.$store.state.apis+"/api/api/create_root/",{name:this.groupname,uid:a}).then(function(res){
            const {status,data} = res
            console.log(res)
            if(res.data.status==='ok'){
              let msgs=res.data.msg
              Toast({
                  message: msgs,
                  iconClass: 'icon ',
                  duration:2000
            });
              that.$router.push({path:'/groups'})
            }else{
                let msg=res.data.msg
                    Toast({
                  message: msg,
                  iconClass: 'icon ',
                  duration:2000
            });
            }
      }) .catch(function(error) {
              console.log(error);
            });
    //   this.$router.push({path:'/groups'})
    }
  },
  created() {
     const friend_id = this.$route.params.friend_id;
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
    that.global.status(friend_id)
    that.global.ws.onmessage = function(e) {
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
       }
    }
},
     
  data() {
      return {
          groupname:'',
      }
  },
  components:{
        headertit
  },


};
</script>

<style scoped>
.group{
  padding-top: 40px;
}
.personal {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  position: relative;
}
.personal-top {
  width: 100%;
  height: 40px;
  overflow: hidden;
  background-color: #26a2ff;
  position: relative;
}

.personal-r {
  display: block;
  width: 20px;
  height: 20px;
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.personal-top > p {
  float: left;
  width: 100%;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}
.group-al {
  width: 320px;
  height: 200px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px #f5f5f5 solid;
  margin: auto;
  margin-top: 50px;
}
.group-al > span {
  display: block;
  font-size: 24px;
  text-align: center;
  font-weight: 500;
  /* color: rgb(76, 59, 177); */
  text-align: center;
  margin-top: 10px;
}
.group-al > input {
  display: block;
  margin: auto;
  margin-top: 40px;
  outline: none;
  background: transparent;
  width: 200px;
  height: 30px;
  font-size: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 2px solid #08c261;
  border-radius: 0;
}
.group-al > p {
  width: 200px;
  height: 30px;
  margin: auto;
  margin-top: 25px;
  color: #ffffff;
  text-align: center;
  line-height: 30px;
  background-color: #08c261;
  border-radius: 12px;
  font-size: 20px;
}
.group{
  height: 50vh;
  background: #f1f1f1;
}
</style>