<template>
	<div class="groups">
		<mt-header title="群组列表" class="new-top" fixed>
		  <router-link to="/" slot="left">
		    <mt-button icon="back"></mt-button>
		  </router-link>
		</mt-header>
		<div class="group-box">
				<div class="group-massage"  v-for="(item,i) in list" :key="i"   @click="deamt(item.id,item.root_name)">
				<div class="group-img">
					<img :src="apis+item.root_avatar" />
				</div>
				<div class="group-text">
					<p>{{item.root_name}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {mapState,mapMutations} from 'vuex';
export default {
	data() {
		return {
			list:[

			],

		}
	},
	computed:{
		...mapState([
			'groupId',
			'apis'
		]),
	},
	methods:{
		...mapMutations([
			"GROUP_ID","GROUP_Name","MASSAGE_RED"
		]),
      	deamt(friend,rootName) {
			this.GROUP_ID(friend)
			this.GROUP_Name(rootName)
			this.$router.push({
				name: 'Groupslist',
				query: {
					groupId: friend,
					rootName:rootName
				}
			})
		},
	},
	
	created(){    
	const friend_id = this.$route.params.friend_id;
    var that = this;
    var username = that.$route.params.username;
    that.username = username;
	that.global.status(friend_id)
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
      // 
      // console.log(that.avatar)
    };

	
		   
   
	const a = parseInt(localStorage.getItem("uid"));
      this.axios.post(this.$store.state.apis+"/api/api/rootlist/",{uid:a}).then(function(res){
				 that.list=res.data.data

      }) .catch(function(error) {
              console.log(error);
            });
	}
}

</script>

<style scoped>
.groups{
	margin-top: -40px;
	padding-top: 40px;
}
	.new-top {
	  background-color:#26a2ff
	}
	.group-box{
		width: 100%;
		height: auto;
		margin-top: 60px;
	}
	.group-massage{
		width: 100%;
		height: 60px;
		display: flex;
		align-items: center;
	}
	.group-img{
	width: 60px;
    padding: 6px;
    height: 60px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #F9F9F9;

	}
	.group-img>img{
		width: 100%;
		height: 100%;
		border-radius:15%;
		overflow: hidden;
	}
	.group-text{
		width: 80%;
		height: 60px;
		border-bottom: 1px solid #f1f1f1;
		display: flex;
		align-items: center;
	}
	.group-text>p{
		font-family: "curlz mt";
		color: #000000;
		font-size: 16px;
	}
</style>
