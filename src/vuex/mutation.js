//写方法
import {
	CHANGE_RED,
	MASSAGE_RED,
	GROUP_ID,
	MASSAGE,
	GROUP_Name,
} from './mutation-types.js'

export default {
	// 消息
	[MASSAGE_RED](state){
		state.massagewarn=true;
	},
	[MASSAGE](state){
		state.massagewarn=false;
	},
	// 新朋友
	[CHANGE_RED](state,firendwarn){
		state.firendwarn=firendwarn;
	},
	// 群组ID
	[GROUP_ID](state,groupId){
		state.groupId=groupId;
	},
	
	[GROUP_Name](state,rootname){
		state.rootname=rootname;
	},
	
	
// 	  getMassage(state){
// 	  state.massagewarn=true
//   }

	
}