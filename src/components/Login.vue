<template>
  <div class="login">
    <div class="login_box">
      <header class="myheader">登录</header>
      <!-- 登录表单 -->
      <el-form :model="form" ref="loginForm" :rules="loginForm" label-width="0px" class="my_form">
        <!-- 用户名输入 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" placeholder="请输入密码" v-model="form.password" show-password></el-input>
        </el-form-item>
        <!-- 登录和注册按钮部分 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="info" @click="register" disabled="">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',

      },
      //定义表单规则
      loginForm:{
        username:[{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password:[{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods:{
    onSubmit() {
      this.$refs.loginForm.validate((boolval)=>{
        if(boolval){
          this.$http.post('login',this.form).then(Response=>{
            var res =Response.data;
            // console.log(res)
            if(res.meta.status!=200) return this.$message.error('请输入正确的用户名和密码！');
            this.$message.success('登录成功');
            window.sessionStorage.setItem('token',res.data.token);
            this.$router.push({
              name:'home'
            })
          },
          Error=>{
            //console.log('请求失败',Error.message)
            this.$message.error('请求失败：'+Error.message);
          }
          )
        }
      })
    },
    register(){
      //console.log('register');
      this.$router.push({
        path:'/register'
      })
    }
  }
}
</script>

<style>
.myheader{
  text-align: center;
}
.login_box{
  position:absolute;
  height: 300px;
  width: 450px;
  border-radius: 3px;
  border: 2px solid #409EFF;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.myheader{
  height: 20%;
  width: 100%;
  border-bottom: 2px solid #409EFF;
  font-size: 40px;
}
.my_form{
  position: absolute;
  width: 100%;
  bottom: 0px;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>