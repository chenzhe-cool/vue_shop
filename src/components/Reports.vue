<template>
  <div class="reports">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div id="main" style="width:800px; height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name:'Reports',
  data() {
    return {
      //需要合并的数据项
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  created(){
  },
  mounted(){
    //初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    //请求数据
    this.$http.get('reports/type/1').then(Response=>{
      const res = Response.data
      if(res.meta.status!=200)return this.$message.error('获取报表数据失败！')
      var reportsInfo = res.data
      //合并数据
      var optionsData = Object.assign(this.options,reportsInfo)
      //使用指定的数据渲染图标
      myChart.setOption(optionsData);
    })
    
  },
  methods:{
  }
}
</script>

<style scoped>

</style>