import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// import { resetRouter} from '@/router'

// 状态
// 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
const state = {
  token: getToken(), // 设置token 为共享 // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} // 这里为什么不写null? 空对象 应为在getters 里面应用userinfo 的变量, 如果设置null 则会引起异常报错
}

// 修改状态
const mutations = {
  // 设置token  的mutations
  setToken(state, token) {
    state.token = token // 只是设置了vuex 中的数据
    // 需要将 vuex 中的数据同步 到缓存
    setToken(token)
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 设置vuex中的token 为null
    removeToken() // 同步删除缓存中的 token
  },

  // 设置用户信息
  setUserInfo(state, result) {
    // 更新对象
    state.userInfo = result // 这样是响应式
    // state.userInfo = {...result} // 这样也是响应式 属于浅拷贝
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }

}

// 执行异步
const actions = {
  // 封装一个登录的action
  // data 认为是{ mobile, password}
  // 只要用 async 标记了函数, 那么这个函数本身 就是promise 对象
  async login(context, data) {
    // 调用api接口
    // 经过响应拦截器的处理之后 这里的result实际上就是 token
    const result = await login(data) // 拿到token
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result) // 设置token
    setTimeStamp() // 设置当前的时间戳
  },

  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情 用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到 mutations
    return result // 这里为什么要返回 为后面做权限的时候 埋下伏笔
  },

  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
