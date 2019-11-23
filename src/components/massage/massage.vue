<template>
  <div class="message">
    <headertit title="消息" />
    <div class="serchBtn">
      <input
        type="text"
        name
        id
        placeholder="搜索好友"
        value="search"
        v-model="search"
        @focus="issearch=true"
      />
      <p class="button">
        <img src="../../assets/sou.png" class="sss" @click="searchfriend" alt />
      </p>
    </div>
    <ul class="shows-con" v-show="issearch">
      <li
        v-for="item in newsearchList"
        :key="item.id"
        class="df"
        style="background:#eee"
        @click.stop="deamtFriend(item.origin_id,'2',item.usernick,item.type,item.count,item.roomnick)"
      >
        <div class="showcon-l">
          <img :src="item.type==1?apis+item.useravatar:apis+item.roomavatar" alt />
        </div>
        <div class="div">
          <h3 class="dui">{{item.usernick}}</h3>
          <p ref="msgcontent" class="pi">{{item.msgtext}}</p>
        </div>
      </li>
      <!-- <p v-else>没有搜索到匹配好友</p> -->
    </ul>
    <!-- <div style="height:2px;background:#eeeeee"></div> -->
    <ul class="show-con">
      <li
        class="cf"
        v-for="item in list"
        :key="item.id"
        @click.stop="deamtFriend(item.origin_id,'2',item.usernick,item.type,item.count,item.roomnick)"
        id="moveDelet"
        @touchstart="down"
        @touchend="end"
        data-type="0"
      >
        <div class="showcon-l">
          <img :src="item.type==1?apis+item.useravatar:apis+item.roomavatar" alt />
        </div>
        <div class="div">
          <h3 class="dui">{{item.type==1?item.usernick:item.roomnick+"(群聊)"}}</h3>
          <p ref="msgcontent" class="pi">{{item.msgtext}}</p>
        </div>
        <i class="redSolid" v-if="item.count>0" v-text="item.count"></i>
        <span class="sendtime">{{item.send_time}}</span>
        <p
          class="selectBtn"
          @click.stop="dropFriend(outid=item.origin_id)"
          style="position: absolute;right: -70px;"
        >删除</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import headertit from "../../components/header/header";
import { mapState, mapMutations } from "vuex";

import { MessageBox } from "mint-ui";
import { CellSwipe } from "mint-ui";
import { Dialog } from "vant";

