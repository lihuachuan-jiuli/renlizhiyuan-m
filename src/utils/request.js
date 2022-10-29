import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import store from '@/store'
import router from '@/router'
import { config } from '@vue/test-utils'
const TimeOut = 3600// 定义超时时间
const service = axios.create({
//    设置基础地址
// 环境变量 npm run dev  /api   /生产环境 npm run build  /prod-api
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 1000// 认为只要超过5秒钟不响应 就超时
})

// 请求拦截器
service.interceptors.request.use(config=>{
  // config 是请求的配置信息
  // 注入token
  if(store.getters.token){
    // 只有在有token 的情况下, 才有必要去检查时间戳是否超时
    if (IsCheckTimeOut()) {
      // 如果它为true表示 过期了
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }

    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }

  return config  //必须返回
},error=>{
  return Promise.reject(error)
})


// 响应拦截器
service.interceptors.response.use(response => {
  // 成功执行
  // axios默认加了一层data的包裹
  const { success, message, data } = response.data
  if (success) {
    // 此时认为业务执行成功了
    return data // 返回用户所需要的数据
  } else {
    // 当业务失败的时候
    Message.error(message) // 提示消息
    return Promise.reject(new Error(message))
  }
}, async error => {
  // error 有response对象 config
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉前端token超时了
    await store.dispatch('user/logout') // 调用登出action
    router.push('/login') // 跳到登录页
  }else{
    // 失败
  // Message等同于 this.$message
  Message.error(error.message) // 提示错误
  // reject
  
  }
  return Promise.reject(error) // 传入一个错误的对象  就认为promise执行链 进入了catch
  
})

// 是否超时
//超时逻辑 ( 当前时间 - 缓存中的时间 ) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}

export default service
