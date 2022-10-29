import request from '@/utils/request'

/**
 * 登录接口的封装
 * **/ 
// 按需导出  
export function login(data) {
  // 返回promise对象 
  return request({
    url:'/sys/login',
    method: 'POST',
    data,
    
  })

}

export function getInfo(token) {
 
}

export function logout() {
 
}
