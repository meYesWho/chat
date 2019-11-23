<template>
  <div class="app-login">
    <Form class="from" ref="formInline" :model="formInline" :rules="ruleInline">
      <Form-item prop="user">
        <Input
          prefix="ios-contact"
          placeholder="请输入用户名"
          style="width:100%"
          clearable
          v-model="formInline.user"
        />
      </Form-item>
      <Form-item prop="password">
        <Input
          prefix="md-lock"
          placeholder="请输入密码"
          style="width: 100%"
          clearable
          v-model="formInline.password"
          type="password"
        />
      </Form-item>
      <Form-item>
        <Button type="primary" long @click="relpace('formInline')" :loading="loading">登录</Button>
      </Form-item>
      <Form-item>
        <router-link to="/rege" class="regi">还没有，去注册</router-link>

      </Form-item>
    </Form>
  </div>
</template>
<script>
import ReconnectingWebSocket from 'reconnecting-websocket';
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      loading: false,
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { type: "string", min: 6, message: "密码最少6位", trigger: "blur" }
        ]
      }
    };
  },
   computed: {
    ...mapState(["apis"])
  },
  methods: {
    ...mapMutations(["MASSAGE_RED"]),
    websocketonopen(e) {
      console.log(e);
      const a = parseInt(localStorage.getItem("uid"));
      if(a){
          this.global.ws.send(JSON.stringify({url:"joingroup",data:{uid:a}}))
      console.log("WebSocket连接成功");
      }
    },
    relpace(name) {
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          var that = this;
          that.loading = true;
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          this.axios
            .post(
              this.$store.state.apis + "/api/api_login/login",
              this.formInline,
              config
            )
            .then(res => {
              console.log(res)
              console.log(this.formInline.user);
              const { data, msg, state } = res;
              if (res.data.state === 1) {
                that.$Message.success("登录成功");
                that.$router.replace({ path: "/" });
                localStorage.setItem("uid", res.data.uid);
                localStorage.setItem("userName", this.formInline.user);
                localStorage.setItem("userPwd", this.formInline.password);
                console.log(res.data)
                res.data.avatar.indexOf('http')==-1?localStorage.setItem("userImg", this.$store.state.apis +res.data.avatar):localStorage.setItem("userImg", res.data.avatar);
                 console.log("您的浏览器支持 WebSocket!");
              // if(localStorage.getItem("uid")!=null && !this.global.ws.readyState){
              //   }
                that.ws = new ReconnectingWebSocket("ws://104.202.61.194:7272");
                  that.global.setWs(that.ws);
                  that.global.ws.onopen = that.websocketonopen();
                  
              } else {
                that.$Message.error(res.data.msg);
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          this.$Message.error("登录失败");
        }
        that.loading = false;
      });
    }
  },
  created() {
    
    // let uname = localStorage.getItem("userName");
    // let upwd = localStorage.getItem("userPwd");
    // this.formInline.user = uname;
    // this.formInline.password = upwd;
    var that = this;
    that.global.openDB()
    this.global.ws.onmessage = function(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      // if(redata.data.url=="messageSelect"){
      // 	that.messagelist = redata.data.data;
      // }
      const a = parseInt(localStorage.getItem("uid"));
      var arr = redata.data.data;
      if(redata.data.url=="userOne"){
        localStorage.setItem("userImg", redata.data.data.avatar); 
      }
      if(redata.data.url=="isoutlie"){
        
        var outline = redata.data.data;
        console.log(JSON.stringify(outline));
        if(outline){
            that.global.saveSqllite(outline).then(function(data){
          that.global.selectmessage().then(function(data) {
            that.list = data.reverse();
          });
        });
        }
      }
      if (redata.data.url == "sendfriendText" || redata.data.url == "sendrootMessage"){
        that.MASSAGE_RED();
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
          var showdata=h + ":" + m + ":" + s
          var timeData =
            year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
        // tongzhi(timeData, redata.data.data.msgtext, "杜伟强"); 
      }
    };
  }
};
// if(uid){
//   this.$router.go(-1)
// }else{
//   this.$router.push({path:'/login'})
// }
</script>

<style>
.ivu-input-with-prefix{
border-radius: 15px !important;
}
.ivu-btn-primary{
  background: #08c261!important;
  border-color: #08c261 !important;
  border-radius:15px !important;
}
.regi{
  color: #08c261 !important;
  font-size:16px; 
}
.ivu-input{
  width: 90% !important;
  border-color: #08c261 !important;
  height: 35px !important;
  top: 5px !important;
  padding-left:40px !important; 
}
.ivu-btn-long{
  width: 90% !important;
  height: 35px !important;
  margin-top: 5px !important
}
.from{
  background: #fff !important;
  opacity: 0.8;
  border-radius: 10px;

}
.ivu-form-item{
  margin-top: 18px !important;
  text-align: center !important
}
.ivu-input-prefix{
  margin-left: 12px !important;
  top: 6px !important;
  
}
.ivu-input-icon{
  right: 10px !important;
  top:5px !important;
}
.ivu-form-item-error-tip{
  left: 20px !important;
}
.ivu-form-item-content{
  top:8px !important;
}
.ivu-input{
    font-size:16px !important; 
}
.ivu-btn>span{
    font-size: 18px !important;
}
.ivu-input-prefix i, .ivu-input-suffix i{
    font-size:24px !important; 
    margin-left:14px; 
}
</style>


