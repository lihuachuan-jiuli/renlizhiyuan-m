import axios from 'axios'
import {Message} from "element-ui"

const service = axios.create({
// 当执行 npm run dev => .env.development => /api => 跨域代理
  baseURL:process.env.VUE_APP_BASE_API, // /api  
  timeout: 5000 //设置超时时间
 
})

service.interceptors.request.use()

// 相应拦截器
service.interceptors.response.use((response)=>{
  // axios 默认加了一层data
  // 解构
 const {success, message, data} = response.data
//  判断 要根据 success 的成功与否 决定下面的操作
if(success){
  return data
}else {
  // 此时业务已经错误了, 应该进 catch
  Message.error(message)//提示错误信息
  return Promise.reject( new Error(message))
}

},error =>{
  Message.error(error.message)  //提示错误信息
   return Promise.reject(error) //返回执行错误 ,让当前的执行链条出成功, 直接进入 catch
})


export default service
