<template>
  <el-menu
    :default-active="activePath"
    class="el-menu-vertical-demo"
    :unique-opened="true"
    :router='true'
    background-color="#D3DCE6"
    text-color="#333"
    active-text-color="#409EFF">
    <!-- 一级菜单 -->
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconObj[item.id]" class="myicon"></i>
        <span>{{item.authName}}</span>
      </template>
      <!-- 二级菜单 -->
      <el-menu-item 
        :index="'/'+subItem.path" 
        v-for="subItem in item.children" 
        :key="subItem.id" 
        @click="saveNavState('/'+subItem.path)"
        style="padding-right:0">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subItem.authName}}</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name:'Aside',
  data(){
    return{
      menuList:[],
      iconObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-check',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data'
      },
      activePath:'',//被激活的连接地址
    }
  },
  created(){
    this.getMenuList();
    this.$bus.$on('curRouterPath',curRouterPath=>{
      this.activePath = curRouterPath
    })
  },
  mounted(){
    
  },
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath);
    // },
    getMenuList(){
      this.$http.get('menus').then(Response=>{
        var res = Response.data;
        // console.log(res);
        if(res.meta.status!=200) return this.$message.error(res.meta.msg);
        this.menuList = res.data;

      })
    },
    //保存连接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  }

}
</script>

<style scoped>
.myicon{
  margin-right: 10px;
}
</style>