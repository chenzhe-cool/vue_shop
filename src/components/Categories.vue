<template>
  <div class="categories">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片展示区域 -->
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <el-button type="primary" plain style="margin-bottom:10px" @click="addCate">添加分类</el-button>
      <!-- 表格列表 -->
      <tree-table
      :v-loading="true"
      :selection-type="false"
      :expand-type="false"
      show-index
      border
      class="tree_table"
      :data="cateList"
      :columns="columns">
        <!-- 是否有效模板 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" v-if="scope.row.cat_deleted" style="color:red"></i>
          <i class="el-icon-success" v-else style="color:#67C23A"></i>
        </template>
        <!-- 排序摸板 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作模板 -->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate(scope.row.id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 底部分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:10px">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="分配角色" :visible.sync="isShowCateDialog " @close="cateDialogClose" :lock-scroll="false">
      <el-form :model="addCateForm" :rules="addCateFormRules" status-icon ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            clearable
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascaderProps"
            class="cascaderclass"
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="decideAddCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'Categories',
  data() {
    return {
      //查询条件
      queryInfo:{
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:'template',//表示将当前列定义为摸板列
          template:'isOk'//这一列使用摸板的名称
        },
        {
          label:'排序',
          prop:'cat_level',
          type:'template',//表示将当前列定义为摸板列
          template:'order'//这一列使用摸板的名称
        },
        {
          label:'操作',
          type:'template',//表示将当前列定义为摸板列
          template:'operation'//这一列使用摸板的名称
        }
      ],
      //商品分类列表
      cateList:[],
      total: 0, //总数据条数
      //添加分类的表单数据
      addCateForm:{
        cat_name:'',//将要添加分类的名称
        cat_pid: 0,//父级分类名称的id
        cat_level: 0,//分类的等级，默认要添加的是一级分类
      }, 
      isShowCateDialog:false,
      //定义表单规则
      addCateFormRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //存储父级分类数据列表
      parentCateList:[],
      //指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger:'hover',
        checkStrictly:'true'
      },
      //选中的父级分类ID
      selectKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    //获取商品分类列表
    getCateList(){
      this.$http.get('categories',{
        params:this.queryInfo
      }).then(response=>{
        const res = response.data;
        //console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取商品分类列表失败')
        this.cateList = res.data.result
        this.total = res.data.total //为总数据条数赋值
      })
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getCateList()
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getCateList()
    },
    //删除商品分类
    delCate(){
      console.log('del')
    },
    //点击添加分类按钮触发
    addCate(){
      //先获取父级分类的数据列表
      this.getParentCateList()
      //再打开对话框
      this.isShowCateDialog = true;
      
    },
    //点击确定，添加分类
    decideAddCate(){
      this.$refs.addCateFormRef.validate(valid=>{
        if(!valid) return false;
        this.$http.post('categories',this.addCateForm).then(response=>{
        const res = response.data
        if(res.meta.status!=201) return this.$message.error('添加商品分类失败！')
        this.$message.success('添加商品分类成功')
        this.getCateList()
      })
      })
      //关闭对话框
      this.isShowCateDialog = false
    },
    //添加分类对话框关闭时触发
    cateDialogClose(){
      //console.log('添加分类对话框关闭时触发')
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    //获取父级的分类列表
    getParentCateList(){
      this.$http.get('categories',{
        params:{ type:2 }
        }).then(response=>{
        const res = response.data
        if(res.meta.status!=200) return this.$message.error('获取父级商品分类数据失败！')
        this.parentCateList = res.data
      })
    },
    //选择项发生变化，触发该函数
    parentCateChange(){
      // 如果 selectKeys 数组中的length大于0，证明选择有父级分类
      var sklen = this.selectKeys.length
      if(sklen > 0){
        this.addCateForm.cat_pid = this.selectKeys[sklen-1];
        this.addCateForm.cat_level = sklen;
      }else{
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
        }
      },
      //编辑分类
      editCate(id){
        console.log('编辑分类',id)
      },
      //删除分类
      delCate(id){
        console.log('删除分类',id)
      }
    }
}
</script>

<style scoped>


.tree_table{
  font-family: 'Microsoft YaHei';
  font-size: 14px;
  color: #606266;
}
.cascaderclass{
  width: 100%;
}
.box-card{
  margin-top: 10px;
}
</style>