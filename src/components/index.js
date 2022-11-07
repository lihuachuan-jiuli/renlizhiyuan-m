// 负责所有全局自定义组件的注册

import PageToods from './pageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreeFull'
import ThemePicker from './ThemePicker'
export default {
  install(Vue) {
    // 组件的注册
    Vue.component('PageTools', PageToods)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册图片上传组件
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
  }
}

