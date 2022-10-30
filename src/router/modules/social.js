// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/social', // 路由地址
  name: 'social', // 给模块的一级路由加一个name 属性
  component: Layout,
  children: [{
    // 二级路由的path 什么的不写的时候, 此时它表示二级路由的默认路由
    path: '',
    component: () => import('@/views/social'),
    // 路由元信息 , 其实就是储存数据的对象, 我们可以在里面放一些信息
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
