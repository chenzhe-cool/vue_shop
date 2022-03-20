import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Goods from '../components/Goods.vue'
import Params from '../components/Params.vue'
import Categories from '../components/Categories.vue'
import Orders from '../components/Orders.vue'
import Reports from '../components/Reports.vue'
import AddGoods from '../components/AddGoods.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component: Welcome
      },
      {
        path:'/users',
        component: Users
      },
      {
        path:'/roles',
        component: Roles
      },
      {
        path:'/rights',
        component: Rights
      },
      {
        path:'/goods',
        component: Goods,
      },
      { path:'/goods/addGoods', component: AddGoods },
      {
        path:'/params',
        component: Params
      },
      {
        path:'/categories',
        component: Categories
      },
      {
        path:'/orders',
        component: Orders
      },
      {
        path:'/reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//挂载路由守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转过来
  //next 是一个函数，表示放行
  if(to.path=='/login'||to.path=='/register'){
    return next()
  }
  var tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next();
})

export default router
