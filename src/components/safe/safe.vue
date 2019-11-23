<template>
    <div class="app-login">
     <Form class="from" ref="formInline" :model= "formInline" :rules= "ruleInline">
         <Form-item prop="user" >
              <Input prefix="ios-contact"  placeholder="输入用户名" style="width: 100%" clearable v-model= "formInline.user"/>
         </Form-item>
           <Form-item prop="password">
              <Input prefix="md-lock" placeholder="请输入旧密码" style="width: 100%" clearable v-model= "formInline.password" type="password"/>
         </Form-item>
         <Form-item prop="passwords">
              <Input prefix="md-lock" placeholder="请输入新密码" style="width: 100%" clearable v-model= "formInline.passwords" type="password"/>
         </Form-item>
         <Form-item>
               <Button type="primary" long @click="zc('formInline')" >修改密码</Button>  
         </Form-item>
     </Form>
  </div>
</template>
<script>
export default {
    data(){
        return {
             formInline: {
                    user: '',
                    password: '',
                    passwords:''
                },
            ruleInline:{
               user: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
             password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码最少6位', trigger: 'blur' }
                    ],
             passwords: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码最少6位', trigger: 'blur' }
                    ]
               

            }
        }
    },
    methods:{
        zc(name) {
      this.$refs[name].validate(valid => {
          console.log(valid)
        if (valid) {
          var that = this;
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          this.axios
            .post(this.$store.state.apis+"/api/api_login/register",this.formInline,config)
            .then(function(res) {
              console.log(res);
               const {msg,state,data}= res
               if(res.data.state===1){
                   that.$router.push({path: '/login'})
               }else if(res.data.state===0){
                  that.$Message.error(res.data.msg);
               }
              
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          this.$Message.error("修改失败");
        }
      });
    }
        
    }
}
</script>
<style>
.app-login{
    display: flex;
    width: 100vw;
    height: 100vh;
    background: #2e4e7f;
    justify-content: center;
    align-items: center;
    background:url(../../assets/bgc.jpeg);
    background-repeat: no-repeat;
    background-size: 100%;
}
.from{
  width: 80%;
}

</style>


