<template>
  <el-dialog
    title="分配权限"
    :visible.sync="isShowDia"
    width="50%"
    :lock-scroll="false"
    @close="clearKeyList"
    >
    <!-- 树形控件 -->
    <el-tree
      :data="rightsListInfo"
      show-checkbox
      node-key="id"
      default-expand-all
      :props="defaultProps"
      :default-checked-keys="keylist"
      ref="treeRef"
      >
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isShowDia = false">取 消</el-button>
      <el-button type="primary" @click="assignRight">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script scoped>
export default {
  name:'AssignRightDialog',
  props:['getRolesList'],
  data() {
    return {
      isShowDia:false,
      rightsListInfo:[],
      scopeRow:[],
      //树形控件的属性绑定对象
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      keylist:[], //默认选择节点的id存放列表
      roleId:'',//获取当前角色Id
    }
  },
  created(){
    this.$bus.$on('ishowAssignRightDia',(ishowAssignRightDia,scopeRow)=>{
      this.isShowDia = ishowAssignRightDia
      this.scopeRow = scopeRow
      this.roleId = scopeRow.id
    })
    this.$bus.$on('getRightsList',(rightsList)=>{
      this.rightsListInfo = rightsList;
      //console.log('rightsListInfo',this.rightsListInfo)
      this.getLeafKeys(this.scopeRow,this.keylist)
    })
  },
  methods:{
    //通过递归的形式，获取角色下所有的三级权限ID
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      (node.children).forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    //监听对话框的关闭事件
    clearKeyList(){
      this.keylist=[]
    },
    //点击确定，为所有角色分配权限
    assignRight(){
      const keys = [
        ...(this.$refs.treeRef.getCheckedKeys()),
        ...(this.$refs.treeRef.getHalfCheckedKeys())
      ];
      const idStr = keys.join(',');
      this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(response=>{
        const res = response.data;
        //console.log(res)
        if(res.meta.status!=200) return this.$message.error('分配角色权限失败！')
        this.$message.success('分配权限成功');
        this.getRolesList();
        this.isShowDia = false;
      })
      
    }
  }

}

</script>

<style>

</style>