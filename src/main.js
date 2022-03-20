import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/css/global.css'
import VueQuillEditor from 'vue-quill-editor'//导入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$http=axios
//配置请求的根路径
//axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'  //本地服务器

axios.defaults.baseURL='http://121.40.236.13:8889/api/private/v1/' //阿里云服务器

axios.interceptors.request.use(config=>{
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

Vue.use(VueQuillEditor)

Vue.component('tree-table',TreeTable)
//全局的过滤器，进行时间格式化
Vue.filter('dateFormat',function(datestr){
  //根据给定的时间字符串，得到特定的时间
  var dt=new Date(datestr);
  //yyyy-mm-dd
  var y=dt.getFullYear();
  var m=dt.getMonth().toString().padStart(2,'0');//string.padstart(填充完毕后总长度,填充的字符);
  var d=dt.getDate().toString().padStart(2,'0');
  var hh=dt.getHours().toString().padStart(2,'0');
  var mm=dt.getMinutes().toString().padStart(2,'0');
  var ss=dt.getSeconds().toString().padStart(2,'0');
  //return y+'-'+ m +'-'+ d
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
})

new Vue({
  router,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this; 
}
}).$mount('#app')
