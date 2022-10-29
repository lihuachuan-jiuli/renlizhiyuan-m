// 路由权限 
// 权限拦截在路由跳转 导航守卫

import router from "@/router"
import store from "@/store" //引入store实例 和组件中的this.$store是一回事
import nProgress from "nprogress" //引入进度条
import "nprogress/nprogress.css" //引入进度条样式

// 不需要导出, 应为只需代码执行即可
// 前置守卫
//next 是前置守卫必须执行的钩子    next必须执行 如果不执行 页面就死了
// next() 放过过
//next(false) 跳转终止
// next( 地址) 跳转到指定地址
const whiteList = ['/login', '/404']  //定义白名单
router.beforeEach((to,from, next)=>{
  nProgress.start() //开启进度条
  //判断是否有token
  if(store.getters.token){

    // 判断是否访问登录页面
    if(to.path === '/long'){
      next('/') //调到主页 
    } else {
      next() 
    }

  } else{ //没有token 的情况下

    if(whiteList.indexOf(to.path) > -1){
      // 表示要去的地址在白名单
      next()  // 放过
    } else {
      next ('./login')  //没有白名单就跳转到登录页面 登录
    }
  
  }
  nProgress.done() //解决手动切换地址进度条不关闭
})
// 后置守卫
router.afterEach(()=>{
  nProgress.done() //关闭进度条
})
