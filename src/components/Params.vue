<template>
  <div class="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card class="box-card">
      <!-- 前面的文字提示 -->
    <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>
    <!-- 选择商品分类区域 -->
    <el-row style="margin:10px 0">
      <el-col>
        <span>选择商品分类：</span>
        <!-- 选择商品分类的级联框 -->
        <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            clearable
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handelChange"></el-cascader>
      </el-col>
    </el-row>
    <!-- 动态标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <!-- 添加动态参数面板 -->
      <el-tab-pane label="动态参数" name="many">
        <el-button class="btn" type="primary" size="mini" :disabled="isDisable" @click="addDynParams">添加参数</el-button>
        <!-- 动态参数数据展示 -->
        <el-table
          border
          :data="manyTableData"
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环渲染Tag标签 -->
              <el-tag
                v-for="(tag,i) in scope.row.attr_vals"
                :key="i"
                closable
                :disable-transitions="false"
                @close="handleClose(i, scope.row)">
                {{tag}}
              </el-tag>
              <!-- 输入的文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加的按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index" label="序号" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <!-- 删除按钮 -->
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 添加静态属性面板 -->
      <el-tab-pane label="静态属性" name="only">
        <el-button class="btn" type="primary" size="mini" :disabled="isDisable" @click="addStaParams">添加属性</el-button>
        <!-- 静态属性数据展示 -->
        <el-table
          border
          :data="onlyTableData"
          style="width: 100%">
          <!-- 展开行 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 循环渲染Tag标签 -->
              <el-tag
                v-for="(tag,i) in scope.row.attr_vals"
                :key="i"
                closable
                :disable-transitions="false"
                @close="handleClose(i, scope.row)">
                {{tag}}
              </el-tag>
              <!-- 输入的文本框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <!-- 添加的按钮 -->
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="序号" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="姓名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
              <!-- 删除按钮 -->
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="isDialogVisible"
      :lock-scroll='false'
      width="30%"
      @close="closeDig">
      <!-- 输入表单 -->
      <el-form :model="addForm" :rules="FormRules" ref="ruleForm" label-width="100px">
        <el-form-item 
        :label="titleText" 
        prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :lock-scroll='false'
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="closeEditDig">
      <!-- 输入表单 -->
      <el-form :model="editForm" :rules="FormRules" ref="editRuleForm" label-width="100px">
        <el-form-item 
        :label="titleText" 
        prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name:'Params',
  data() {
    return {
      cateList:[],
      //级联选择框的配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      //级联选择框双向绑定的数据
      selectCateKeys:[],
      activeName:'many',//被激活的页签名称
      manyTableData:[],//存储动态参数数据
      onlyTableData:[],//存储静态属性数据

      isDialogVisible:false,//对话框展示,

      addForm:{
        attr_name:''
      },//表单数据

      FormRules:{
        attr_name:[{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      editForm:{
        attr_name:''
      },//修改表单数据
      editDialogVisible:false,//显示修改对话框
      inputVisible:false,//控制Tag按钮与文本框的展示
      inputValue:'',//输入文本框的值，
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    getCateList(){
      this.$http.get('categories').then(response=>{
        const res = response.data;
        //console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取商品分类列表失败')
        this.cateList = res.data
      })
    },
    //获取参数数据
    getParamsData(){
      //根据所选分类的 id 和当前所处的面板，获取对应的参数表
      this.$http.get(`categories/${this.cateId}/attributes`,{
        params:{
          sel:this.activeName
        }
      }).then(response=>{
        const res = response.data;
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          //控制文本框的显示与隐藏
          item.inputVisible = false;
          //this.$set(item,inputVisible,false)
          //文本框中是输入值
          item.inputValue=''
          //this.$set(item,inputValue,'')
        })
        //console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取参数列表失败')
        if(this.activeName=='many'){
          this.manyTableData = res.data
          //console.log('manyTableData',this.manyTableData)
        }else{
          this.onlyTableData = res.data
          //console.log('onlyTableData',this.onlyTableData)
        }
      })
    },
    //级联选择框选中项变化，触发该函数
    handelChange(){
      //如果选择的不是三级分类
      if(this.selectCateKeys.length!=3){
        this.selectCateKeys = [];
        this.manyTableData=[];
        this.onlyTableData=[]
        return
      }
      //选中的为三级分类
      // console.log(this.selectCateKeys)
      this.getParamsData()
    },
    // Tag 页签点击的事件处理函数
    handleTabClick(){
      if(this.selectCateKeys.length==0) return this.$message.warning('请先选择商品分类')
      this.getParamsData()
    },
    //添加动态参数按钮触发事件
    addDynParams(){
      this.isDialogVisible = true
    },
    //添加静态属性按钮触发事件
    addStaParams(){
      this.isDialogVisible = true
    },
    //关闭对话框时触发
    closeDig(){
      this.$refs.ruleForm.resetFields()
    },
    //点击 确定按钮进行添加
    addParams(){
      this.$refs.ruleForm.validate(valid=>{
        if(!valid) return this.$message.warning('请输入正确的内容')
        this.$http.post(`categories/${this.cateId}/attributes`,{
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }).then(response=>{
          const res = response.data;
          //console.log(res)
          if(res.meta.status!=201) return this.$message.error('添加失败')
          this.$message.success('添加成功')
          this.isDialogVisible = false;
          this.getParamsData();
        })
      })
      
    },
    //点击按钮，展示修改的对话框
    showEditDialog(attr_id){
      this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
      {
        params:{ attr_sel: this.activeName }
      }).then(response=>{
        const res = response.data;
        if(res.meta.status!=200)return this.$message.error('获取参数信息失败')
        this.editForm = res.data;
      })
      this.editDialogVisible = true;
    },
    //点击修改对话框的 确定按钮触发
    editParams(){
      this.$refs.editRuleForm.validate(valid=>{
        if(!valid) return this.$message.warning('请输入参数！')
        //提交修改
        this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
      {
        attr_name:this.editForm.attr_name,
        attr_sel:this.activeName
      }).then(response=>{
        const res = response.data;
        if(res.meta.status!=200)return this.$message.error('修改失败！')
        this.$message.success('修改成功')
        this.getParamsData()
      })
      })
      this.editDialogVisible = false;
    },
    //关闭修改对话框时触发
    closeEditDig(){
      this.$refs.editRuleForm.resetFields()
    },
    //删除参数
    delParams(attr_id){
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          lockScroll:false,
          type: 'warning'
        }).then(() => {
          this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`).then(response=>{
            const res = response.data;
            if(res.meta.status!=200) return this.$message.error('删除参数失败！')
            this.$message.success('删除参数成功')
            this.getParamsData()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //关闭 Tag 标签时触发
    handleClose(i,row) {
      // console.log(i,'row',row)
      row.attr_vals.splice(i,1);
      this.saveAttrVals(row)
    },
    //保存标签，发起http请求
    saveAttrVals(row){
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" ")
      }).then(response=>{
        const res = response.data;
        if(res.meta.status!=200)return this.$message.error('此项操作失败！')
        this.$message.success('操作成功')
      })
    },
    //点击 new Tag时触发
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //输入框失去交点，或者按下enter键时触发，添加 Tag
    handleInputConfirm(row) {
      //如果输入的为空，则重置输入框
      if (row.inputValue.trim().length==0){
        row.inputValue = '';
        row.inputVisible = false;
        return
      }
      //如果输入了内容，则执行
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue='';
      row.inputVisible = false;
      //需要发起请求，保存这次操作到后台
      this.saveAttrVals(row)
    }
  },
  computed:{
    //如果按钮需要被禁用，则返回true，否则返回false
    isDisable(){
      if(this.selectCateKeys.length!==3){
        return true;
      }else{
        return false;
      }
    },
    //当前选择的三级分类的 Id
    cateId(){
      if(this.selectCateKeys.length==3) return this.selectCateKeys[2]
      return null;
    },
    //对话框标题
    titleText(){
      if(this.activeName=='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    },
  }
}
</script>

<style scoped>
.box-card{
  margin-top: 10px;
}
.btn{
  margin-bottom: 10px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>