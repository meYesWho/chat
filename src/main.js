import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/'
import axios from './http'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import global from './components/api/global.js';
import tongzhi from './tongzhi'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'vant/lib/index.css';
import Uploader from 'vant';

import { SwipeCell } from 'vant';

Vue.use(SwipeCell);
Vue.use(ElementUI)
Vue.use(Uploader);

Vue.prototype.global = global
//import VueWebsocket from "vue-websocket";
//Vue.use(VueWebsocket);
Vue.use(iView);
Vue.use(MintUI)
Vue.config.productionTip = false


Vue.prototype.axios = axios
Vue.prototype.tongzhi = tongzhi
import "babel-polyfill";
import Audio from './components/audio/audio.vue'
import Back from './lib/sb'
// Vue.component('my-audio', Audio)
//document.addEventListener('plusready', function(){
 //	 plus.push.setAutoNotification(true);   
 	 //openDB()
	// wakeLock()
 	// openintvaltion()
 	// plus.runtime.setBadgeNumber(0);
	new Vue({
		Back,
		router,
		store,
		render: h => h(App)
	}).$mount('#app')
  //});


