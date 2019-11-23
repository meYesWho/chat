<template>
  <div>
    <mt-header ref="uname" class="new-top" fixed>
      <router-link  slot="left" :to="{path:'/'}">
        <mt-button icon="back" ></mt-button>
      </router-link>
      <mt-button icon="more" slot="right" @click="tiaoz"></mt-button>
    </mt-header>
    <div class="chat" ref="xwBody" @click="hiddleEmo">
      <!-- 聊天内容 -->
      <div class="chat-content">
        <div
          v-for="item in messagelist"
          :key="item.id"
          v-bind:class="[item.uid==a ?'chat-first' :'chat-send']"
        >
          <div class="boboTime" ref="timeRef">
            <span>{{item.send_time}}</span>
          </div>
          <div class="bobo">
            <img
              :src="apis+item.useravatar"
              alt
              v-bind:class="[item.uid==a ?'img-display1' :'img-display2']"
            />
            <van-overlay :show="overshow" @click="overclick" />
            <p
              :style="item.msgtext.split('/')[0] == '<img src=http:'?'background-color:none;padding:0;':''"
              v-html="item.msgtext"
              v-bind:class="[item.uid==a ?'colorgreen' :'colorwhite']"
              @click="bigImg(item.id,$event,item.msgtext)"
              ref="bigImg"
              @touchstart.prevent="bigImg(item.id,$event,item.msgtext)"
              @touchend.prevent="smallImg(item.id,$event,item.msgtext)"
            ></p>
            <img :src="b" alt v-bind:class="[item.uid==a ?'img-display3' :'img-display4']" />
          </div>
        </div>
        <!-- <div v-if="item.isself==0" class="chat-send">
					<p>12321321321</p>
					<img src="" alt="">
        </div>-->
      </div>
      <!-- 聊天内容&input框 -->
    </div>
    <div class="chat-fooder">
      <!-- 底部聊天input框 -->
      <div class="chat-bot">
        <div class="emotin" :class="this.change==true?'emotin-show':'emotin-none'">
          <emotion @emotion="handleEmotion" :height="200"></emotion>
        </div>
        <div class="cdh">
          <van-uploader :model="messagelist" class="tu" :after-read="afterRead" />
          <img src="../../img/tu.png" alt class="tu-img" />
        </div>
        <input
          type="text"
          v-model="contentText"
          class="ku"
          @focus="masslisthuo "
          @blur="masslistshi"
          @keyup.enter="send"
          onkeyup="this.value=this.value.replace(/^\s+/,'')"
        />
        <div id="chatimg">
          <img src="../../img/toick (2).png" alt @click="isshow" />
          <img :src="show ?imgone:imgtwo" alt @click="send" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headertit from "../../components/header/header";
