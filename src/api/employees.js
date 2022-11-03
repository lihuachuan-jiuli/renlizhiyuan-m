import request from '@/utils/request'

/**
 * 获取员工的简单列表
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工综合列表
 * **/
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 删除员工信息
 * **/
export function delEmployee(id) {
  return request({
    url: `/sys/user${id}`,
    method: 'delete'
  })
}

/**
 *
 * **/
export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 * 导入一个员工数据 , 参数data是一个数组类型
 * **/
export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 保存用户基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
