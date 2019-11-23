<template>
  <div class="audio">
    <audio id="audios" type="audio/mp3">
      <source :src="sss" />
    </audio>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sss: ""
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      var that = this;
      that.global.ws.onmessage = function(even) {
        //数据接收
        const redata = JSON.parse(even.data);
        if (redata.data.url == "sendfriendText") {
          // if (redata.data.data.isself == 0) {
            console.log("接受到一条新消息，调用一次");
            that.sss = require("../../assets/msg.mp3");
            that.Play();
          // }
        }
      };
      // }
    },
    Play() {
      var add = document.getElementById("audios");
      add.load();
      add.play();
    }
  }
};
</script>