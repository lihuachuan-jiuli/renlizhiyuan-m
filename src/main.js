import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'
import components from './components'

import * as directives from './directives'
import * as filters from '@/filters' // * as 所有方法的对象集合
import checkPermission from '@/mixin/checkPermission'
import '@/icons' // icon
import '@/permission' // permission control
import Print from 'vue-print-nb'
Vue.use(Print)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI);
// console.log( directives)
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 注册自定义指令
})
Object.keys(filters).forEach(key => {
  // 注册自定义过滤器
  Vue.filter(key, filters[key])
})

// 注册自定义组件
Vue.use(components)
// 全局混入检查对象
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
