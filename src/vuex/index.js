//状态

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'

Vue.use(Vuex)

const state = {
	massagewarn:false,		//新消息
	firendwarn: false,		//新朋友红色按钮
	groupId:0,				//群组ID
	apis:'http://chat.zp600.com',
	rootname:""
}

// const mutations={
//   getMassage(state){
// 	  state.massagewarn=true
//   }
// }

export default new Vuex.Store({
	state,
	actions,
	mutations,
})