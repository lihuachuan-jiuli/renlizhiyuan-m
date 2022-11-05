// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个name 属性
  component: Layout,
  children: [
    {
      // 二级路由的path 什么的不写的时候, 此时它表示二级路由的默认路由
      path: '',
      component: () => import('@/views/employees'),
      // 路由元信息 , 其实就是储存数据的对象, 我们可以在里面放一些信息
      meta: {
        title: '员工管理',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id', // ?的含义是表示该参数可传可不传  动态路由传参
      component: () => import('@/views/employees/detail'),
      hidden: true, // 表示该内容不在左侧显示
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
