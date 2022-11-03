// 负责所有全局自定义组件的注册

import PageToods from './pageTools'
import UploadExcel from './UploadExcel'
export default {
  install(Vue) {
    // 组件的注册
    Vue.component('PageTools', PageToods)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
  }
}