import Emotion from "../../components/Emotion/index";
import { Indicator } from "mint-ui";
import { compressImage } from "../../assets/compressImage";
import { mapState, mapMutations } from "vuex";
export default {
  inject: ["reload"],
  data() {
    return {
      b: localStorage.getItem("userImg"),
      groupId: "",
      overshow: false,
      change: false,
      contentText: "", //input输入的值
      messagelist:[],
      contentlist: [
        {
          u_avatar: "",
          message_content: ""
        }
      ],
      imgone: require("../../img/toick (3).png"),
      imgtwo: require("../../img/chat4.png"),
      show: true,
      a: parseInt(localStorage.getItem("uid")),
      username: ""
    };
  },
  components: {
    headertit,
    Emotion
  },
  created() {
    console.log('gropList');
    const a = parseInt(localStorage.getItem("uid"));
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
    var groupId = that.$route.query.groupId;
    that.groupId = groupId;
    that.global.status("r" + that.groupId);
    var data = that.messagelist;
    console.log(data)
    that.global.originList(2, "r" + that.groupId, 1).then(function(data) {
      console.log(3325255996)
      console.log(JSON.stringify(data));
      that.gettime(data).then(function(data) {
        for (var key in data) {
          console.log(data)
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
          var timeData =
            year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
          if (year == "1970" && h == "08" && m == "00" && s == "00") {
            data[key]["send_time"] = "";
          } else {
            data[key]["send_time"] = timeData;
          }
          data[key]["msgtext"] = data[key]["msgtext"].replace(
            /\#[\u4E00-\u9FA5]{1,3}\;/gi,
            that.emotion
          );
        }
        that.messagelist = data.reverse();
      });
    });

     that.global.ws.onmessage = function(e) {
       //数据的接收
       console.log('grouplist'+JSON.stringify(e))
      const redata = JSON.parse(e.data);
      // console.log(redata)
      const a = parseInt(localStorage.getItem("uid"));
       console.log('161行'+JSON.stringify(redata) );
      var arr = redata.data.data;
      if (
        redata.data.url == "sendfriendText" ||
        redata.data.url == "sendrootMessage"
      ) {
        console.log(2255666)
        that.MASSAGE_RED()
        var origin_id = arr.origin_id;
        var uid = arr.uid;
        var nick = arr.fnick;
        var favatar = arr.favatar;
        if (uid != that.a && arr.type == 1) {
          arr.origin_id = uid;
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
        if (arr.origin_id == that.groupId) {
          arr["status"] = 2;
        } else {
          arr["status"] = 1;
        }
        if (arr.type == 2) {
          arr.origin_id = "r" + arr.origin_id;
        }
        if (uid == that.a && arr.type == 1) {
          arr.usernick = nick;
          arr.useravatar = favatar;
        }
        delete arr.favatar;
        delete arr.fnick;
        console.log(arr);
         that.global.saveSqllite([arr]).then(function(data) {
          that.global.selectmessage().then(function(data) {
            that.gettime(data).then(function(data) {
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
                var timeData =
                  year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
                if (year == "1970" && h == "08" && m == "00" && s == "00") {
                  data[key]["send_time"] = "";
                } else {
                  data[key]["send_time"] = timeData;
                }
                data[key]["msgtext"] = data[key]["msgtext"].replace(
                  /\#[\u4E00-\u9FA5]{1,3}\;/gi,
                  that.emotion
                );
              }
              that.list = data.reverse();
            });
          });
        });
      }
      if (
        redata.data.url == "sendrootMessage" &&
        arr.origin_id.substr(1) == that.groupId
      ) {
        that.MASSAGE()
        console.log(that.groupId);
        that.global.originList(2, "r" + that.groupId, 1).then(function(data) {
          console.log(JSON.stringify(data));
          that.gettime(data).then(function(data) {
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
              var timeData =
                year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
              if (year == "1970" && h == "08" && m == "00" && s == "00") {
                data[key]["send_time"] = "";
              } else {
                data[key]["send_time"] = timeData;
              }
              data[key]["msgtext"] = data[key]["msgtext"].replace(
                /\#[\u4E00-\u9FA5]{1,3}\;/gi,
                that.emotion
              );
            }
            that.messagelist = data.reverse();
          });
        });
      }
    };

    if (this.global.ws.readyState == 0) {
      this.global.ws.onopen = function() {
        that.list();
      };
    } else {
      this.list();
    }
  },
  destroyed() {
    Indicator.close();
  },
  watch: {
    messagelist: function() {
      this.$nextTick(function() {
        Indicator.close();
      });
    }
  },
  mounted() {
    console.log(this.messagelist.length);
    if (this.messagelist.length > 0) {
      Indicator.open({
        text: "正在加载..."
      });
    }
  this.$refs.uname.$el.childNodes[2].innerHTML = "群聊"+"("+this.$store.state.rootname+")";
    if (this.$refs.uname.$el.childNodes[2].innerHTML == "undefined(群聊)") {
      this.$refs.uname.$el.childNodes[2].innerHTML = "群聊";
    }
    this.scrollToBottom();
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
     ...mapMutations(["MASSAGE_RED","MASSAGE"]),
bigImg(id, e, msgtext) {
      console.log("点击");
      // this.timeOutEvent=1
      var id = id;
      var  that = this;
      var bigImgHeight = e.target.clientHeight;
      //再次清空定时器，防止重复注册定时器
      var targetImg = e.target.tagName;
      if (targetImg == "IMG") {
        if (e.target.style.zIndex == "") {
          if (bigImgHeight <= 150) {
            this.overshow = true;
            e.target.style.width = "100%";
            e.target.style.position = "fixed";
            e.target.style.cursor = "move";
            e.target.style.zIndex = 2;
            e.target.style.left = "0";
            e.target.style.top = "25%";
          } else {
            this.overshow = true;
            e.target.style.width = "100%";
            e.target.style.height = "100%";
            e.target.style.position = "fixed";
            e.target.style.cursor = "move";
            e.target.style.zIndex = 2;
            e.target.style.left = "0";
            e.target.style.bottom = "0";
          }
        } else {
          // if(e.type==="touchstart"){
          //   console.log("点击")
          //    this.overshow = false;
          // e.target.style.width = "";
          // e.target.style.height = "";
          // e.target.style.position = "";
          // e.target.style.cursor = "";
          // e.target.style.zIndex = "";
          // e.target.style.left = "";
          // e.target.style.bottom = "";
          // }else{
          //   this.timeOutEvent = setTimeout(function() {
          //   console.log(e.target.src);
          //   var url = e.target.src;
          //   var alink = document.createElement("a");
          //   alink.href = url;
          //   alink.download = "click";
          //   alink.click();
          //   this.reload();
          // }, 2000);
          // }
            //回去
          this.overshow = false;
          e.target.style.width = "";
          e.target.style.height = "";
          e.target.style.position = "";
          e.target.style.cursor = "";
          e.target.style.zIndex = "";
          e.target.style.left = "";
          e.target.style.bottom = "";

              //下载
          //        this.timeOutEvent = setTimeout(function() {
          //         console.log(e.target.src);
          //         var url = e.target.src;
          //         var alink = document.createElement("a");
          //         alink.href = url;
          //         alink.download = "click";
          //         alink.click();
          //         this.reload();
          // }, 2000);
        }
      } else {
        console.log("文字");
      }
    },
   overclick() {
      this.reload();
      // this.overshow = false;
      // let bigimg=this.$refs.bigImg
      // console.log(bigimg)
      // for (let key in bigimg){
      //   var styeleImg=bigimg[key].firstElementChild.style;
      //     styeleImg.width = "";
      //     styeleImg.height = "";
      //     styeleImg.position = "";
      //     styeleImg.cursor = "";
      //     styeleImg.zIndex = "";
      //     styeleImg.left = "";
      //     styeleImg.bottom = "";
      // }
    },
    smallImg(id, e) {
      clearInterval(this.Loop);
      console.log("松开");
    },
    downs() {
      //必须同源才能下载
      var alink = document.createElement("a");
      alink.href = this.messagelist.msgtext;
      alink.download = "pic";
      alink.click();
    },
    gettime(arr) {
      var a = 0;
      return new Promise(open => {
        var length = arr.length - 1;
        for (var i in arr) {
          var item = arr[length - i];
          if (item.send_time - a > 180) {
            a = item.send_time;
            arr[length - i].send_time = item.send_time;
          } else {
            arr[length - i].send_time = null;
          }
        }
        console.log(arr);
        open(arr);
      });
    },
    afterRead(file) {
      // 大于1.5MB缩小像素上传
      if (file.file.size > 310000) {
        compressImage(file.content, {
          height: 320, // 压缩后图片的高，宽高若只传一个，则按图片原比例进行压缩
          quality: 0.8 // 压缩后图片的清晰度，取值0-1，不传默认为0.7，值越小，所绘制出的图像越模糊
        }).then(result => {
          // result即为压缩后的结果
          var img = "<img src='" + result + "'>";
          this.change = false;
          let msg = this.contentText;
          this.contentText = "";
          const a = parseInt(localStorage.getItem("uid"));
          const friend_id = this.$route.params.friend_id;
          this.websocketsend(
            JSON.stringify({
              url: "sendrootMessage",
              data: {
                uid: a,
                rootid: this.groupId,
                messages: img,
                msgtype: "img"
              }
            })
          );
        });
      } else {
        this.change = false;
        let msg = this.contentText;
        this.contentText = "";
        // 不做处理的jpg和png以及gif直接保存到数组
        var img = "<img src='" + file.content + "'>";
        console.log(img);
        console.log(file.content);
        const a = parseInt(localStorage.getItem("uid"));
        const friend_id = this.$route.params.friend_id;
        this.websocketsend(
          JSON.stringify({
            url: "sendrootMessage",
            data: {
              uid: a,
              rootid: this.groupId,
              messages: img,
              msgtype: "img"
            }
          })
        );
      }
    },

    // afterRead(file) {
    //   console.log(file);
    //   this.change = false;
    //   let msg = this.contentText;
    //   this.contentText = "";
    //   const a = parseInt(localStorage.getItem("uid"));
    //   var img = "<img src='" + file.content + "'>";
    //   this.websocketsend(
    //     JSON.stringify({
    //       url: "sendrootMessage",
    //       data: {
    //         uid: a,
    //         rootid: this.groupId,
    //         messages: img,
    //         msgtype:"img"
    //       }
    //     })
    //   );
    // },
    scrollToBottom() {
      //滚动条长度
      var currentDistance =
        this.$refs.xwBody.scrollHeight - this.$refs.xwBody.clientHeight;
      //当前滚动条距离顶部的距离
      var currentScroll_y = this.$refs.xwBody.scrollTop;
      if (currentDistance > 0 && currentDistance > currentScroll_y) {
        currentScroll_y =
          Math.ceil((currentDistance - currentScroll_y) / 10) + currentScroll_y;
        currentScroll_y =
          currentScroll_y > currentDistance ? currentDistance : currentScroll_y;
        this.$refs.xwBody.scrollTop = currentScroll_y;
        this.scrollToBottom();
      }
    },
    hiddleEmo() {
      this.change = false;
    },
    isshow() {
      this.change = !this.change;
    },
    handleEmotion(i) {
      this.contentText += i;
    },
    emotion(res) {
      let word = res.replace(/\#|\;/gi, "");
      const list = [
        "微笑",
        "撇嘴",
        "色",
        "发呆",
        "得意",
        "流泪",
        "害羞",
        "闭嘴",
        "睡",
        "大哭",
        "尴尬",
        "发怒",
        "调皮",
        "呲牙",
        "惊讶",
        "难过",
        "酷",
        "冷汗",
        "抓狂",
        "吐",
        "偷笑",
        "可爱",
        "白眼",
        "傲慢",
        "饥饿",
        "困",
        "惊恐",
        "流汗",
        "憨笑",
        "大兵",
        "奋斗",
        "咒骂",
        "疑问",
        "嘘",
        "晕",
        "折磨",
        "衰",
        "骷髅",
        "敲打",
        "再见",
        "擦汗",
        "抠鼻",
        "鼓掌",
        "糗大了",
        "坏笑",
        "左哼哼",
        "右哼哼",
        "哈欠",
        "鄙视",
        "委屈",
        "快哭了",
        "阴险",
        "亲亲",
        "吓",
        "可怜",
        "菜刀",
        "西瓜",
        "啤酒",
        "篮球",
        "乒乓",
        "咖啡",
        "饭",
        "猪头",
        "玫瑰",
        "凋谢",
        "示爱",
        "爱心",
        "心碎",
        "蛋糕",
        "闪电",
        "炸弹",
        "刀",
        "足球",
        "瓢虫",
        "便便",
        "月亮",
        "太阳",
        "礼物",
        "拥抱",
        "强",
        "弱",
        "握手",
        "胜利",
        "抱拳",
        "勾引",
        "拳头",
        "差劲",
        "爱你",
        "NO",
        "好的",
        "爱情",
        "飞吻",
        "跳跳",
        "发抖",
        "怄火",
        "转圈",
        "磕头",
        "回头",
        "跳绳",
        "挥手",
        "激动",
        "街舞",
        "献吻",
        "左太极",
        "右太极"
      ];
      let index = list.indexOf(word);
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`;
    },
    tiaoz() {
      this.$router.push("/chat");
    },

    masslistshi() {
      this.show = true;
    },
    masslisthuo() {
      this.show = false;
      this.change = false;
    },
    send() {
      this.change = false;
      var addLenght = this.contentText.lenght;
      if (addLenght == 0) {
        return;
      }
      let msg = this.contentText;
      this.contentText = "";

      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({
          url: "sendrootMessage",
          data: {
            uid: a,
            rootid: this.groupId,
            messages: msg
          }
        })
      );
    },
    list() {
      const a = parseInt(localStorage.getItem("uid"));
      this.websocketsend(
        JSON.stringify({
          url: "rootselect",
          data: {
            uid: a,
            rootid: this.groupId,
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
    }
  },
  computed: {
    ...mapState(["groupId", "apis"])
  }
};
</script>

<style scoped>
/* .mint-header {
  background: #26a2ff;
} */

.chat {
  position: relative;
  width: 100%;
  height: 94vh;
  overflow: scroll;
  margin-top: 15px;
  background: #eee;
}

@media (max-height: 609px) {
  .chat {
    height: 86vh;
  }
}
@media (min-height: 609px) and (max-height: 667px) {
  .chat {
    height: 88vh;
  }
}
@media (min-height: 668px) and (max-height: 736px) {
  .chat {
    height: 89vh;
  }
}
@media (min-height: 737px) and (max-height: 812px) {
  .chat {
    height: 90vh;
  }
}
@media (min-height: 813px) and (max-height: 1024px) {
  .chat {
    height: 92vh;
  }
}
@media (min-height: 1025px) and (max-height: 1366px) {
  .chat {
    height: 93vh;
  }
}

.chat-top {
  width: 100%;
  height: 40px;
  overflow: hidden;
  background-color: #5fb878;
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
  border-top: 1px #f5f5f5 solid;
  position: fixed;
  /* bottom: 0; */
  /* top: 60px; */
  bottom: 0;
}


.ku {
  width: 100%;
  border-radius: 12px;
  outline: none;
  height: 36px;
  border: 1px solid #dad9d9;
  font-size: 16px;
  margin-left: 10px;
  padding: 0 6px;
}
#chatimg{  
    display: flex;
    margin: 0  0 6px 4px ;
}
#chatimg > img {
  margin-top: 5px;
}

.tu{
opacity: 0;
width: 0px;
} 
.chat-bot > img {
  width: 34px;
  height: 34px;
}

.chat-content {
  width: 100%;
  height: auto;
  position: relative;
  top: 50px;
  bottom: 50px;
  overflow: scroll;
}

.chat-content > .time {
  width: 100%;
  position: absolute;
  top: -20px;
  text-align: center;
}
.chat-content p img {
  max-width: 100%;
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
.input-massage{
  width: 70%;
}
</style>
