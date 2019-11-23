import Vue from 'vue'
import Router from 'vue-router'
import Login from  './components/user/login.vue'
import lun from  './components/user/lun.vue'
import Index from './components/index/index.vue'
import Rege from './components/user/rege.vue'
import Tabbar from './components/tabbar/tabbar.vue'
import Massage from './components/massage/massage.vue'
// import Show from './components/show/show.vue'
import Friend from './components/friend/friend.vue'
import Search from './components/search/search.vue'
import Safe from './components/safe/safe.vue'
// import Newfrend from './components/newfrend/newfrend.vue'
import Mine from './components/mine/mine.vue'
import  Chat from './components/massagelist/chat.vue'
import Massagelist from './components/massagelist/massagelist.vue'
import Invite from './components/massagelist/invite.vue'
import Groups from './components/groups/groups.vue'
import Group from './components/group/group.vue'
import Groupslist from './components/groupslist/groupslist.vue'
import er from './components/mine/er.vue'
import set from './components/mine/set.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'*',
      name:'Login',
      component:Login,

    },
    {
      path:'/',
      name:'Massage',
      component:Massage,
      meta: {
        footShow: true,
         // true显示，false隐藏
       },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      // meta: {
      //   footShow: false,
      //   // true显示，false隐藏
      //  },
    },
    {
      path: '/lun',
      name: 'lun',
      component: lun,
     
    },
    {
      path:'/friend',
      name:'Friend',
      component:Friend,
      meta: {
        footShow: true, // true显示，false隐藏
       },
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      meta: {
        footShow: true, // true显示，false隐藏
       },
    },
    
    {
      path: '/rege',
      name: 'Rege',
      component: Rege
    },
    {
      path:'/tabbar',
      name:'Tabbar',
      component:Tabbar
    },
    // {
    //   path:'/show',
    //   name:'Show',
    //   component:Show,
    //   meta: {
    //     footShow: true, // true显示，false隐藏
    //    },
    // },
    {
      path:'/mine',
      name:'Mine',
      component:Mine,
      meta: {
        footShow: true, // true显示，false隐藏
       },
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/safe',
      name: 'Safe',
      component: Safe
    },
    // {
    //   path: '/newfrend',
    //   name: 'Newfrend',
    //   component: Newfrend
    // },
    {
      path: '/massagelist',
      name: 'Massagelist',
      component: Massagelist
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat
    },
	{
	  path: '/groups',
	  name: 'Groups',
	  component: Groups
  },
  {
	  path: '/group',
	  name: 'Group',
	  component: Group
  },
  {
	  path: '/invite',
	  name: 'Invite',
	  component: Invite
  },
  {
	  path: '/groupslist',
	  name: 'Groupslist',
	  component: Groupslist
  },
  {
	  path: '/er',
	  name: 'er',
	  component: er
  },
  {
	  path: '/set',
	  name: 'set',
	  component: set
  },
  
  ]
})



