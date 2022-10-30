import request from '@/utils/request'

/**
 * 登录接口的封装
 * **/
// 按需导出
export function login(data) {
  // 返回promise对象
  return request({
    url: '/sys/login',
    method: 'POST',
    data

  })
}
/**
 * 获取用户资料接口
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'

  })
}

/**
 * 根据用户id 获取用户的详情
 *  */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}
