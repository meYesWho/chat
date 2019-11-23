<template>
  <div class="app-login">
    <Form class="from" ref="formInline" :model="formInline" :rules="ruleInline">
      <Form-item prop="user">
        <Input
          prefix="ios-contact"
          placeholder="请输入用户名"
          style="width: 100%"
          clearable
          v-model="formInline.user"
        />
      </Form-item>
      <Form-item prop="password">
        <Input
          prefix="md-lock"
          placeholder="请输入密码"
          style="width: 100%"
          clearable
          v-model="formInline.password"
          type="password"
        />
      </Form-item>
      <Form-item prop="passwords">
        <Input
          prefix="md-lock"
          placeholder="请再次输入密码"
          style="width: 100%"
          clearable
          v-model="formInline.passwords"
          type="password"
        />
      </Form-item>
      <Form-item>
        <Button type="primary" long @click="zc('formInline')" :loading='loading'>注册</Button>
      </Form-item>
      <Form-item>
        <router-link to="/login" class="regi">已注册,去登录</router-link>
      </Form-item>
    </Form>
  </div>
</template>
<script>
export default {
  data() {
    return {
       loading:false, 
      formInline: {
        user: "",
        password: "",
        passwords: ""
      },
      ruleInline: {
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { type: "string", min: 6, message: "密码最少6位", trigger: "blur" }
        ],
        passwords: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { type: "string", min: 6, message: "密码最少6位", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    zc(name) {
      this.$refs[name].validate(valid => {
        console.log(valid);
        if (valid) {
          var that = this;
          that.loading=true;
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          this.axios
            .post(
              this.$store.state.apis + "/api/api_login/register",
              this.formInline,
              config
            )
            .then(function(res) {
              const { msg, state, data } = res;
              if (res.data.state === 1) {
                that.$Message.success("注册成功");
                that.$router.push({ path: "/login" });
                localStorage.setItem("uid", res.data.uid);
              }
              
               else if (res.data.state === 0) {
                that.$Message.error(res.data.msg);
                that.loading=false;
                
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          this.$Message.error("注册失败");
        }

      });
    }
  }
};
</script>
<style>
</style>


