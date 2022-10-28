import {getToken, setToken, removeToken, } from '@/utils/auth'
import { login, } from '@/api/user'
// import { resetRouter} from '@/router'

//状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
const state = {
  token: getToken(), //设置token 为共享 // 设置token初始状态   token持久化 => 放到缓存中
  userInfo:{} //这里为什么不写null?
}

//修改状态
const mutations = {
  //设置token  的mutations
  setToken(state, token){
    state.token = token  //只是设置了vuex 中的数据
    // 需要将 vuex 中的数据同步 到缓存
    setToken(token)
  },

  //删除缓存
  removeToken(state){
    state.token = null // 设置vuex中的token 为null
    removeToken()  //同步删除缓存中的 token
  }
}

// 执行异步
const actions = {
  // 封装一个登录的action
  //data 认为是{ mobile, password}
  // 只要用 async 标记了函数, 那么这个函数本身 就是promise 对象
  async login(context, data){
    //调用api接口
      // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) //拿到token
   // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit("setToken", result) //设置token
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}