<template>
  <div class="rights">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card class="box-card">
      <el-table
        :data="rightsList22"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="120"></el-table-column>
        <el-table-column prop="authName" label="权限名称" > </el-table-column>
        <el-table-column prop="path" label="路径" > </el-table-column>
        <el-table-column prop="level" label="权限等级" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:10px">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Rights',
  data() {
    return {
      rightsList:[],
      rightsList22:[],//rightsList 的副本
      total:null,
      pagenum:1,//当前页面
      pagesize:5,//每页展示多少条数据
      
    }
  },
  created(){
    this.getRightsList();
  },
  watch:{
    //监听pagesize的改变，从而改变展示数据rightsList22
    pagesize(){
      this.rightsList22 = this.rightsList.slice(0,this.pagesize)

    },
    //监听pagenum的改变，从而改变展示数据rightsList22
    pagenum(){
      this.rightsList22 = this.rightsList.slice(this.pagesize*(this.pagenum-1), this.pagesize*this.pagenum)
    }
  },
  methods:{
    getRightsList(){
      this.$http.get('rights/list').then(Response=>{
        var res = Response.data;
        //console.log(res);
        if(res.meta.status!=200) return this.$message.error('权限列表获取失败！')
        this.rightsList = res.data;
        this.total = res.data.length;
        //console.log(this.rightsList)
        this.rightsList22 = this.rightsList.slice(0,this.pagesize)
        
      })
    },
        //监听pagesize改变的事件
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pagesize = val;
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pagenum = val;
    },
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  margin-top: 10px;
  width: 100%;
}

</style>