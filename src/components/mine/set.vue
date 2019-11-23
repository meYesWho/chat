<template>
    <div>
         <mt-header title="设置" class="new-top" fixed>
      <router-link to="/mine" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header>
    <el-button  class="btns" @click="modifyUserItem" v-has="'sys_user_update'">修改</el-button>
    <span>设置</span>
    </div>
</template>
<script>
export default {
    data(){
        return{
            modifyUserItem:""
        }
    },
    methods:{

    }
}
</script>
<style>
    
</style>