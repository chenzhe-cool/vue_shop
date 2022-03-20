<template>
  <div class="goods">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索商品 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" :clearable='true' @clear="getGoosdList">
        <el-button slot="append" icon="el-icon-search" @click="getGoosdList"></el-button>
      </el-input>
      <!-- 添加商品 -->
      <el-button type="primary" plain style="margin-left:20px" @click="goAddGoods">添加商品</el-button>
      
      <!-- 商品列表 -->
      <el-table border :data="goodsList" style="width: 100%;margin-top:10px" :v-loading="true">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="90"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" class="operation"  width="130">
          <template slot-scope="scope">
            <!-- 编辑商品按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoods(scope.row.id)"></el-button>
            <!-- 删除商品 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="delGoods(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:10px">
      </el-pagination>
    </el-card>
    
  </div>
</template>

<script>
export default {
  name:'Goods',
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:null,//总共商品条目数
      goodsList:[],
    }
  },
  created() {
    this.getGoosdList()    
  },
  methods:{
    //获取商品列表
    getGoosdList(){
      this.$http.get('goods',{params:this.queryInfo}).then(response=>{
        const res = response.data;
        if(res.meta.status!=200) return this.$message.error('获取商品列表数据失败！')
        this.goodsList = res.data.goods
        this.total = res.data.total
        //console.log(res)
      })
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoosdList()
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getGoosdList()
    },
    //编辑商品
    editGoods(id){
      console.log('编辑商品',id)
    },
    //删除商品
    delGoods(id){
      console.log('删除商品',id)
    },
    //跳转到添加商品界面（路由）
    goAddGoods(){
      this.$router.push('goods/addGoods')
    }
  }
}
</script>

<style scoped>
.box-card{
  margin:10px 0;
}
.input-with-select{
  width: 300px !important;
}
</style>