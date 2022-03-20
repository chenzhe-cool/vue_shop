<template>
  <div class="orders">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索订单 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" :clearable='true' @clear="getOrdersList">
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
      </el-input>
      <!-- 订单表单 -->
      <el-table
        :data="ordersList"
        border
        style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==0">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location-outline" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 底部分页导航 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:10px">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      @close="closeAddressDia"
      :lock-scroll="false"
      width="50%">
      <!-- 修改表单数据 -->
      <el-form ref="addressFormRef" :rules="addressFormRules" :model="addressForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择器 -->
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
        <!-- 对话框页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流信息对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      :lock-scroll="false"
      width="50%">
      <!-- 物流进度时间线 -->
      <el-timeline style="margin-left:50px">
        <el-timeline-item
          v-for="(activity, index) in kuaidiData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
        <!-- 对话框页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="progressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="progressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../assets/js/citydata.js'
import kuaidiData from '../assets/js/kuaidi.js'
export default {
  name:"Orders",
  data() {
    return {
      queryInfo:{
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      total:null,
      ordersList:[],
      dialogVisible:false,//是否显示修改地址对话框
      progressDialogVisible:false,//是否显示物流信息对话框
      addressForm:{
        address1:[],
        address2:''
    },//编辑地址表单数据
    addressFormRules:{
      address1:[{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
      address2:[{ required: true, message: '请输入详细地址', trigger: 'blur' }]
    },
    cityData:cityData,
    progressInfo:[],//存储物流信息
    kuaidiData: kuaidiData,//自定义快递信息
    
    }
  },
  created(){
    this.getOrdersList()
  },
  methods:{
    //获取订单列表
    getOrdersList(){
      this.$http.get('orders',{params:this.queryInfo}).then(resopnse=>{
        const res = resopnse.data
        //console.log(res)
        this.ordersList = res.data.goods;
        this.total = res.data.total;
        //console.log(this.ordersList)
      })
    },
    //监听pagesize改变的事件
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getOrdersList()
    },
    //监听 页码值 改变的事件
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getOrdersList()
    },
    //打开编辑对话框
    showBox(){
      this.dialogVisible = true
    },
    //关闭对话框时，重置里面的内容
    closeAddressDia(){
      this.$refs.addressFormRef.resetFields()
    },
    //展示物流信息对话框
    showProgressBox(){
      this.progressDialogVisible = true;
      //请求物流信息
      // this.$http.get('/kuaidi/804909574412544580').then(res=>{
      //   if(res.meta.status!=200)return this.$message.error('请求物流信息失败')
      //   this.progressInfo = res.data;
      //   console.log(res)
      // })
    }
  }
}
</script>

<style scoped>
.input-with-select{
  width: 300px !important;
  margin-bottom: 10px;
}
</style>>

</style>