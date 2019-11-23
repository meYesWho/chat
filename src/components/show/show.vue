<template>
	<div class="show">
		<headertit title="广场"/>
		<ul v-infinite-scroll="loadMore"
  			infinite-scroll-disabled="loading"
  			infinite-scroll-distance="20" 
			class="show-con">
			<li class="cf" v-for="imte in showList" :key="imte.id">
				<div class="showcon-l">
					<img :src="imte.avatar" alt />
					<p>{{ imte.nickname }}</p>
				</div>
				<div class="showcon-r">
					<i-button type="primary" @click="add(imte.id,imte.nickuser)" class="show-btn">加好友</i-button>
				</div>
			</li>
		</ul>
	</div>

</template>

<script>
    import headertit from "../../components/header/header";
	import image from "../../img/show1.jpg";
	export default {
       components:{
        headertit
    },
		inject:['reload'],
		data() {
			return {
				img: "",
				nickname: "",
				friendid: "",
				showList: [],
				modal1: false,
				page:0
			};
		},
		methods: {
			loadMore() {
				var that = this;
				this.loading = true;
				 if (this.global.ws.readyState == 0) {
					this.global.ws.onopen = function() {
						that.userList();
					}
				} else {
					this.userList()
				}
				this.loading = false;
				
				var that = this;
			},
			add(id, nickname) {
				// friendAdd?uid=**&id=**&nickname=**
				const a = parseInt(localStorage.getItem("uid"));
				this.$Modal.confirm({
					content: '<p>是否添加对方为好友？</p>',
					onOk: () => {
						this.websocketsend(JSON.stringify({
							url: "friendAdd",
							data: {
								uid: a,
								id: id,
								nickname:nickname
							}
						}))
						this.global.ws.onmessage = (e=>{
							const addFriend = JSON.parse(e.data);
							if(addFriend.status=="ok"&&addFriend.data.url=='friendAdd'){
								 this.$Message.info('消息已发送');
								 this.reload()
							}
						})																			
					},
					onCancel: () => {
						this.$Message.info('已取消');
					}
            	});                      
			},
			// list() {
			// 	const a = parseInt(localStorage.getItem("uid"));
			// 	let page=this.page+1
			// 	this.websocketsend(JSON.stringify({
			// 		url: "userList",
			// 		data: {
			// 			uid: a,
			// 			page:1
			// 		}
			// 	}))
			// },
			userList(){
				// http://lc.sitedown.top/api/api/user_list?uid=**&page=****
				let uid = parseInt(localStorage.getItem("uid"));
				let page=this.page+1
				this.axios.post(
					this.$store.state.apis+'/api/api/user_list',
					{uid,page}
				).then(res=>{
					if(res.data.status="ok"){
						let userList=res.data.data.user;
						let pages=res.data.data.pages
						Object.keys(userList).forEach(key=>{
							this.showList.push(userList[key])
						});			
						this.page=page
					}					
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
		created() {
			
			// var that = this;
			// this.global.ws.onmessage = function(e) {
			// 	//数据接收
			// 	const redata = JSON.parse(e.data);
			// 	console.log(redata)
			// 	if(redata.status=="ok"&&redata.data.url=='userList'){
			// 	}
			// 	that.showList = redata.data.data;
			// }
			// if (this.global.ws.readyState == 0) {

			// 	this.global.ws.onopen = function() {
			// 		that.list();
			// 	}
			// } else {
			// 	this.list();
			// }



		},
	};
</script>

<style scoped>
	.cf {
		display: block;
		content: "";
		clear: both;
	}

	li {
		list-style: none;
	}

	.show-t {
		background-color: rgb(76, 59, 177);
	}

	.show-con {
		width: 100%;
		max-height: 100vh;
        overflow-y: auto;
		padding-bottom: 4.5rem;
	}

	.show-con>li {
		width: 97%;
		background: #fff;
		overflow: hidden;
		margin: 2px auto 2px;
		padding:10px;
		position: relative;
		border-radius: 0.2rem;
		border-bottom: 1px solid #f1f1f1;
	}

	.show-con>li .showcon-l {
		float: left;
	}

	.show-con>li .showcon-l>img {
		display: block;
		float: left;
		width: 45px;
		height: 45px;
	}

	.show-con>li .showcon-l>p {
		float: left;
		font-size: 14px;
		line-height: 45px;
		margin-left: 10px;
	}

	.show-con>li .showcon-r {
		float: right;
	}

	.show-btn {
		font-size: 12px;
		background-color:#26a2ff;
		position: absolute;
		right: 7px;
		top: 50%;
		transform: translateY(-50%);
	}
</style>



