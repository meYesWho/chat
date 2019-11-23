<template>
	<div class="tabbar">
		<!--Tabber-->
		<mt-tabbar v-model="active" fixed>
			<mt-tab-item id="massage" class="massage">
				 <i v-show="massagewarn" class="redSolid"></i>
				<img slot="icon" v-if="!(active=== 'massage')" :src="img11">
				<img slot="icon" v-if="active=== 'massage'" :src="img1">
				消息
			</mt-tab-item>
			<mt-tab-item id="friend" class="friend">
				 <!-- <i v-show="firendwarn" class="redSolid"></i> -->
				<img slot="icon" v-if="!(active=== 'friend')" :src="img2">
				<img slot="icon" v-if="active=== 'friend'" :src="img22">
				好友
			</mt-tab-item>
			<!-- <mt-tab-item id="show">
				<img slot="icon" v-if="!(active=== 'show')" :src="img3">
				<img slot="icon" v-if="active=== 'show'" :src="img33">
				广场
			</mt-tab-item> -->
			<mt-tab-item id="user">
				<img slot="icon" v-if="!(active=== 'user')" :src="img4">
				<img slot="icon" v-if="active=== 'user'" :src="img44">
				我的
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	export default {		
		name: 'footerbar',
		props: {
			current: String,
		},
		data() {
			return {
				active: this.current,
				active: '',
				img11: require("../../img/massage2.png"),
				img1: require("../../img/massage.png"),
				img2: require("../../img/friend2.png"),
				img22: require("../../img/friend.png"),
				
				img4: require("../../img/user2.png"),
				img44: require("../../img/user.png"),
				show:true,
			}
		},
		methods: {

		},
		computed:{
			...mapState([
				'massagewarn',
				'firendwarn', 
			]),
		},
		created(){
				let that=this;
				that.active="massage"
		},

		watch: {
			active: function(val, oldVal) {
				// 这里就可以通过 val 的值变更来确定去向


				switch (val) {
					case 'massage':
						this.$router.replace('/');
						break;
					case 'friend':
						this.$router.replace('/friend');
						break;
					case 'show':
						this.$router.replace('/show');
						break;
					case 'message':
						this.$router.replace('/message');
						break;
					case 'user':
						this.$router.replace('/mine');
						break;
				}
			}
		}
	}
</script>


<style>

.mint-tabbar.is-fixed{
	border-top: 1px solid #e6e6e6 !important;
}
.mint-tabbar > .mint-tab-item{
	color: #333;
	background: #EEEEEE;
}

.mint-tabbar > .mint-tab-item.is-selected{
	background: #ffffff !important;
	color: #08c261 !important;
}
.massage{position: relative;

}
.friend{position: relative;
}
.redSolid{
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: red;
      position: absolute;
      top: 5px;
      right: 5px;
    }
.tabbar{
    height: 53px;
	background: #eeeeee;
	}
	.mint-tab-item-label{
		font-size: 16px !important;
	}
</style>

