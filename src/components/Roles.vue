<template>
  <div class="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card class="box-card">
      <el-button type="primary" plain class="btn" @click="addroles">添加角色</el-button>
      <el-table
        :data="rolesList"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom','vcenter', idex == 0 ?'bdtop':'']" v-for="(item,idex) in scope.row.children" :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag 
                closable
                @close="removeRightsById(scope.row,item.id)"
                >{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19" >
                <el-row :class="['vcenter', index == 0 ?'':'bdtop']" v-for="(i,index) in item.children" :key="i.id">
                  <el-col :span="6">
                    <el-tag 
                    type='success'
                    closable
                    @close="removeRightsById(scope.row,i.id)"
                    >{{i.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag 
                    type='warning' 
                    v-for="i1 in i.children" 
                    :key="i1.id"
                    closable
                    @close="removeRightsById(scope.row,i1.id)"
                    >{{i1.authName}}</el-tag>
                  </el-col>
                </el-row>
                
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="120"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" > </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" > </el-table-column>
        <el-table-column prop="" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoles(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="assignRightDia(scope.row)">分配权限</el-button>    
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <assign-right-dialog :getRolesList="getRolesList"></assign-right-dialog>
    <add-roles :getRolesList="getRolesList"></add-roles>
  </div>
</template>

<script>
import AssignRightDialog from './AssignRightDialog.vue'
import AddRoles from './AddRoles.vue'
export default {
  name:'Roles',
  components:{ AssignRightDialog, AddRoles },
  data() {
    return {
      rolesList:[],
      rightsList:[],
      ishowAssignRightDia:false,//权限分配对话框
      adddialogFormVisible:false,//添加角色对话框
      editdialogFormVisible:false,//编辑角色对话框
    }
  },
  created(){
    this.getRolesList();
  },
  methods:{
    getRolesList(){
      this.$http.get('roles/').then(Response=>{
        var res = Response.data;
        if(res.meta.status!=200) return this.$message.error("获取角色列表失败！")
        this.rolesList=res.data;
        //console.log(res)
      })
    },
    getRightsList(){
      this.$http.get('rights/tree').then(res=>{
        var res = res.data;
        if(res.meta.status!=200) return this.$message.error('获取权限列表失败！')
        this.rightsList = res.data;
        this.$bus.$emit('getRightsList',this.rightsList);
        // console.log(res.data)
      })
    },
    removeRightsById(role,rightId){
      //弹框询问是否删除 
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((confirm) => {
        //如果确认删除，则会返回一个字符串 confirm
        //console.log(res); //confirm
        //删除用户
        this.$http.delete(`roles/${role.id}/rights/${rightId}`).then(Response=>{
          var res = Response.data;
          if(res.meta.status!=200) return this.$message.error('删除标签失败！')
          this.$message.success('删除成功!');
          role.children = res.data;
        })
      }).catch(() => {
        //如果取消删除，则会返回一个字符串 cancel
        this.$message.info('已取消删除');          
      });
    },
    assignRightDia(scopeRow){
      this.ishowAssignRightDia = true;
      this.$bus.$emit('ishowAssignRightDia',this.ishowAssignRightDia,scopeRow);
      this.getRightsList();
      
      // console.log('111111',this.rightsList)
      
    },
    //添加角色弹框
    addroles(){
      this.adddialogFormVisible = true;
      this.$bus.$emit('adddialogFormVisible',this.adddialogFormVisible)
    },
    //编辑角色
    editRoles(id){
      //console.log('编辑',id)
      this.editdialogFormVisible = true;
      this.$http.get(`roles/${id}`).then(response=>{
        const res =response.data;
        if(res.meta.status!=200)return
        
        this.$bus.$emit('editdialogFormVisible',this.editdialogFormVisible,res.data)
      })
      
      
    },
    //删除角色
    deleteRoles(id){
      //console.log('删除',id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning',
      }).then(() => {
        this.$http.delete(`roles/${id}`).then(response=>{
          const res = response.data;
          if(res.meta.status!=200)return this.$message.error('删除角色失败！')
          this.$message.success('删除角色成功')
          this.getRolesList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
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
.btn{
  margin-bottom: 10px;
}

.el-tag{
  margin: 7px;
  
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom:1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