export default {
  inject: ["reload"],
  data() {
    return {
      list:[],
      
      search: "",
      newsearchList: [],
      issearch: false,
      countNum:0,
    };
  },
  computed: {
    ...mapState(["apis"])
  },

  created() {
    let uidd = parseInt(localStorage.getItem("uid"));
    if (!uidd) {
      this.$router.push({
        path: "/login"
      });
    }

  

    var that = this;
    // this.loding();
    that.global.ws.onmessage = function(e) {
       console.log('message'+JSON.stringify(e))
      const redata = JSON.parse(e.data);
      // if(redata.data.url=="messageSelect"){
      // 	that.messagelist = redata.data.data;
      // }
      const a = parseInt(localStorage.getItem("uid"));
      var arr = redata.data.data;
      var data = arr;
      if (redata.data.url == "userOne") {
        localStorage.setItem("userImg", redata.data.data.avatar);
      }
      if (redata.data.url == "isoutlie") {
        var outline = redata.data.data;
         console.log(JSON.stringify(outline));
        console.log("进入离线");
         console.log(data);
        if (outline) {
           console.log("您好，请问我执行了吗");
         that.global.saveSqllite(outline).then(function(data) {
          that.global.selectmessage().then(function(data) {
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
            });
          });
        }
      }
      if (
        redata.data.url == "sendfriendText" ||
        redata.data.url == "sendrootMessage"
      ) {
          that.MASSAGE_RED();
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
        //delete arr.userid;
         that.global.saveSqllite([arr]).then(function(data) {
           console.log('187行 写入数据库');
          that.global.selectmessage().then(function(data) {
            console.log(JSON.stringify(data));
            var counNum=0;
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
              counNum=counNum+data[key]['count']
              
            }
            that.countNum=counNum
            console.log("counNum+"+counNum)
            console.log("that.countNum+"+that.countNum)
            that.list = data.reverse();
            console.log(JSON.stringify(data));
            console.log(data[key]["send_time"]);
          });
         });
        
        console.log("222222222222222+"+that.countNum)
        // var d = new Date();
        // // 获取年，getFullYear()返回4位的数字
        // var year = d.getFullYear();
        // // 获取月，月份比较特殊
        // var month = d.getMonth() + 1;
        // // 变成两位
        // month = month < 10 ? "0" + month : month;
        // // 获取日
        // var day = d.getDate();
        // //时
        // var h = d.getHours();
        // h = h < 10 ? "0" + h : h;
        // //分
        // var m = d.getMinutes();
        // m = m < 10 ? "0" + m : m;
        // //秒
        // var s = d.getSeconds();
        // s = s < 10 ? "0" + s : s;
        // day = day < 10 ? "0" + day : day;
        // var timeData =
        //   year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
          // wh 注释
        // tongzhi(timeData, redata.data.data.msgtext);
    
      }
    };
  console.log( '这是一秋天3')
  
  console.log( console.log('248行'+that))
    that.global.selectmessage().then(function(data) {
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
       console.log('275行'+that);
      that.list = data.reverse();
      console.log(JSON.stringify(data));
    });
  },
  components: {
    headertit,
    [Dialog.Component.name]: Dialog.Component,
  },
  destroyed() {
    Indicator.close();
  },
  updated() {
    this.isimgtext();
  },
  watch: {
    countNum:function(n,o){
      var that=this
      that.countNum=n
    },
    list: function() {
      this.$nextTick(function() {
        Indicator.close();
      });
    },
    groups: function() {
      this.$nextTick(function() {
        Indicator.close();
      });
    },
    search() {
      this.searchfriend();
    }
  },
  methods: {
    isimgtext() {
      console.log(this.list);
      console.log(this.groups);
      if (this.list.length > 0) {
        var msgcontent = this.$refs.msgcontent;
        msgcontent.forEach(element => {
          if (element.innerText.split("=")[0] == "<img src") {
            element.innerHTML = "[图片]";
          }
        });
      }
      // if (this.groups.length > 0) {
      //   var grocontent = this.$refs.grocontent;
      //   grocontent.forEach(element => {
      //     if (element.innerText.split("=")[0] == "<img src") {
      //       element.innerHTML = "[图片]";
      //     }
      //   });
      // }
    },

    searchfriend() {
      // 获取接口中数据
      // const a = parseInt(localStorage.getItem("uid"));
      // const b=this.search.nick
      // let url=this.$store.state.apis+'/api/api/serachfriend?uid='+a+'&nick='+b
      // this.axios.get(url)
      //   .then(res=>{
      //     if(res.data.status=='ok'){
      //       console.log(res)
      //       this.reload()
      //     }
      //     this.list=res.data
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      let that = this;
       console.log('newsearchList2019'+that.newsearchList);
        console.log('345行'+that);
      var arr = that.list;
      var newarr = [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].usernick.indexOf(that.search) >= 0) {
          newarr.push(arr[i]);
        }
        if (that.search == "") {
          newarr = [];
        }
      }
       console.log('356行'+that);
      that.newsearchList = newarr;
      console.log('newsearchList2019'+that.newsearchList);
    },

    //  Search() {
    //   // search 是 v-model="search" 的 search
    //   var search = this.search;
    //   if (search) {
    //     this.searchData = this.list.filter(function(product) {
    //       // 每一项数据
    //       // console.log(product)
    //       return Object.keys(product).some(function(key) {
    //         // 每一项数据的参数名
    //         // console.log(key)
    //         return (
    //           String(product[key])
    //             // toLowerCase() 方法用于把字符串转换为小写。
    //             .toLowerCase()
    //             // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
    //             .indexOf(search) > -1
    //         );
    //       });
    //     });
    //   }else if(search.length===0){
    //     this.searchData=this.list;
    //   }else{
    //     return this.searchData;
    //   }
    // },

    ...mapMutations(["GROUP_ID","MASSAGE_RED","MASSAGE","GROUP_Name"]),

    dropGroup(rootids, num) {
      let uid = parseInt(localStorage.getItem("uid"));
      let type = num;
      let rootid = rootids;
      this.axios
        .post(this.$store.state.apis + "/api/api/messagedel", {
          type,
          uid,
          rootid
        })
        .then(res => {
          this.reload();
        });
    },
    dropFriend(outid) {
      
      console.log(outid);
   let that=this
    that.global.cleanscreen(outid).then(function(data) {
        console.log(data);
      });
     that.global. removemsg(outid).then(function(data) {
        console.log(data);
      });

      this.reload();
    },
    deamtFriend(friend, num, username, type,count,roomnick) {
      var that=this
      console.log("count"+count)
      console.log("that.countNum+"+that.countNum)
      that.countNum=that.countNum-count;
        if(that.countNum<=0){
          that.countNum=0
        }
      if(that.countNum==0){
          that.MASSAGE()
      }else{
          that.MASSAGE_RED()
      }
      console.log("count"+count)
      console.log("that.countNum+"+that.countNum)
      //  http://lc.sitedown.top/api/api/messagedel
      let uid = parseInt(localStorage.getItem("uid"));
      //let type = num;
      if (username == "username") {
        this.$router.push({
          name: "Massagelist",
          params: {
            friend_id: friend,
            username: username
          }
        });
      } else {
        if (type == 2) {
          friend = friend.substr(1);
          that.GROUP_ID(friend)
          that.GROUP_Name(roomnick)
          this.$router.push({
            name: "Groupslist",
            query: {
              groupId: friend,
              groupname: username,
              rootName:roomnick,
            }
          });
        } else {
          this.$router.push({
            name: "Massagelist",
            params: {
              friend_id: friend,
              username: username
            }
          });
        }
      }
    },
    deamtGroups(rootids, num, username) {
      this.GROUP_ID(rootids);
      //  http://lc.sitedown.top/api/api/messagedel
      let uid = parseInt(localStorage.getItem("uid"));
      let type = num;
      let rootid = rootids;
      this.axios
        .post(this.$store.state.apis + "/api/api/msgstate", {
          type,
          uid,
          rootid
        })
        .then(res => {
          console.log(res);
        });
      this.$router.push({
        name: "Groupslist",
        params: {
          friend_id: rootids,
          username: username
        }
      });
    },
    down(e) {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    },
    end(e) {
      this.endX = e.changedTouches[0].clientX;
      this.endY = e.changedTouches[0].clientY;
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
    }
  }
};
</script>


