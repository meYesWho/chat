<template>
  <div>
    <mt-header ref="uname" fixed>
      <router-link :to="{path:'/'}" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
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
              ref="bigImg"
              @touchstart.prevent="bigImg(item.id,$event,item.msgtext)"
              @touchend.prevent="smallImg(item.id,$event,item.msgtext)"
            ></p>

            <img :src="b" alt v-bind:class="[item.uid==a ?'img-display3' :'img-display4']" />
          </div>
        </div>
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
          <van-uploader :model="messagelist" class="tu" :after-read="afterRead" preview-image />
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
import { setTimeout } from "timers";
import { compressImage } from "../../assets/compressImage";
import { MessageBox } from "mint-ui";
import { mapState, mapMutations } from "vuex";
export default {
  inject: ["reload"],
  data() {
    return {
      sheetshow: false,
      overshow: false,
      timeShoe: true,
      b: localStorage.getItem("userImg"),
      a: parseInt(localStorage.getItem("uid")),
      time: new Date().toLocaleTimeString(),
      change: false,
      contentText: "", //input输入的值
      messagelist:
        [],
       
      contentlist: [
        {
          u_avatar: "",
          message_content: ""
        }
      ],
      imgone: require("../../img/toick (3).png"),
      imgtwo: require("../../img/chat4.png"),
      show: true,
      content: "",
      comment: "",
      username: "",
      id: 0,
      msgs: null
    };
  },
  computed: {
    ...mapState(["apis"])
  },
  components: {
    headertit,
    Emotion
  },
  mounted() {
    this.$refs.uname.$el.childNodes[2].innerHTML = this.username;
  },
  methods: {
        ...mapMutations(["MASSAGE_RED","MASSAGE"]),
    inputUt(){
        this.send();
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
    smallImg(id, e,msgtext) {

  
    },

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

    // 图片上传
    afterRead(file) {
      // 大于1.5MB的jpeg和png图片都缩小像素上传
      if (file.file.size > 310000) {
        compressImage(file.content, {
          // 压缩后图片的宽
          height: 320, // 压缩后图片的高，宽高若只传一个，则按图片原比例进行压缩
          quality: 0.8 // 压缩后图片的清晰度，取值0-1，不传默认为0.7，值越小，所绘制出的图像越模糊
        }).then(result => {
          // result即为压缩后的结果
          var img = "<img src='" + result + "'>";
          const a = parseInt(localStorage.getItem("uid"));
          const friend_id = this.$route.params.friend_id;
          this.websocketsend(
            JSON.stringify({
              url: "sendfriendText",
              data: {
                uid: a,
                friend_id: friend_id,
                messages: img,
                msgtype: "img"
              }
            })
          );
        });
      } else {
        // 不做处理的jpg和png以及gif直接保存到数组
        var img = "<img src='" + file.content + "'>";
        const a = parseInt(localStorage.getItem("uid"));
        const friend_id = this.$route.params.friend_id;
        this.websocketsend(
          JSON.stringify({
            url: "sendfriendText",
            data: {
              uid: a,
              friend_id: friend_id,
              messages: img,
              msgtype: "img"
            }
          })
        );
      }
    },
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

    masslistshi() {
      this.show = true;
    },

    masslisthuo() {
      this.change = false;
      this.show = false;
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
      const friend_id = this.$route.params.friend_id;
      console.log({
        messages: msg
      });
      this.websocketsend(
        JSON.stringify({
          url: "sendfriendText",
          data: {
            uid: a,
            friend_id: friend_id,
            messages: msg
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
    // 将匹配结果替换表情图片
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
        "不",
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
    }
  },
  updated() {
    this.scrollToBottom();
  },
  created() {
    const friend_id = this.$route.params.friend_id;
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
    that.global.status(friend_id);
    var data = that.messagelist;
    // console.log(status(friend_id)+'463行');
    that.global.originList(1, friend_id, 1).then(function(data) {
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
        console.log(that.messagelist);
      });
    });

    that.global.ws.onmessage = function(e) {
      //数据接收
      const redata = JSON.parse(e.data);
      console.log(redata); 
      let arr = redata.data.data;
      if (
        redata.data.url == "sendfriendText" ||
        redata.data.url == "sendrootMessage"
      ) {
        var origin_id = arr.origin_id;
        var uid = arr.uid;
        var nick = arr.fnick;
        var favatar = arr.favatar;
        console.log("dsdsadsadsadsadsad")
        console.log( "arr"+ JSON.stringify(arr)  )
       console.log("arr.type"+arr.type)
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
        }
            that.MASSAGE_RED();
        console.log(that)
        arr["status"] = 1;
        if (uid == that.a || uid == friend_id) {
          arr.status = 2;
        }
        if (arr.type == 2) {
          arr.origin_id = "r" + arr.origin_id;
        }
        if (uid == that.a) {
          arr.usernick = nick;
          arr.useravatar = favatar;
        }
        delete arr.favatar;
        delete arr.fnick;
        //delete arr.userid;
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
                data[key]["msgtext"] = data[key]["msgtext"].replace(
                  /\#[\u4E00-\u9FA5]{1,3}\;/gi,
                  that.emotion
                );
                if (year == "1970" && h == "08" && m == "00" && s == "00") {
                  data[key]["send_time"] = "";
                } else {
                  data[key]["send_time"] = timeData;
                }
              }
              that.list = data.reverse();
            });
          });
        });
          
      }
      if (
        redata.data.url == "sendfriendText" &&
        (arr.uid == friend_id || arr.origin_id == friend_id)
      ) {
         that.global.originList(1, friend_id, 1).then(function(data) {
          that.gettime(data).then(function(data) {
            console.log(22556+663666)
            that.MASSAGE()
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
    if (that.global.ws.readyState == 0) {
      that.global.ws.onopen = function() {
        // that.histMassage();
        that.send();
      };
    } else {
      // this.histMassage();
      that.send();
    }
  }
};
</script>

<style scoped>
.chat {
  position: absolute;
  width: 100%;
  height: 94vh;
  overflow-y: scroll;
  margin-top: 15px;
  background: #eee;
  /* z-index:1; */
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

.pres-img {
  color: #ffffff;
}
.img-cun {
  z-index: 4;
  position: fixed;
  top: 45%;
  left: 32%;
}
.input-massage{
  width:  70%;

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

</style>
