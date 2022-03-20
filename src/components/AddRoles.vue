<template>
  <div class="addRoles">
    <!-- 角色添加对话框 -->
    <el-dialog :title="diaTitle" :visible.sync="dialogFormVisible " @close="dialogClose" :lock-scroll="false">
      <el-form :model="rolesInfo" status-icon :rules="addRolesrules" ref="addRolesFormRef" label-width="100px">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesInfo.roleName"></el-input>
        </el-form-item>
        <!-- 角色描述 -->
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectClickFun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:'AddRoles',
  props:['getRolesList'],
  data() {
    return {
      diaTitle:'',
      rolesInfo:{
        roleName:'',//角色名称
        roleDesc:'',//角色描述
      },
      addRolesrules:{
        roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc:[{ message: '请输入角色描述', trigger: 'blur' }]
      },
      dialogFormVisible:false,
      roleId: null,//编辑角色时，所获取角色Id
      selectClick:true,//点击确定时，选择触发 添加方法 还是 编辑方法

    }
  },
  mounted(){
    //监听添加角色的信息
    this.$bus.$on('adddialogFormVisible',adddialogFormVisible=>{
      this.dialogFormVisible = adddialogFormVisible;
      this.diaTitle = '添加角色';
      this.selectClick = true;//选择添加角色时，触发添加角色方法
      
    })
    //监听编辑角色
    this.$bus.$on('editdialogFormVisible',(editdialogFormVisible,res)=>{
      this.dialogFormVisible = editdialogFormVisible
      this.diaTitle = '编辑角色'
      this.rolesInfo.roleName = res.roleName;
      this.rolesInfo.roleDesc = res.roleDesc;
      this.roleId = res.roleId;//获取当前角色Id
      this.selectClick = false;//选择编辑角色时，触发编辑角色方法
    })
  },
  methods:{
    //对话框关闭时触发
    dialogClose(){
      this.$refs.addRolesFormRef.resetFields()//重置表单
      //关闭对话框时，清空里面的数据
      this.rolesInfo.roleName = '';
      this.rolesInfo.roleDesc = ''
    },
    //点击确定，添加角色
    addRoles(){
      this.$refs.addRolesFormRef.validate(valid=>{
        if(valid){
          this.$http.post('roles',this.rolesInfo).then(response=>{
          const res = response.data;
          // console.log(res)
          if(res.meta.status!=201)return this.$message.error('添加角色失败！')
          this.$message.success('添加角色成功')
          this.getRolesList()
        })
        }
      })
      //关闭对话框
      this.dialogFormVisible = false;
      
    },
    //点击确定，修改角色
    editRoles(){
      this.$refs.addRolesFormRef.validate(valid=>{
        if(valid){
          this.$http.put(`roles/${this.roleId}`,this.rolesInfo).then(response=>{
            const res = response.data;
            if(res.meta.status!=200)return this.$message.error('修改角色失败！')
            this.$message.success('修改角色成功')
            this.getRolesList()
          })
        }
      })
      //关闭对话框
      this.dialogFormVisible = false;
    },
    //点击确定，选择触发哪个方法
    selectClickFun(){
      if(this.selectClick){
        this.addRoles()
      }else{
        this.editRoles()
      }
    }
  }
}
</script>

<style>

</style>