<style  scoped>
.sendtime {
  position: absolute;
  right: 34px;
  top: 14px;
  font-size: 14px;
}
.shows-con img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}
.pi {
  font-size: 14px;
  color: #999;
}
.dui {
  font-size: 18px;
  font-weight: normal;
}
.sss {
  width: 20px;
  height: 20px;
}
.button {
  height: 36px;
  position: absolute;
  right: 12px;
  top: 7px;
 /* width: 30%; */
  /* display: inline-block;
  border: 1px solid #e8e8e8;
  border-left: none;
  background: #fff;
  color: #888; */
  /* border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 8px 10px;
  text-align: right; */
}

.serchBtn {
    width: 96%;
     height: 36px;
  margin: auto;
  box-sizing: border-box;
  /* display: flex; */
  justify-content: center;
    display: -webkit-flex; 
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  position: relative;
   border-radius: 20px;
   border: 1px solid #e8e8e8;

}
.serchBtn input {
  outline: none;
  width: 90%;
  height: 36px;
  /* border-right: none;
  border-top-left-radius: 14px;
  border-bottom-left-radius: 14px; */

  padding-left: 20px;
  vertical-align: bottom;
  font-size: 16px;
}

.redSolid {
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: 5px;
  right: 5px;
  color: #fff;
  font-size: 14px;
}
.cf {
  word-break: keep-all;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.cf[data-type="0"] {
  transform: translate3d(0, 0, 0);
  transition: 0.5s;
}
.cf[data-type="1"] {
  transform: translate3d(-4rem, 0, 0);
  transition: 0.5s;
}

li {
  list-style: none;
}

.show-t {
  background-color: rgb(76, 59, 177);
}

.show-con {
  width: 100%;
  margin-top:16px; 
  /* height: 70vh; */
}
/* @media (max-height:609px){
	.show-con{
		height: 67vh;
	}
}
@media (min-height:609px) and (max-height:667px){
	.show-con{
		height: 73vh;
	}
}
@media (min-height:668px) and (max-height:736px){
	.show-con{
		height: 75vh;
	}
}
@media (min-height:737px) and (max-height:812px){
	.show-con{
		height: 77vh;
	}
}
@media (min-height:813px) and (max-height:1024px){
	.show-con{
		height: 82vh;
	}
}
@media (min-height:1025px) and (max-height:1366px){
	.show-con{
		height: 87vh;
	} */
/* } */

.shows-con > li {
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 5px;
  border-radius: 0.2rem;
  border-bottom: 1px solid #f1f1f1;
  position: relative;
}
.show-con > li {
  width: 100%;
  display: flex;
  align-items: center;
  background: #fff;
  padding: 7px;
  border-radius: 0.2rem;
  border-bottom: 1px solid #f1f1f1;
  position: relative;
}


.show-con > li.showcon-l {
  float: left;
}

.show-con > li .showcon-l > img {
  display: block;
  float: left;
  width: 52px;
  height: 52px;
  margin-right: 8px;
  border-radius: 15%;
}

.show-con > li .showcon-l > p {
  float: left;
  font-size: 14px;
  line-height: 45px;
  margin-left: 10px;
}
.selectBtn {
  background: #ff4949;
  color: #fff;
  width: 60px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.show-con > li .showcon-r {
  float: right;
}
.tabbar {
  height: 0 !important;
}

</style>