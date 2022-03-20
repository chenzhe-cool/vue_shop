<template>
  <el-container class="myhome">
    <el-backtop></el-backtop>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="src\assets\logo.png" alt="" style="border:1px solid red;height:60%"> -->
        <span>电商管理后台</span>
      </div>
      <el-button class="btn" plain @click="loginOut">退出登录</el-button>
    </el-header>
    <!-- 主体部分 -->
    <el-container>
    <!-- 侧面导航 -->
    <el-aside width="200px">
      <Aside></Aside>
    </el-aside>
    <!-- 主体内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import Aside from './Aside.vue'
export default {
  name:'Home',
  data(){
    return{}
  },
  components:{Aside},
  mounted(){
    var curRouterPath = window.sessionStorage.getItem('activePath')
    this.$bus.$emit('curRouterPath',curRouterPath)
    //console.log(curRouterPath)
  },
  methods:{
    loginOut(){
      window.sessionStorage.clear();
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.myhome{
  height: 100%;
}
.el-header {
  display: flex;
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
  justify-content: space-between;
  font-size: 20px;
  align-items: center;
}
  
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  /* text-align: center; */
}
.btn{
  height: 40px;
}
.el-button.is-plain{
  background: #B3C0D1;
}
</style>