<template>
  <div class="addGoods">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 前面的文字提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activateIndex-0" :space="300" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单数据 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 纵向标签页 -->
        <el-tabs v-model="activateIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handelChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="i" v-for="(i,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <!-- action 表示图片要上传到的后台API地址 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本区域 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" style="margin-top:10px" @click="add">添加商品</el-button>
          </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img :src="previewPath" alt="picture" style="width:100%;height:100%">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'AddGoods',
  data() {
    return {
      activateIndex: '0',//控制步骤条，默认0
      addForm:{
        goods_name:'',
        goods_price:null,
        goods_weight:null,
        goods_number:null,
        goods_cat:[],//商品所属的分类数组
        pics:[],//存放图片信息
        goods_introduce:'',//商品的详情描述
        attrs:[]

      },//表单数据
      addFormRules:{
        goods_name:[{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price:[{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight:[{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number:[{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat:[{ required: true, message: '请输入正确信息', trigger: 'blur' }]
      },//定义表单规则
      cateList:[],
      //级联选择框的配置对象
      cateProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      manyTableData:[],//动态参数列表
      onlyTableData:[],//静态属性列表
      //图片上传组件的headers请求头对象
      headersObj:{
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath:'',//图片预览url
      previewVisible:false,//图片预览对话框显示
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    //获取商品分类列表
    getCateList(){
      this.$http.get('categories').then(response=>{
        const res = response.data;
        //console.log(res)
        if(res.meta.status!=200) return this.$message.error('获取商品分类列表失败')
        this.cateList = res.data
        //console.log(this.cateList)
      })
    },
    //级联选择框选中项变化，触发该函数
    handelChange(){
      //如果选择的不是三级分类
      if(this.addForm.goods_cat.length!=3){
        this.addForm.goods_cat = []
        return
      }
    },
    //离开标签之前进行的操作，activeName 即将进入的标签页，oldActivateName即将离开的标签页
    beforeTabLeave(activeName,oldActivateName){
      if(this.addForm.goods_cat.length!=3){
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    //标签被激活
    tabClicked(){
      //选中动态参数面板
      if(this.activateIndex==1){
        this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'many'}
        }).then(response=>{
        const res = response.data;
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length ? item.attr_vals.split(" ") : []      
        });
        if(res.meta.status!=200) return this.$message.error('获取动态参数列表失败')
        this.manyTableData = res.data 
      })
      }else if(this.activateIndex==2){
        this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{sel:'only'}
        }).then(response=>{
        const res = response.data;
        //console.log(res)
        
        if(res.meta.status!=200) return this.$message.error('获取静态属性列表失败')
        this.onlyTableData = res.data 
      })
      }
    },
    //处理图片预览效果
    handlePreview(file){
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //处理移除图片的操作
    handleRemove(file){
      //console.log(file)
      //1.获取需要移除图片的临时路径
      const filePath = file.response.data.tmp_path
      //2.从pics数组中找到这个图片对应的索引
      const fileIndex = this.addForm.pics.findIndex(x => {
        x.pic==filePath
      })
      //3. 调用数组的splice进行删除
      this.addForm.pics.splice(fileIndex,1 )
      //console.log(this.addForm)

    },
    //图片上传成功触发
    handleSuccess(response){
      if(response.meta.status!=200)return this.$message.error('图片上传失败！')
      //1.拼接得到一个图片信息对象
      const picInfo = { pic:response.data.tmp_path }
      //2.将图片信息对象 push 到pic 数组中
      this.addForm.pics.push(picInfo)
      //console.log(this.addForm)
    },
    //添加商品
    add(){
      this.$refs.addFormRef.validate(valid=>{
        if(!valid) return this.$message.error('请填写必要的商品信息！')
        //执行添加商品的业务逻辑
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        //处理动态参数
        this.manyTableData.forEach(item=>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item=>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })

        //提交添加
        this.$http.post('goods',this.addForm).then(response=>{
          const res = response.data;
          if(res.meta.status!=201)return this.$message.error('添加商品失败！')
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
          //console.log(res)
        })
      })
    }
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length==3){
        return this.addForm.goods_cat[2]
      }
      return null;
    }
  }
}
</script>

<style scoped>
.el-card__body{
  height: 100%;
}
.el-checkbox{
  margin: 0 6px 0 0;
}
</style>