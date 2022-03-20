<template>
  <div class="user">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索用户 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" :clearable='true' @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <!-- 添加用户 -->
      <el-button type="primary" plain style="margin-left:20px" @click="dialogFormVisible  = true">添加用户</el-button>
      
      <!-- 用户列表 -->
      <el-table border :data="userList" style="width: 100%;margin-top:10px">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="operation">
          <template slot-scope="scope">
            <!-- 编辑用户按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除用户 -->
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-button type="warning" icon="el-icon-star-off" size="mini" @click="assignRolesDia(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 用户添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible " @close="addDialogClose">
      <el-form :model="addUserInfo" status-icon :rules="addUserrules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserInfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.number="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="isShowEditDialog " @close="addDialogClose">
      <el-form :model="editUserInfo" status-icon :rules="addUserrules" ref="addUserFormRef" label-width="100px">
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.number="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowEditDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="isShowAssignDialog " @close="assignDialogClose">
      <el-form :model="assignUserInfo" status-icon ref="assignRolesFormRef" label-width="100px">
        <div>
          <p>当前的用户：{{assignUserInfo.username}}</p>
          <p>当前的角色：{{assignUserInfo.role_name}}</p>
          <p>
            <el-form-item label="分配新角色：" label-width="120">
              <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
    return {
      userList:[],
      dialogFormVisible:false,
      isShowEditDialog: false,
      isShowAssignDialog:false,
      total:0,
      queryInfo:{
        query:'',//获取用户列表的参数对象
        pagenum:1,//当前页数
        pagesize:5,//当前每页显示多少条数据
      },
      addUserInfo:{
        username:'',
        password:'',
        email:'',
        mobile:'',
      },
      addUserrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          //{ message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editUserInfo:{},
      //需要被分配角色的用户信息
      assignUserInfo:{},
      //所有角色的数据列表
      rolesList:[],
      //已选中角色ID值
      selectRoleId:''
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    getUserList(){
      this.$http.get('users',{ params:this.queryInfo }).then(Response=>{
        var res = Response.data;
        if(res.meta.status!=200) return this.$message.error('获取用户列表失败！');
        this.userList = res.data.users;
        this.total = res.data.total;
        // console.log(res);
      })
    },
    //展示用户编辑对话框
    showEditDialog(id){
      this.$http.get(`users/${id}`).then(Response=>{
        var res = Response.data;
        //console.log(res);
        if(res.meta.status!=200) return false;
        this.editUserInfo = res.data;
      })
      this.isShowEditDialog = true;
    },
    //用户编辑
    editUser() {
      this.$refs.addUserFormRef.validate(valid=>{
        if(!valid) return false;
        //验证通过，则发起修改请求
        this.$http.put('users/'+ this.editUserInfo.id,{
          email:this.editUserInfo.email,
          mobile:this.editUserInfo.mobile
          }).then(Response=>{
        var res = Response.data;
        if(res.meta.status!=200){
          return this.$message.error('更新用户信息失败！');
        }
        //关闭对话框
        this.isShowEditDialog = false; 
        //刷新数据列表
        this.getUserList();
        //提示更新成功
        this.$message.success('更新用户信息成功');
      })
      })
    },
    //根据 ID 删除用户
    handleDelete(id) {
      //弹框询问是否删除 
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((confirm) => {
          //如果确认删除，则会返回一个字符串 confirm
          //console.log(res); //confirm
          //删除用户
          this.$http.delete('users/'+id).then(Response=>{
            var res = Response.data;
            if(res.meta.status!=200) return this.$message.error('删除用户失败！')
            this.$message.success('删除成功!');
            this.getUserList();
          })
        }).catch(() => {
          //如果取消删除，则会返回一个字符串 cancel
          this.$message.info('已取消删除');          
        });
        
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getUserList()
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getUserList()
    },
    //用户状态改变时触发的事件
    userStatusChange(userinfo){
      this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`).then(Response=>{
        var res = Response.data;
        if(res.meta.status!=200){
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error('更新用户状态失败！');
        }
        this.$message.success('更新用户状态成功');
      })
    },
    //监听用户关闭 Dialog 对话框
    addDialogClose(){
      this.$refs.addUserFormRef.resetFields()
    },
    //监听用户关闭 分配角色Dialog 对话框，进行重置
    assignDialogClose(){
      this.selectRoleId='',
      this.assignUserInfo={}
    },
    //添加用户事件
    addUser(){
      this.$refs.addUserFormRef.validate((valid) => {
        if (valid) {
          // this.$message.success('submit!');
          this.$http.post('users',this.addUserInfo).then(Response=>{
            var res = Response.data;
            //console.log('res',res);
            if(res.meta.status!=201) return this.$message.error('添加用户失败！');
            this.$message.success('添加用户成功！')
            this.dialogFormVisible = false;
            this.getUserList()
          })
        } else {
          this.$message.error('error submit!!');
          return false;
        }
      });
    },
    //点击弹出分配角色对话框
    assignRolesDia(assignUserInfo){
      this.assignUserInfo = assignUserInfo;

      //展示对话框前，先获取角色列表
      this.$http.get('roles').then(resp=>{
        const res = resp.data;
        if(res.meta.status!=200) return this.$message.error("获取分配角色信息失败！")
        this.rolesList = res.data
      })
      this.isShowAssignDialog = true;
    },
    //当分配角色对话框点击 确定 时触发，并分配角色
    assignRoles(){
      // console.log(this.selectRoleId)
      if(!this.selectRoleId) return this.$message.warning("请选择需要分配的角色")
      //选择角色后提交
      this.$http.put(`users/${this.assignUserInfo.id}/role`,{
        rid:this.selectRoleId
        }).then(resp=>{
        const res = resp.data;
        if(res.meta.status!=200) return this.$message.error("角色分配失败！")
        this.$message.success("分配角色成功");
        this.getUserList()
      })
      this.isShowAssignDialog = false
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
.input-with-select{
  width: 300px !important;
}
.operation{
  display: flex;
  justify-content: center;
}
</style>